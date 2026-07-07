<?php
/**
 * ZODI API Bridge v3.2
 * Multi-provider: Anthropic Claude + OpenAI
 * Compatible: PHP 7.4+ (Hostinger shared hosting safe)
 */

// ─── 0. ERROR HANDLING ────────────────────────────────────────────────────────
// Never expose PHP errors to the client — log them server-side only
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ─── 0.1 BOOTSTRAP ────────────────────────────────────────────────────────────
$secretFile   = dirname(__DIR__) . '/.zodi-secret.php';
$secretConfig = (file_exists($secretFile) && is_readable($secretFile))
    ? include $secretFile
    : [];
if (!is_array($secretConfig)) { $secretConfig = []; }

// ─── 1. CORS ──────────────────────────────────────────────────────────────────
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$host   = isset($_SERVER['HTTP_HOST'])   ? $_SERVER['HTTP_HOST']   : '';
$remoteAddr = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';

// Is request coming from localhost / dev environment?
$isLocal = in_array($remoteAddr, ['127.0.0.1', '::1', '::ffff:127.0.0.1'], true)
    || (bool) preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin);

// Build allowed origins: same host + any extras from config
$allowedOrigins = array_merge(
    ['https://' . $host, 'https://www.' . $host],
    isset($secretConfig['ALLOWED_ORIGINS']) ? (array) $secretConfig['ALLOWED_ORIGINS'] : []
);

// Always send these headers first
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

if ($isLocal || in_array($origin, $allowedOrigins, true)) {
    $corsOrigin = ($isLocal && $origin === '') ? '*' : $origin;
    header('Access-Control-Allow-Origin: ' . $corsOrigin);
    if (!$isLocal) { header('Vary: Origin'); }
} else {
    // Origin not in whitelist — still allow if no origin header (direct server call)
    if ($origin !== '') {
        sendError('Origen no autorizado', 403);
    }
    header('Access-Control-Allow-Origin: *'); // fallback for same-domain requests without Origin
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── 2. RATE LIMITING (file-based, PHP 7.4+ compatible) ──────────────────────
$ip      = $remoteAddr ?: '0.0.0.0';
$rlFile  = sys_get_temp_dir() . '/zodi_rl_' . md5($ip);
$now     = time();
$window  = 60;   // 1-minute window
$maxReqs = 25;   // max requests per minute per IP

$hits = [];
if (file_exists($rlFile)) {
    $raw  = @file_get_contents($rlFile);
    $data = $raw ? json_decode($raw, true) : null;
    if (is_array($data)) {
        foreach ($data as $ts) {
            if ((int)$ts > $now - $window) { $hits[] = (int)$ts; }
        }
    }
}

if (count($hits) >= $maxReqs) {
    header('Retry-After: ' . $window);
    sendError('Demasiadas solicitudes. Espera un momento.', 429);
}

$hits[] = $now;
@file_put_contents($rlFile, json_encode(array_values($hits)), LOCK_EX);

// ─── 3. INPUT VALIDATION ──────────────────────────────────────────────────────
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metodo no permitido', 405);
}

$rawInput = file_get_contents('php://input');
if ($rawInput === false || strlen($rawInput) > 32768) {
    sendError('Solicitud demasiado grande o ilegible', 413);
}

$input = json_decode($rawInput, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($input)) {
    sendError('Formato JSON invalido', 400);
}

$systemPrompt = isset($input['system'])   ? trim((string)$input['system'])   : '';
$userPrompt   = isset($input['prompt'])   ? trim((string)$input['prompt'])   : '';
$provider     = isset($input['provider']) ? strtolower(trim((string)$input['provider'])) : 'claude';

if ($systemPrompt === '' || $userPrompt === '') {
    sendError('Parametros requeridos: system y prompt', 422);
}
if (strlen($systemPrompt) > 8192 || strlen($userPrompt) > 8192) {
    sendError('Parametro demasiado largo (max. 8192 caracteres)', 422);
}
if (!in_array($provider, ['claude', 'openai'], true)) {
    $provider = 'claude';
}

// ─── 4. LOAD API KEYS ─────────────────────────────────────────────────────────
$claudeKey = getenv('CLAUDE_API_KEY');
if (empty($claudeKey) && isset($secretConfig['CLAUDE_API_KEY'])) {
    $claudeKey = $secretConfig['CLAUDE_API_KEY'];
}

$openaiKey = getenv('OPENAI_API_KEY');
if (empty($openaiKey) && isset($secretConfig['OPENAI_API_KEY'])) {
    $openaiKey = $secretConfig['OPENAI_API_KEY'];
}

// ─── 5. CALL PROVIDER ─────────────────────────────────────────────────────────
if ($provider === 'openai') {
    if (empty($openaiKey)) {
        sendError('OpenAI no esta configurado en el servidor', 500);
    }
    $responseText = callOpenAI($openaiKey, $systemPrompt, $userPrompt);
} else {
    if (empty($claudeKey)) {
        sendError('Claude no esta configurado en el servidor', 500);
    }
    $responseText = callClaude($claudeKey, $systemPrompt, $userPrompt);
}

// ─── 6. SUCCESS RESPONSE ──────────────────────────────────────────────────────
echo json_encode([
    'status' => 'success',
    'data'   => [
        'text'      => $responseText,
        'provider'  => $provider,
        'timestamp' => $now,
    ],
]);
exit;

// ─── FUNCTIONS ────────────────────────────────────────────────────────────────

function callClaude($apiKey, $system, $prompt)
{
    $payload = [
        'model'      => 'claude-sonnet-4-5',
        'max_tokens' => 1200,
        'system'     => $system,
        'messages'   => [['role' => 'user', 'content' => $prompt]],
    ];
    $res  = httpPost(
        'https://api.anthropic.com/v1/messages',
        $payload,
        [
            'x-api-key: '          . $apiKey,
            'anthropic-version: 2023-06-01',
            'Content-Type: application/json',
        ]
    );
    $body = json_decode($res['body'], true);
    if (!is_array($body)) {
        sendError('Respuesta inesperada de Claude', 502);
    }
    if ($res['code'] !== 200) {
        $msg = isset($body['error']['message']) ? $body['error']['message'] : 'Error en la API de Claude';
        sendError($msg, ($res['code'] >= 500) ? 502 : $res['code']);
    }
    if (empty($body['content'][0]['text'])) {
        sendError('Respuesta vacia de Claude', 502);
    }
    return $body['content'][0]['text'];
}

function callOpenAI($apiKey, $system, $prompt)
{
    $payload = [
        'model'      => 'gpt-4o-mini',
        'max_tokens' => 1200,
        'messages'   => [
            ['role' => 'system', 'content' => $system],
            ['role' => 'user',   'content' => $prompt],
        ],
    ];
    $res  = httpPost(
        'https://api.openai.com/v1/chat/completions',
        $payload,
        [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ]
    );
    $body = json_decode($res['body'], true);
    if (!is_array($body)) {
        sendError('Respuesta inesperada de OpenAI', 502);
    }
    if ($res['code'] !== 200) {
        $msg = isset($body['error']['message']) ? $body['error']['message'] : 'Error en la API de OpenAI';
        sendError($msg, ($res['code'] >= 500) ? 502 : $res['code']);
    }
    if (empty($body['choices'][0]['message']['content'])) {
        sendError('Respuesta vacia de OpenAI', 502);
    }
    return $body['choices'][0]['message']['content'];
}

function httpPost($url, $payload, $headers)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $body   = curl_exec($ch);
    $errno  = curl_errno($ch);
    $errmsg = curl_error($ch);
    $code   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($errno || $body === false) {
        sendError('Error de red (cURL ' . $errno . '): ' . $errmsg, 503);
    }
    return ['body' => (string)$body, 'code' => $code];
}

function sendError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode([
        'status'    => 'error',
        'code'      => $code,
        'message'   => $message,
        'timestamp' => time(),
    ]);
    exit;
}
