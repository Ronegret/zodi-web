<?php
/**
 * ZODI OS - BACKEND CORE v2.6.0
 * High-Performance Astrology API Bridge
 * Optimized for Hostinger / Shared Hosting Environments
 */

// 1. SECURITY & CORS HEADERS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Handle Preflight Options Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. INPUT VALIDATION
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Acceso no autorizado', 405);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Formato de entrada inválido', 400);
}

$systemPrompt = $input['system'] ?? null;
$userPrompt   = $input['prompt'] ?? null;

if (!$systemPrompt || !$userPrompt) {
    sendError('Parámetros marianos insuficientes (system/prompt)', 422);
}

// 3. API CONFIGURATION (ANTHROPIC CLAUDE)
// Preferred: set CLAUDE_API_KEY as a server environment variable.
// Hostinger fallback: create a file named ".zodi-secret.php" one level above public_html:
// <?php return ['CLAUDE_API_KEY' => 'tu_clave_privada'];
$secretFile = dirname(__DIR__) . '/.zodi-secret.php';
$secretConfig = file_exists($secretFile) ? include $secretFile : [];
$claudeApiKey = getenv('CLAUDE_API_KEY') ?: ($secretConfig['CLAUDE_API_KEY'] ?? '');
if (!$claudeApiKey) {
    sendError('API key no configurada en el servidor', 500);
}
define('CLAUDE_API_KEY', $claudeApiKey);
define('CLAUDE_API_URL', 'https://api.anthropic.com/v1/messages');
define('CLAUDE_VERSION', '2023-06-01');

// 4. REQUEST EXECUTION
$payload = [
    'model'      => 'claude-3-5-sonnet-latest',
    'max_tokens' => 900,
    'system'     => $systemPrompt,
    'messages'   => [
        ['role' => 'user', 'content' => $userPrompt]
    ]
];

$ch = curl_init(CLAUDE_API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . CLAUDE_API_KEY,
        'anthropic-version: ' . CLAUDE_VERSION
    ],
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$errNo    = curl_errno($ch);
$errMsg   = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 5. RESPONSE HANDLING
if ($errNo) {
    sendError("Error de Red (CURL $errNo): $errMsg", 503);
}

$decodedResponse = json_decode($response, true);

if ($httpCode !== 200) {
    $apiError = $decodedResponse['error']['message'] ?? 'Error de respuesta de la API externa';
    sendError("API Gateway Error ($httpCode): $apiError", $httpCode);
}

// 6. SUCCESS RESPONSE
$finalText = $decodedResponse['content'][0]['text'] ?? 'Sin respuesta del oráculo';

echo json_encode([
    'status' => 'success',
    'data'   => [
        'text' => $finalText,
        'model' => 'claude-3-5-sonnet',
        'timestamp' => time()
    ]
]);

function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'code'   => $code,
        'message' => $message,
        'timestamp' => time()
    ]);
    exit;
}
