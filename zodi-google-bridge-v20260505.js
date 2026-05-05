import { c as getProfile, m as saveProfile, u as signInGoogle } from './assets/firebase-Da5Ak7kD.js';

const SESSION_KEY = 'zodi-demo-user';
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

function lifeNumber(date) {
  const digits = String(date || '').replace(/\D/g, '').split('').map(Number);
  let n = digits.reduce((sum, d) => sum + d, 0);
  while (n > 9 && ![11, 22, 33].includes(n)) {
    n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return n || 7;
}

function personalYear(date) {
  const [, month = '11', day = '07'] = String(date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/) || [];
  return lifeNumber(`${new Date().getFullYear()}-${month}-${day}`);
}

function localGoogleProfile() {
  return {
    uid: 'google-local-review',
    email: 'google.review@zodi.local',
    alias: 'Nodo-GOOGLE',
    username: 'google-review',
    communityEmail: 'google.review@zodi.local',
    fecha: '1995-11-07',
    hora: '12:00',
    ciudad: 'Madrid',
    pais: 'es',
    nivel: 'normal',
    plan: 'free',
    offerLater: true,
    sign: 'Escorpio',
    signSymbol: '♏',
    lifeNum: 6,
    yearNum: 1,
    interests: ['horoscopo', 'tarot', 'compatibilidad'],
    provider: 'google-local-preview',
    needsProfileReview: true
  };
}

function buildProfile(firebaseUser, existing = {}) {
  const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Google';
  const date = existing.fecha || existing.date || '1995-11-07';
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || existing.email || '',
    alias: existing.alias || `Nodo-${displayName.replace(/\W+/g, '').slice(0, 8).toUpperCase() || 'GOOGLE'}`,
    username: existing.username || (firebaseUser.email || displayName).toLowerCase().replace(/@.*/, '').replace(/[^a-z0-9._-]/g, ''),
    communityEmail: existing.communityEmail || firebaseUser.email || '',
    fecha: date,
    hora: existing.hora || '12:00',
    ciudad: existing.ciudad || 'Madrid',
    pais: existing.pais || 'es',
    nivel: existing.nivel || 'normal',
    plan: existing.plan || 'free',
    offerLater: existing.offerLater ?? true,
    sign: existing.sign || 'Escorpio',
    signSymbol: existing.signSymbol || '♏',
    lifeNum: existing.lifeNum || lifeNumber(date),
    yearNum: existing.yearNum || personalYear(date),
    interests: existing.interests || ['horoscopo', 'tarot', 'compatibilidad'],
    provider: 'google',
    needsProfileReview: !existing.sign
  };
}

function setButtonState(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.style.opacity = busy ? '0.75' : '';
  button.textContent = busy ? 'Conectando con Google...' : 'Continuar con Google';
}

function storeAndEnter(profile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('zodi:google-session', { detail: profile }));
  window.location.reload();
}

async function handleGoogle(button) {
  setButtonState(button, true);
  if (LOCAL_HOSTS.has(window.location.hostname) && !window.ZODI_FORCE_REAL_GOOGLE) {
    storeAndEnter(localGoogleProfile());
    return;
  }
  try {
    const firebaseUser = await signInGoogle();
    const existing = await getProfile(firebaseUser.uid).catch(() => null);
    const profile = buildProfile(firebaseUser, existing || {});
    await saveProfile(firebaseUser.uid, profile).catch(error => {
      console.warn('ZODI profile save skipped:', error);
    });
    storeAndEnter(profile);
  } catch (error) {
    console.warn('ZODI Google login fallback:', error);
    if (LOCAL_HOSTS.has(window.location.hostname)) {
      storeAndEnter(localGoogleProfile());
      return;
    }
    alert('No se pudo abrir Google. Revisa que Firebase tenga habilitado Google y que este dominio este autorizado.');
    setButtonState(button, false);
  }
}

function isGoogleButton(target) {
  const button = target?.closest?.('button');
  if (!button) return null;
  const text = button.textContent || '';
  return /google/i.test(text) ? button : null;
}

document.addEventListener('click', event => {
  const button = isGoogleButton(event.target);
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  handleGoogle(button);
}, true);

const replacements = new Map([
  ['Conectate con Google', 'Continuar con Google'],
  ['Olvide mi contraseña', 'Olvide mi contrasena'],
  ['LLAVE CRIPTICA (CONTRASEÑA)', 'CONTRASENA'],
  ['ENTRAR A LA MATRIX', 'ENTRAR A ZODI'],
  ['CORREO O USUARIO', 'EMAIL O USUARIO'],
  ['HORÃ“SCOPO', 'HOROSCOPO'],
  ['DÃAS', 'DIAS'],
  ['prÃ³ximas', 'proximas'],
  ['mÃ­sticas', 'misticas'],
  ['OrÃ¡culos', 'Oraculos'],
  ['orÃ¡culos', 'oraculos'],
  ['cÃ³smico', 'cosmico'],
  ['cÃ³smica', 'cosmica'],
  ['cÃ³smicos', 'cosmicos'],
  ['Â¿', '¿'],
  ['NUMEROLOGÃA', 'NUMEROLOGIA'],
  ['vibraciÃ³n', 'vibracion'],
  ['aÃ±o', 'ano'],
  ['energÃ­a', 'energia'],
  ['SabidurÃ­a', 'Sabiduria'],
  ['nÃ³rdica', 'nordica'],
  ['SincronizaciÃ³n', 'Sincronizacion'],
  ['Ã¡rbol', 'arbol'],
  ['fÃ­sicos', 'fisicos'],
  ['sueÃ±os', 'suenos'],
  ['onÃ­rico', 'onirico'],
  ['anÃ¡lisis', 'analisis'],
  ['cuÃ¡ntico', 'cuantico'],
  ['disposiciÃ³n', 'disposicion'],
  ['mÃ³dulo', 'modulo'],
  ['mÃ³dulos', 'modulos'],
  ['BIOMETRÃA', 'BIOMETRIA'],
  ['SUSCRIPCIï¿½\u001cN', 'SUSCRIPCION'],
  ['INTUICIï¿½\u001cN', 'INTUICION']
]);

function polishText(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    let text = node.nodeValue;
    for (const [from, to] of replacements) text = text.replaceAll(from, to);
    node.nodeValue = text;
  }
}

const observer = new MutationObserver(() => polishText());
observer.observe(document.documentElement, { childList: true, subtree: true });
polishText();
