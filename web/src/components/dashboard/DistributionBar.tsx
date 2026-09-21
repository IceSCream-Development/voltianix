export interface DistributionSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface DistributionBarProps {
  title: string;
  total: number;
  segments: DistributionSegment[];
}

/* Barra apilada horizontal (parte-todo) + leyenda con todos los valores.
   La leyenda no es decorativa: varios colores de marca quedan por debajo de
   3:1 contra el blanco, así que el nombre y la cifra son los que garantizan
   que la barra se pueda leer sin depender del color. */
export default function DistributionBar({ title, total, segments }: DistributionBarProps) {
  const visible = segments.filter((segment) => segment.value > 0);

  return (
    <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-4 py-3.5 shadow-sm">
      <h3 className="text-[13px] font-semibold text-[#1E1E1E]">{title}</h3>

      {visible.length > 0 ? (
        /* Los segmentos se separan con 2px de superficie, nunca con un borde */
        <div className="mt-3 flex h-2.5 w-full gap-[2px]">
          {visible.map((segment, index) => (
            <div
              key={segment.key}
              title={`${segment.label}: ${segment.value} de ${total}`}
              style={{
                flexGrow: segment.value,
                flexBasis: 0,
                backgroundColor: segment.color,
                borderTopLeftRadius: index === 0 ? 4 : 0,
                borderBottomLeftRadius: index === 0 ? 4 : 0,
                borderTopRightRadius: index === visible.length - 1 ? 4 : 0,
                borderBottomRightRadius: index === visible.length - 1 ? 4 : 0,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 h-2.5 w-full rounded bg-[#EFEFEF]" />
      )}

      <ul className="mt-3 space-y-1.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2 text-[11px]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="flex-1 text-[#1E1E1E]">{segment.label}</span>
            <span className="tabular-nums font-medium text-[#4E4E4E]">{segment.value}</span>
            <span className="w-10 text-right tabular-nums text-[#AFAFAF]">
              {total ? Math.round((segment.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
