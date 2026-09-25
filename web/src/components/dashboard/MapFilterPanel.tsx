import { useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel, ColorCategory } from '../../types/vehicle';
import { getFleetMetrics } from '../../lib/fleetMetrics';
import { batteryOptions, statusOptions, typeOptions } from '../../lib/filterOptions';

type Category = Exclude<ColorCategory, null>;

interface MapFilterPanelProps {
  vehicles: Vehicle[];
  /* Unidades que quedan tras aplicar búsqueda y filtros */
  visibleCount: number;
  activeCategory: ColorCategory;
  onCategoryChange: (category: ColorCategory) => void;
  selectedStatuses: VehicleStatus[];
  selectedBatteryLevels: BatteryLevel[];
  selectedTypes: VehicleType[];
  onStatusToggle: (status: VehicleStatus) => void;
  onBatteryToggle: (level: BatteryLevel) => void;
  onTypeToggle: (type: VehicleType) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function MapFilterPanel({
  vehicles,
  visibleCount,
  activeCategory,
  onCategoryChange,
  selectedStatuses,
  selectedBatteryLevels,
  selectedTypes,
  onStatusToggle,
  onBatteryToggle,
  onTypeToggle,
  onClearFilters,
  hasFilters,
}: MapFilterPanelProps) {
  const metrics = useMemo(() => getFleetMetrics(vehicles), [vehicles]);

  /* Al elegir una opción se filtra y, además, se colorean los marcadores por esa
     categoría: así el mapa siempre explica visualmente lo que estás filtrando. */
  const handleSelect = (category: Category, key: string) => {
    if (category === 'status') onStatusToggle(key as VehicleStatus);
    else if (category === 'battery') onBatteryToggle(key as BatteryLevel);
    else onTypeToggle(key as VehicleType);

    onCategoryChange(category);
  };

  return (
    <div className="w-72 overflow-hidden rounded-lg bg-white shadow-sm" style={{ border: '1px solid #E6E6E6' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>Unidades Visibles</h3>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#616161' }}>
            {visibleCount}/{metrics.total}
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-full border border-[#E6E6E6] px-3 py-1 text-xs font-semibold text-[#616161] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Limpiar
          </button>
        ) : (
          <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: '#616161' }}>
            Ver
          </span>
        )}
      </div>

      <CategorySection
        title="Estado Operativo"
        colored={activeCategory === 'status'}
        onToggleColor={() => onCategoryChange(activeCategory === 'status' ? null : 'status')}
      >
        {statusOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={metrics.statusCounts[option.key]}
            selected={selectedStatuses.includes(option.key)}
            colored={activeCategory === 'status'}
            onClick={() => handleSelect('status', option.key)}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Nivel de Batería"
        colored={activeCategory === 'battery'}
        onToggleColor={() => onCategoryChange(activeCategory === 'battery' ? null : 'battery')}
      >
        {batteryOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={metrics.batteryCounts[option.key]}
            selected={selectedBatteryLevels.includes(option.key)}
            colored={activeCategory === 'battery'}
            onClick={() => handleSelect('battery', option.key)}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Tipo de Unidad"
        colored={activeCategory === 'type'}
        onToggleColor={() => onCategoryChange(activeCategory === 'type' ? null : 'type')}
        noBorder
      >
        {typeOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={metrics.typeCounts[option.key]}
            selected={selectedTypes.includes(option.key)}
            colored={activeCategory === 'type'}
            onClick={() => handleSelect('type', option.key)}
          />
        ))}
      </CategorySection>
    </div>
  );
}

/* La casilla de la cabecera controla únicamente el coloreado de los marcadores */
function CategorySection({
  title,
  colored,
  onToggleColor,
  noBorder,
  children,
}: {
  title: string;
  colored: boolean;
  onToggleColor: () => void;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: noBorder ? 'none' : '1px solid #E6E6E6' }}>
      <button
        type="button"
        onClick={onToggleColor}
        title={colored ? 'Dejar de colorear por esta categoría' : 'Colorear marcadores por esta categoría'}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
      >
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border"
          style={{ borderColor: colored ? '#1E1E1E' : '#AFAFAF', backgroundColor: colored ? '#1E1E1E' : 'transparent' }}
        >
          {colored ? (
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </span>
        <span className="text-sm font-semibold" style={{ color: colored ? '#1E1E1E' : '#616161' }}>
          {title}
        </span>
      </button>
      <div className="space-y-1 px-3 pb-2.5">{children}</div>
    </div>
  );
}

function FilterRow({
  label,
  dotColor,
  count,
  selected,
  colored,
  onClick,
}: {
  label: string;
  dotColor: string;
  count: number;
  selected: boolean;
  colored: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition-all duration-200 ${
        selected
          ? "border-[#D7DBE3] bg-[#F8FAFC] shadow-sm"
          : "border-transparent bg-white hover:border-[#E6E6E6] hover:bg-[#F8FAFC]"
      }`}
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: selected || colored ? dotColor : '#AFAFAF' }}
      />
      <span className={`flex-1 text-sm ${selected ? "font-medium text-[#1E1E1E]" : "text-[#AFAFAF]"}`}>
        {label}
      </span>
      <span className={`text-sm tabular-nums ${selected ? "font-semibold text-[#616161]" : "text-[#AFAFAF]"}`}>
        {count}
      </span>
    </button>
  );
}
