import type { BatteryLevel, ColorCategory, VehicleStatus, VehicleType } from '../types/vehicle';
import {
  getBatteryColor,
  getStatusColor,
  getStatusLabel,
  getTypeColor,
  getTypeLabel,
} from '../types/vehicle';

export interface FilterOption<K extends string> {
  key: K;
  label: string;
  color: string;
}

/* Estado y tipo reutilizan los helpers del dominio para que no existan dos
   redacciones del mismo valor. La batería no tiene helper de etiqueta: se usan
   las de la documentación del Figma. */
const BATTERY_LABELS: Record<BatteryLevel, string> = {
  high: 'Más del 70%',
  medium: '30% - 70%',
  low: 'Menos del 30%',
};

export const statusOptions: FilterOption<VehicleStatus>[] = (
  ['en-ruta', 'cargando', 'mantenimiento'] as VehicleStatus[]
).map((key) => ({ key, label: getStatusLabel(key), color: getStatusColor(key) }));

export const batteryOptions: FilterOption<BatteryLevel>[] = (
  ['high', 'medium', 'low'] as BatteryLevel[]
).map((key) => ({ key, label: BATTERY_LABELS[key], color: getBatteryColor(key) }));

export const typeOptions: FilterOption<VehicleType>[] = (
  ['automovil', 'van', 'camion', 'motocicleta'] as VehicleType[]
).map((key) => ({ key, label: getTypeLabel(key), color: getTypeColor(key) }));

/* Los tres filtros en fila que describe el Figma */
export const FILTER_CATEGORIES: { key: Exclude<ColorCategory, null>; label: string }[] = [
  { key: 'status', label: 'Estado Operativo' },
  { key: 'battery', label: 'Nivel de Batería' },
  { key: 'type', label: 'Tipo de Unidad' },
];

/* Añade o quita un valor del arreglo de un filtro (arreglo vacío = todas visibles) */
export function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export interface CategorySelections {
  statuses: VehicleStatus[];
  batteryLevels: BatteryLevel[];
  types: VehicleType[];
}

const EMPTY_SELECTIONS: CategorySelections = { statuses: [], batteryLevels: [], types: [] };

/* Sólo una categoría filtra a la vez: el valor se alterna dentro de la suya —los
   valores de una misma categoría se siguen acumulando— y las otras dos se sueltan.
   La usan el panel del mapa y la página Unidades. */
export function toggleExclusive(
  current: CategorySelections,
  category: Exclude<ColorCategory, null>,
  value: VehicleStatus | BatteryLevel | VehicleType
): CategorySelections {
  if (category === 'status') {
    return { ...EMPTY_SELECTIONS, statuses: toggleValue(current.statuses, value as VehicleStatus) };
  }

  if (category === 'battery') {
    return { ...EMPTY_SELECTIONS, batteryLevels: toggleValue(current.batteryLevels, value as BatteryLevel) };
  }

  return { ...EMPTY_SELECTIONS, types: toggleValue(current.types, value as VehicleType) };
}
