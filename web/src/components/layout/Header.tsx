import { useEffect, useState } from 'react';
import { clearStoredUser, getStoredUser, type AuthUser } from '../../lib/auth';

interface HeaderProps {
  currentPage?: 'mapa' | 'unidades' | 'login';
}

export default function Header({ currentPage = 'mapa' }: HeaderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    syncUser();

    window.addEventListener('auth:updated', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('auth:updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    window.dispatchEvent(new Event('auth:updated'));
    window.location.assign('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full h-14 z-50 px-6 flex items-center justify-between bg-white"
      style={{ borderBottom: '1px solid #E6E6E6' }}
    >
      <div className="flex items-center w-52 min-w-[160px]">
        <img
          src="/assets/Logo1.png"
          alt="Voltianix"
          className="h-10 w-auto object-contain drop-shadow-sm"
        />
      </div>

      <nav className="flex items-center gap-6 h-full">
        <a
          href="/"
          className={`h-full flex items-center px-1 border-b-2 text-sm transition-colors ${
            currentPage === 'mapa'
              ? 'font-semibold text-[#16A34A] border-[#16A34A]'
              : 'font-medium text-[#1E1E1E] border-transparent hover:text-[#616161]'
          }`}
        >
          Mapa de Flota
        </a>
        <a
          href="/unidades"
          className={`h-full flex items-center px-1 border-b-2 text-sm transition-colors ${
            currentPage === 'unidades'
              ? 'font-semibold text-[#16A34A] border-[#16A34A]'
              : 'font-medium text-[#1E1E1E] border-transparent hover:text-[#616161]'
          }`}
        >
          Unidades
        </a>
      </nav>

      <div className="flex items-center justify-end w-52 min-w-[160px]">
        {user ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-[11px] font-semibold uppercase text-white">
              {user.initials}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-medium leading-tight text-[#1E1E1E]">{user.name}</span>
              <span className="text-[11px] leading-tight text-[#616161]">{user.role}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-[5px] border border-[#E6E6E6] px-2.5 py-1 text-[11px] font-medium text-[#616161] transition hover:border-[#16A34A] hover:text-[#16A34A]"
            >
              Salir
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-[5px] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
            </svg>
            Iniciar sesión
          </a>
        )}
      </div>
    </header>
  );
}
