import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getStoredUser } from '../../lib/auth';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAuthed(!!getStoredUser());
      setLoading(false);
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

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <LoginForm />
      </main>
    );
  }

  return <>{children}</>;
}
