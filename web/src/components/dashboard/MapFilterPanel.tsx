import { useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleType, BatteryLevel, ColorCategory } from '../../types/vehicle';
import { getBatteryLevel } from '../../types/vehicle';

interface MapFilterPanelProps {
  vehicles: Vehicle[];
  activeCategory: ColorCategory;
  onCategoryChange: (category: ColorCategory) => void;
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

export default function MapFilterPanel({ vehicles, activeCategory, onCategoryChange }: MapFilterPanelProps) {
  const totalCount = vehicles.length;

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

  const isStatus = activeCategory === 'status';
  const isBattery = activeCategory === 'battery';
  const isType = activeCategory === 'type';

  return (
    <div className="w-72 overflow-hidden rounded-lg border border-[#E6E6E6] bg-white shadow-sm" style={{ border: '1px solid #E6E6E6' }}>
      <div className="flex items-center justify-between border-b border-[#E6E6E6] px-4 py-3" style={{ borderBottom: '1px solid #E6E6E6' }}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>Unidades Activas</h3>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#616161' }}>{totalCount}/{totalCount}</p>
        </div>
        <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: '#616161' }}>
          {activeCategory ? 'Activo' : 'Ver'}
        </span>
      </div>

      <CategorySection
        title="Estado Operativo"
        active={isStatus}
        onClick={() => onCategoryChange(isStatus ? null : 'status')}
      >
        {statusOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={statusCounts[option.key]}
            active={isStatus}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Nivel de Batería"
        active={isBattery}
        onClick={() => onCategoryChange(isBattery ? null : 'battery')}
      >
        {batteryOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={batteryCounts[option.key]}
            active={isBattery}
          />
        ))}
      </CategorySection>

      <CategorySection
        title="Tipo de Unidad"
        active={isType}
        onClick={() => onCategoryChange(isType ? null : 'type')}
        noBorder
      >
        {typeOptions.map((option) => (
          <FilterRow
            key={option.key}
            label={option.label}
            dotColor={option.color}
            count={typeCounts[option.key]}
            active={isType}
          />
        ))}
      </CategorySection>
    </div>
  );
}

function CategorySection({
  title,
  active,
  onClick,
  noBorder,
  children,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: noBorder ? 'none' : '1px solid #E6E6E6' }}>
      <div
        onClick={onClick}
        className="flex cursor-pointer items-center gap-2 px-4 py-2.5 transition-colors hover:bg-gray-50"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border" style={{ borderColor: active ? '#1E1E1E' : '#AFAFAF', backgroundColor: active ? '#1E1E1E' : 'transparent' }}>
          {active ? (
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </span>
        <span className="text-sm font-semibold" style={{ color: active ? '#1E1E1E' : '#616161' }}>
          {title}
        </span>
      </div>
      <div className="space-y-0.5 px-4 pb-2.5">
        {children}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  dotColor,
  count,
  active,
}: {
  label: string;
  dotColor?: string;
  count: number;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1 py-0.5">
      {dotColor && (
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: active ? dotColor : '#AFAFAF' }} />
      )}
      <span className="flex-1 text-sm" style={{ color: active ? '#1E1E1E' : '#AFAFAF' }}>
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums" style={{ color: active ? '#616161' : '#AFAFAF' }}>
        {count}
      </span>
    </div>
  );
}
