import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { buildLoginUrl, getCurrentPath, getStoredUser } from '../../lib/auth';

interface AuthGuardProps {
  children: ReactNode;
}

/* Protege una página: si no hay sesión, envía a /login conservando la ruta
   pedida en ?next=. El formulario no se renderiza aquí — vive sólo en /login. */
export default function AuthGuard({ children }: AuthGuardProps) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (getStoredUser()) {
        setAuthed(true);
        return;
      }

      setAuthed(false);
      // replace y no assign: la página protegida no queda en el historial, así el
      // botón Atrás tras iniciar sesión no rebota de vuelta al login.
      window.location.replace(buildLoginUrl(getCurrentPath()));
    };

    sync();
    window.addEventListener('auth:updated', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('auth:updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Mientras se comprueba la sesión o se está redirigiendo
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6E6E6] border-t-[var(--color-button)] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
