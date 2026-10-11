import { useEffect, useState } from 'react';
import { LOGIN_PATH, clearStoredUser, getStoredUser, type AuthUser } from '../../lib/auth';

interface HeaderProps {
  currentPage?: 'mapa' | 'unidades' | 'dashboard' | 'login';
}

const NAV_ITEMS = [
  { key: 'mapa', href: '/', label: 'Mapa de Flota' },
  { key: 'unidades', href: '/unidades', label: 'Unidades' },
  { key: 'dashboard', href: '/dashboard', label: 'Indicadores' },
] as const;

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
    window.location.assign(LOGIN_PATH);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full h-14 z-50 px-6 flex items-center justify-between bg-white"
      style={{ borderBottom: '1px solid #E6E6E6' }}
    >
      <div className="flex items-center">
        <img
          src="/assets/Logo1.png"
          alt="Voltianix"
          className="h-10 w-auto object-contain drop-shadow-sm"
        />
      </div>

      {/* Menú y usuario viajan juntos a la derecha, en los dos estados de sesión */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.key;

            // Sin h-full: la caja se ajusta al texto para que el subrayado quede
            // debajo de la etiqueta y no en el borde inferior de la barra.
            // pt-2 compensa pb-1.5 + el borde de 2px, así la etiqueta sigue centrada.
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center px-1 pt-2 pb-1.5 border-b-2 text-sm transition-colors ${
                  isActive
                    ? 'font-semibold text-[#16A34A] border-[#16A34A]'
                    : 'font-medium text-[#1E1E1E] border-transparent hover:text-[#616161]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <span className="h-6 w-px bg-[#E6E6E6]" aria-hidden="true" />

        <div className="flex items-center">
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
                className="cursor-pointer rounded-[5px] border border-[#E6E6E6] px-2.5 py-1 text-[11px] font-medium text-[#616161] transition hover:border-[#16A34A] hover:text-[#16A34A]"
              >
                Salir
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
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
      </div>
    </header>
  );
}
