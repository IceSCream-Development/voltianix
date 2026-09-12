interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onMenuToggle?: () => void;
  className?: string;
}

export default function SearchBar({ value, onChange, onMenuToggle, className = '' }: SearchBarProps) {
  return (
    <div className={`flex w-full max-w-[360px] items-center rounded-full border border-[#E6E6E6] bg-[#F8FAFC] px-2 py-2 shadow-sm transition-all focus-within:border-[#16A34A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#16A34A]/10 ${className}`.trim()}>
      <button
        onClick={onMenuToggle}
        className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white"
        style={{ color: '#616161' }}
        aria-label="Menú de filtros"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Buscar Unidad"
        className="flex-1 border-none bg-transparent px-2 py-2 text-sm text-[#1E1E1E] outline-none placeholder:text-[#9CA3AF]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar unidad de la flota"
      />

      <div className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#616161] shadow-sm">
        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
