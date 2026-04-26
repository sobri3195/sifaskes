const AUTH_STORAGE_KEY = 'sifaskes.auth.session.v1';

export const demoUsers = [
  { username: 'admin.pusat', password: 'AdminPusat!2026', name: 'Admin Pusat', role: 'admin_pusat' },
  { username: 'admin.rs', password: 'AdminRS!2026', name: 'Admin RS', role: 'rs_admin' },
  { username: 'user.rs', password: 'UserRS!2026', name: 'User RS', role: 'user_rs' },
];

export function loadSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function loginWithCredentials(username, password) {
  const normalized = username.trim().toLowerCase();
  const user = demoUsers.find((item) => item.username === normalized && item.password === password);

  if (!user) {
    return { ok: false, message: 'Username atau password salah.' };
  }

  const session = {
    username: user.username,
    name: user.name,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return { ok: true, user: session };
}
