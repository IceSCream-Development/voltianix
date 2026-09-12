export type AuthUser = {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
};

export const TEMP_USER_CREDENTIALS = {
  email: 'demo@voltianix.com',
  password: 'voltianix123',
};

export const TEMP_USER: AuthUser = {
  id: 'demo-user',
  name: 'Marta Díaz',
  role: 'Operador',
  email: TEMP_USER_CREDENTIALS.email,
  initials: 'MD',
};

const STORAGE_KEY = 'voltianix.auth.user';

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  storeUser(null);
}
