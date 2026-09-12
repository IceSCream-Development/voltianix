import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { TEMP_USER_CREDENTIALS } from '../../lib/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      window.location.assign('/');
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-[32px] border border-[#E6E6E6] bg-white p-10 shadow-[0_32px_80px_-36px_rgba(0,0,0,0.25)]">
      <div className="mb-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="mt-6 text-[2.25rem] font-semibold text-[#1E1E1E]">Bienvenido a Voltianix</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#616161]">
          Ingresa con tu correo y contraseña para supervisar la operación de tu flota eléctrica.
        </p>
      </div>

      {error ? (
        <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1E1E1E]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="demo@voltianix.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#E6E6E6] bg-[#F9F9F9] px-4 text-sm text-[#1E1E1E] outline-none transition-colors focus:border-[#16A34A] focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#1E1E1E]">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-[#E6E6E6] bg-[#F9F9F9] px-4 pr-12 text-sm text-[#1E1E1E] outline-none transition-colors focus:border-[#16A34A] focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616161] transition hover:text-[#1E1E1E]"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#16A34A] text-sm font-semibold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-6 rounded-[26px] border border-dashed border-[#E6E6E6] bg-[#F9F9F9] p-5 text-sm text-[#616161]">
        <p className="font-semibold text-[#1E1E1E]">Acceso temporal de prueba</p>
        <p className="mt-2">Correo: <span className="font-medium text-[#1E1E1E]">{TEMP_USER_CREDENTIALS.email}</span></p>
        <p>Contraseña: <span className="font-medium text-[#1E1E1E]">{TEMP_USER_CREDENTIALS.password}</span></p>
      </div>
    </div>
  );
}
