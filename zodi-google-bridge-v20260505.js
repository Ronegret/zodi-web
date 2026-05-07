/**
 * ZODI Google Auth Bridge v2 — 2026-05-07
 * - Login con Google via Firebase
 * - Sin window.location.reload() innecesario: despacha evento y deja que React reaccione
 * - Fallback limpio para entornos locales
 */
import { c as getProfile, m as saveProfile, u as signInGoogle } from './assets/firebase-Da5Ak7kD.js';

const SESSION_KEY = 'zodi-demo-user';
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

// ─── NUMEROLOGY ───────────────────────────────────────────────────────────────
function lifeNumber(date) {
  const digits = String(date || '').replace(/\D/g, '').split('').map(Number);
  let n = digits.reduce((s, d) => s + d, 0);
  while (n > 9 && ![11, 22, 33].includes(n)) {
    n = String(n).split('').reduce((s, d) => s + Number(d), 0);
  }
  return n || 7;
}

function personalYear(date) {
  const [, month = '11', day = '07'] = String(date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/) || [];
  return lifeNumber(`${new Date().getFullYear()}-${month}-${day}`);
}

// ─── PROFILE BUILDERS ────────────────────────────────────────────────────────
function localGoogleProfile() {
  return {
    uid:              'google-local-review',
    email:            'google.review@zodi.local',
    alias:            'Nodo-GOOGLE',
    username:         'google-review',
    communityEmail:   'google.review@zodi.local',
    fecha:            '1995-11-07',
    hora:             '12:00',
    ciudad:           'Madrid',
    pais:             'es',
    nivel:            'normal',
    plan:             'free',
    offerLater:       true,
    sign:             'Escorpio',
    signSymbol:       '♏',
    lifeNum:          6,
    yearNum:          1,
    interests:        ['horoscopo', 'tarot', 'compatibilidad'],
    provider:         'google-local-preview',
    needsProfileReview: true,
  };
}

function buildProfile(firebaseUser, existing = {}) {
  const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google';
  const date        = existing.fecha || existing.date || '1995-11-07';
  return {
    uid:            firebaseUser.uid,
    email:          firebaseUser.email || existing.email || '',
    alias:          existing.alias || `Nodo-${displayName.replace(/\W+/g, '').slice(0, 8).toUpperCase() || 'GOOGLE'}`,
    username:       existing.username || (firebaseUser.email || displayName).toLowerCase().replace(/@.*/, '').replace(/[^a-z0-9._-]/g, ''),
    communityEmail: existing.communityEmail || firebaseUser.email || '',
    fecha:          date,
    hora:           existing.hora    || '12:00',
    ciudad:         existing.ciudad  || 'Madrid',
    pais:           existing.pais    || 'es',
    nivel:          existing.nivel   || 'normal',
    plan:           existing.plan    || 'free',
    offerLater:     existing.offerLater ?? true,
    sign:           existing.sign    || 'Escorpio',
    signSymbol:     existing.signSymbol || '♏',
    lifeNum:        existing.lifeNum || lifeNumber(date),
    yearNum:        existing.yearNum || personalYear(date),
    interests:      existing.interests || ['horoscopo', 'tarot', 'compatibilidad'],
    provider:       'google',
    needsProfileReview: !existing.sign,
  };
}

// ─── SESSION STORAGE ──────────────────────────────────────────────────────────
function storeSession(profile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  // Dispatch event so React can pick up the new session without a full reload
  window.dispatchEvent(new CustomEvent('zodi:google-session', { detail: profile }));
  // Only reload if the React app hasn't handled the event within 300ms
  let reloadNeeded = true;
  window.addEventListener('zodi:session-handled', () => { reloadNeeded = false; }, { once: true });
  setTimeout(() => { if (reloadNeeded) window.location.reload(); }, 300);
}

// ─── BUTTON STATE ─────────────────────────────────────────────────────────────
function setButtonState(btn, busy) {
  if (!btn) return;
  btn.disabled     = busy;
  btn.style.opacity = busy ? '0.75' : '';
  btn.textContent  = busy ? 'Conectando con Google...' : 'Continuar con Google';
}

// ─── GOOGLE LOGIN FLOW ────────────────────────────────────────────────────────
async function handleGoogle(btn) {
  setButtonState(btn, true);

  if (LOCAL_HOSTS.has(window.location.hostname) && !window.ZODI_FORCE_REAL_GOOGLE) {
    storeSession(localGoogleProfile());
    return;
  }

  try {
    const firebaseUser = await signInGoogle();
    const existing     = await getProfile(firebaseUser.uid).catch(() => null);
    const profile      = buildProfile(firebaseUser, existing || {});
    await saveProfile(firebaseUser.uid, profile).catch(err => {
      console.warn('[ZODI] Profile save skipped:', err?.message || err);
    });
    storeSession(profile);
  } catch (err) {
    console.warn('[ZODI] Google login error:', err?.message || err);
    if (LOCAL_HOSTS.has(window.location.hostname)) {
      storeSession(localGoogleProfile());
      return;
    }
    alert('No se pudo abrir Google. Verifica que Firebase tenga habilitado Google Sign-In y que este dominio esté autorizado.');
    setButtonState(btn, false);
  }
}

// ─── CLICK DELEGATION ────────────────────────────────────────────────────────
document.addEventListener('click', event => {
  const btn = event.target?.closest?.('button');
  if (!btn || !/google/i.test(btn.textContent)) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  handleGoogle(btn);
}, true);

// ─── TEXT REPAIR (encoding fixes only, no DOM polling) ───────────────────────
const replacements = new Map([
  ['Conectate con Google',            'Continuar con Google'],
  ['Olvide mi contraseña',            'Olvide mi contrasena'],
  ['LLAVE CRIPTICA (CONTRASEÑA)',     'CONTRASENA'],
  ['ENTRAR A LA MATRIX',              'ENTRAR A ZODI'],
  ['CORREO O USUARIO',                'EMAIL O USUARIO'],
  ['HORÃ"SCOPO',                     'HOROSCOPO'],
  ['DÃAS',                           'DIAS'],
  ['prÃ³ximas',                      'proximas'],
  ['mÃ­sticas',                      'misticas'],
  ['OrÃ¡culos',                      'Oraculos'],
  ['cÃ³smico',                       'cosmico'],
  ['cÃ³smica',                       'cosmica'],
  ['Â¿',                             '¿'],
  ['NUMEROLOGÃA',                    'NUMEROLOGIA'],
  ['vibraciÃ³n',                     'vibracion'],
  ['aÃ±o',                           'ano'],
  ['energÃ­a',                       'energia'],
  ['SabidurÃ­a',                     'Sabiduria'],
  ['nÃ³rdica',                       'nordica'],
  ['SincronizaciÃ³n',                'Sincronizacion'],
  ['anÃ¡lisis',                      'analisis'],
  ['cuÃ¡ntico',                      'cuantico'],
  ['mÃ³dulo',                        'modulo'],
  ['BIOMETRÃA',                      'BIOMETRIA'],
]);

function polishText(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes  = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  for (const n of nodes) {
    let text = n.nodeValue;
    for (const [from, to] of replacements) text = text.replaceAll(from, to);
    if (text !== n.nodeValue) n.nodeValue = text;
  }
}

// Run once on load, then observe mutations (no polling)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => polishText(), { once: true });
} else {
  polishText();
}

const _observer = new MutationObserver(records => {
  for (const r of records) {
    for (const node of r.addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        for (const [from, to] of replacements) text = text.replaceAll(from, to);
        if (text !== node.nodeValue) node.nodeValue = text;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        polishText(node);
      }
    }
  }
});
_observer.observe(document.documentElement, { childList: true, subtree: true });
