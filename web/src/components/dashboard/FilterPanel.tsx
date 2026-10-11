import { useMemo } from 'react';
import type { BatteryLevel, ColorCategory, Vehicle, VehicleStatus, VehicleType } from '../../types/vehicle';
import { getFleetMetrics } from '../../lib/fleetMetrics';
import { FILTER_CATEGORIES, batteryOptions, statusOptions, typeOptions } from '../../lib/filterOptions';

type Category = Exclude<ColorCategory, null>;

interface FilterPanelProps {
  vehicles: Vehicle[];
  /* Unidades que quedan tras aplicar búsqueda y filtros */
  visibleCount: number;
  /* Categoría cuyas opciones se muestran en el popover */
  activeCategory: Category;
  id?: string;
  selectedStatuses: VehicleStatus[];
  selectedBatteryLevels: BatteryLevel[];
  selectedTypes: VehicleType[];
  onStatusToggle: (status: VehicleStatus) => void;
  onBatteryToggle: (level: BatteryLevel) => void;
  onTypeToggle: (type: VehicleType) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

/* Las opciones aparecen en un popover para que cambiar de categoría no mueva
   el contenido de la página. */
export default function FilterPanel({
  vehicles,
  visibleCount,
  activeCategory,
  id,
  selectedStatuses,
  selectedBatteryLevels,
  selectedTypes,
  onStatusToggle,
  onBatteryToggle,
  onTypeToggle,
  onClearFilters,
  hasFilters,
}: FilterPanelProps) {
  const metrics = useMemo(() => getFleetMetrics(vehicles), [vehicles]);
  const activeLabel = FILTER_CATEGORIES.find((category) => category.key === activeCategory)?.label ?? '';

  const renderRows = () => {
    if (activeCategory === 'status') {
      return statusOptions.map((option) => (
        <CheckRow
          key={option.key}
          label={option.label}
          count={metrics.statusCounts[option.key]}
          selected={selectedStatuses.includes(option.key)}
          onClick={() => onStatusToggle(option.key)}
        />
      ));
    }

    if (activeCategory === 'battery') {
      return batteryOptions.map((option) => (
        <CheckRow
          key={option.key}
          label={option.label}
          count={metrics.batteryCounts[option.key]}
          selected={selectedBatteryLevels.includes(option.key)}
          onClick={() => onBatteryToggle(option.key)}
        />
      ));
    }

    return typeOptions.map((option) => (
      <CheckRow
        key={option.key}
        label={option.label}
        count={metrics.typeCounts[option.key]}
        selected={selectedTypes.includes(option.key)}
        onClick={() => onTypeToggle(option.key)}
      />
    ));
  };

  return (
    <div
      id={id}
      className="absolute left-0 top-full mt-1.5 w-full max-w-[340px] overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-white shadow-[0_8px_24px_rgba(30,30,30,0.12)]"
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pb-1 pt-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#616161]">Visibles</span>
          <span className="rounded-[5px] bg-[#EEF3FF] px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-[#374D7E]">
            {visibleCount}/{metrics.total}
          </span>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="shrink-0 rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold text-[#616161] outline-none transition-colors hover:bg-[#F2F4F7] hover:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
          >
            Limpiar
          </button>
        ) : (
          <span className="shrink-0 rounded-[5px] bg-[#F2F4F7] px-1.5 py-0.5 text-[10px] font-semibold text-[#616161]">
            {activeLabel}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 p-2">{renderRows()}</div>
    </div>
  );
}

/* Fila con casilla: seleccionada #DFE8FC con texto y palomita #374D7E,
   sin seleccionar #4E4E4E (documentación del Figma, sección Unidades). */
function CheckRow({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[11px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
        selected ? 'bg-[#DFE8FC] text-[#374D7E]' : 'text-[#4E4E4E] hover:bg-[#F7F7F7]'
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border bg-white ${
          selected ? 'border-[#374D7E]' : 'border-[#AFAFAF]'
        }`}
      >
        {selected ? (
          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      <span className="font-semibold tabular-nums">{count}</span>
    </button>
  );
}
