import { useState } from 'react';
import { TEMP_USER, TEMP_USER_CREDENTIALS, clearStoredUser, storeUser } from '../lib/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    await new Promise((resolve) => window.setTimeout(resolve, 350));

    if (email.trim().toLowerCase() === TEMP_USER_CREDENTIALS.email && password === TEMP_USER_CREDENTIALS.password) {
      storeUser(TEMP_USER);
      window.dispatchEvent(new Event('auth:updated'));
      setLoading(false);
      return true;
    }

    setError('Credenciales inválidas. Usa el usuario temporal mostrado en la pantalla.');
    setLoading(false);
    return false;
  };

  const logout = () => {
    clearStoredUser();
    window.dispatchEvent(new Event('auth:updated'));
  };

  return { login, logout, loading, error };
}
