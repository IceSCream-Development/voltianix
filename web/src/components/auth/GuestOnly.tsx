import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getPostLoginPath, getStoredUser } from '../../lib/auth';

interface GuestOnlyProps {
  children: ReactNode;
}

/* Sólo para visitantes sin sesión: si ya hay una, se va al mismo destino al que
   llevaría enviar el formulario (el ?next= de la URL, o el mapa). */
export default function GuestOnly({ children }: GuestOnlyProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => {
      if (getStoredUser()) {
        window.location.replace(getPostLoginPath());
      } else {
        setLoading(false);
      }
    };

    sync();
    window.addEventListener('auth:updated', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('auth:updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6E6E6] border-t-[var(--color-button)] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
