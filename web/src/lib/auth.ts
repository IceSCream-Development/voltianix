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

/* ------------------------------------------------------------------ */
/* Redirección: el formulario de login vive sólo en /login             */
/* ------------------------------------------------------------------ */

export const LOGIN_PATH = '/login';
export const DEFAULT_PATH = '/';

/* Ruta actual con su query, para poder volver a deep-links como ?vehicle=EV-003 */
export function getCurrentPath(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_PATH;
  }

  return `${window.location.pathname}${window.location.search}`;
}

/* Sólo se acepta una ruta interna. Sin este filtro, ?next=https://sitio-malicioso
   convertiría la pantalla de login en un open redirect. */
export function sanitizeNextPath(next: string | null | undefined): string | null {
  if (!next) return null;

  // Debe ser una ruta absoluta del propio sitio: "/unidades" sí; "https://…" no.
  if (!next.startsWith('/')) return null;

  // "//evil.com" y "/\evil.com" son URLs con host que el navegador sí resolvería fuera.
  if (next.startsWith('//') || next.startsWith('/\\')) return null;

  // Volver al login tras el login sería un bucle
  if (next === LOGIN_PATH || next.startsWith(`${LOGIN_PATH}?`) || next.startsWith(`${LOGIN_PATH}/`)) {
    return null;
  }

  return next;
}

export function buildLoginUrl(nextPath: string): string {
  const safeNext = sanitizeNextPath(nextPath);
  return safeNext ? `${LOGIN_PATH}?next=${encodeURIComponent(safeNext)}` : LOGIN_PATH;
}

/* Destino tras iniciar sesión: el ?next= de la URL actual, o el mapa */
export function getPostLoginPath(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_PATH;
  }

  const next = new URLSearchParams(window.location.search).get('next');
  return sanitizeNextPath(next) ?? DEFAULT_PATH;
}
