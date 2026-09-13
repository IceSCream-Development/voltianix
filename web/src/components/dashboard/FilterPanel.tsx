import { useMemo } from 'react';
import type { BatteryLevel, Vehicle, VehicleStatus, VehicleType, ColorCategory } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';

interface FilterPanelProps {
  vehicles: Vehicle[];
  totalCount: number;
  activeCount: number;
  activeCategory: Exclude<ColorCategory, null>;
  selectedStatuses: VehicleStatus[];
  selectedBatteryLevels: BatteryLevel[];
  selectedTypes: VehicleType[];
  onStatusToggle: (status: VehicleStatus) => void;
  onBatteryToggle: (level: BatteryLevel) => void;
  onTypeToggle: (type: VehicleType) => void;
}

const statusOptions: { key: VehicleStatus; label: string; color: string }[] = [
  { key: 'en-ruta', label: 'En Ruta', color: '#45BC75' },
  { key: 'cargando', label: 'Cargando', color: '#6155F5' },
  { key: 'mantenimiento', label: 'En Mantenimiento', color: '#F17F1B' },
];

const batteryOptions: { key: BatteryLevel; label: string; color: string }[] = [
  { key: 'high', label: 'Más del 70%', color: '#45BC75' },
  { key: 'medium', label: '30% - 70%', color: '#FFCC00' },
  { key: 'low', label: 'Menos del 30%', color: '#F53131' },
];

const typeOptions: { key: VehicleType; label: string; color: string }[] = [
  { key: 'automovil', label: 'Automóvil', color: '#6155F5' },
  { key: 'van', label: 'Van', color: '#45BC75' },
  { key: 'camion', label: 'Camión', color: '#F17F1B' },
  { key: 'motocicleta', label: 'Motocicleta', color: '#FFCC00' },
];

export default function FilterPanel({
  vehicles,
  totalCount,
  activeCount,
  activeCategory,
  selectedStatuses,
  selectedBatteryLevels,
  selectedTypes,
  onStatusToggle,
  onBatteryToggle,
  onTypeToggle,
}: FilterPanelProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<VehicleStatus, number> = { 'en-ruta': 0, 'cargando': 0, 'mantenimiento': 0 };
    vehicles.forEach((vehicle) => counts[vehicle.status]++);
    return counts;
  }, [vehicles]);

  const batteryCounts = useMemo(() => {
    const counts: Record<BatteryLevel, number> = { high: 0, medium: 0, low: 0 };
    vehicles.forEach((vehicle) => counts[getBatteryLevel(vehicle.battery)]++);
    return counts;
  }, [vehicles]);

  const typeCounts = useMemo(() => {
    const counts: Record<VehicleType, number> = { automovil: 0, van: 0, camion: 0, motocicleta: 0 };
    vehicles.forEach((vehicle) => counts[vehicle.type]++);
    return counts;
  }, [vehicles]);

  const activeLabel =
    activeCategory === 'status'
      ? 'Estado Operativo'
      : activeCategory === 'battery'
        ? 'Nivel de Batería'
        : 'Tipo de Unidad';

  const options =
    activeCategory === 'status' ? statusOptions : activeCategory === 'battery' ? batteryOptions : typeOptions;

  const toggleOption = (key: string) => {
    if (activeCategory === 'status') {
      onStatusToggle(key as VehicleStatus);
    } else if (activeCategory === 'battery') {
      onBatteryToggle(key as BatteryLevel);
    } else {
      onTypeToggle(key as VehicleType);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-[#E6E6E6] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E6E6E6] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1E1E1E]">Unidades Activas</h3>
          <p className="text-sm font-semibold tabular-nums text-[#616161]">
            {activeCount}/{totalCount}
          </p>
        </div>
        <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#616161]">
          {activeLabel}
        </span>
      </div>

      <div className="grid gap-2 px-4 py-4 sm:grid-cols-2 xl:grid-cols-1">
        {options.map((option) => {
          const count =
            activeCategory === 'status'
              ? statusCounts[option.key as VehicleStatus]
              : activeCategory === 'battery'
                ? batteryCounts[option.key as BatteryLevel]
                : typeCounts[option.key as VehicleType];

          const isSelected = activeCategory === 'status'
            ? selectedStatuses.includes(option.key as VehicleStatus)
            : activeCategory === 'battery'
              ? selectedBatteryLevels.includes(option.key as BatteryLevel)
              : selectedTypes.includes(option.key as VehicleType);

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleOption(option.key)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#D7DBE3] bg-[#F8FAFC] shadow-sm'
                  : 'border-transparent bg-white hover:border-[#E6E6E6] hover:bg-[#F8FAFC]'
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: isSelected ? option.color : '#AFAFAF' }}
              />
              <span className={`flex-1 text-sm font-medium ${isSelected ? 'text-[#1E1E1E]' : 'text-[#AFAFAF]'}`}>
                {option.label}
              </span>
              <span className={`text-sm font-semibold tabular-nums ${isSelected ? 'text-[#616161]' : 'text-[#AFAFAF]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
