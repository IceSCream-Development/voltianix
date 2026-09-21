interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  /* Punto de color junto al valor: la identidad nunca depende sólo del color */
  accentColor?: string;
}

export default function StatTile({ label, value, hint, accentColor }: StatTileProps) {
  return (
    <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-4 py-3.5 shadow-sm">
      <p className="text-[11px] font-medium text-[#616161]">{label}</p>
      {/* Cifras proporcionales: tabular-nums afloja los números a este tamaño */}
      <p className="mt-2 flex items-center gap-2 text-[1.75rem] font-semibold leading-none text-[#1E1E1E]">
        {accentColor && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />}
        {value}
      </p>
      {hint && <p className="mt-2 text-[11px] leading-tight text-[#4E4E4E]">{hint}</p>}
    </div>
  );
}
