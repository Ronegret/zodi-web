// ═══════════════════════════════════════════════
// ZODI AUTH — Firebase-ready auth layer
// Replace firebaseConfig with your real config
// ═══════════════════════════════════════════════

// ── FIREBASE CONFIG (replace with your project) ──
// To enable real Firebase:
// 1. Go to console.firebase.google.com
// 2. Create project → Add web app
// 3. Copy your firebaseConfig object here
// 4. Enable Authentication → Email/Password
// 5. (Optional) Enable Google Sign-In

const FIREBASE_CONFIG = null; // Set your config object here

// ── LOCAL AUTH (works without Firebase) ──
const DB_KEY = 'zodi_users_v2';
const SESSION_KEY = 'zodi_session_v2';

function getDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch { return {}; }
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY + '_persist') || 'null'); } catch { return null; }
}
function saveSession(user, persist = false) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (persist) localStorage.setItem(SESSION_KEY + '_persist', JSON.stringify(user));
}
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY + '_persist');
}

// Hash password (basic — Firebase handles this for real)
async function hashPw(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw + 'zodi_salt_2026'));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

const ZodiAuth = {
  currentUser: null,

  async init() {
    this.currentUser = getSession();
    return this.currentUser;
  },

  async register(email, password, displayName) {
    const db = getDB();
    const key = email.toLowerCase().trim();
    if (db[key]) throw new Error('Este email ya tiene una cuenta en ZODI.');
    const hash = await hashPw(password);
    const user = {
      uid: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      email: key,
      displayName,
      hash,
      plan: 'free',
      createdAt: Date.now(),
      profile: null,
    };
    db[key] = user;
    saveDB(db);
    const session = { uid: user.uid, email: user.email, displayName: user.displayName, plan: user.plan };
    saveSession(session, true);
    this.currentUser = session;
    return session;
  },

  async login(email, password, remember = true) {
    const db = getDB();
    const key = email.toLowerCase().trim();
    const user = db[key];
    if (!user) throw new Error('No existe ninguna cuenta con ese email.');
    const hash = await hashPw(password);
    if (hash !== user.hash) throw new Error('Contraseña incorrecta. Inténtalo de nuevo.');
    const session = { uid: user.uid, email: user.email, displayName: user.displayName, plan: user.plan };
    saveSession(session, remember);
    this.currentUser = session;
    return session;
  },

  async logout() {
    clearSession();
    this.currentUser = null;
  },

  async updateProfile(profileData) {
    const db = getDB();
    const user = Object.values(db).find(u => u.uid === this.currentUser?.uid);
    if (!user) return;
    user.profile = { ...user.profile, ...profileData };
    db[user.email] = user;
    saveDB(db);
    // Update session display name if changed
    if (profileData.nombre) {
      const session = getSession();
      if (session) {
        session.displayName = profileData.nombre;
        saveSession(session, true);
        this.currentUser = session;
      }
    }
  },

  async getProfile() {
    const db = getDB();
    const user = Object.values(db).find(u => u.uid === this.currentUser?.uid);
    return user?.profile || null;
  },

  async upgradePlan(plan) {
    const db = getDB();
    const user = Object.values(db).find(u => u.uid === this.currentUser?.uid);
    if (!user) return;
    user.plan = plan;
    db[user.email] = user;
    saveDB(db);
    const session = getSession();
    if (session) { session.plan = plan; saveSession(session, true); this.currentUser = session; }
  },

  isPremium() {
    return this.currentUser?.plan === 'premium' || this.currentUser?.plan === 'pro';
  },

  isPro() {
    return this.currentUser?.plan === 'pro';
  }
};

window.ZodiAuth = ZodiAuth;
