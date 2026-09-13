export type VehicleStatus = 'en-ruta' | 'cargando' | 'mantenimiento';
export type VehicleType = 'automovil' | 'van' | 'camion' | 'motocicleta';
export type BatteryLevel = 'high' | 'medium' | 'low';

export interface Vehicle {
  id: string;
  label: string;
  driver: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  battery: number;
  autonomy: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  /* Tiempo relativo sin el "Hace" (p. ej. "5s", "2 min"); la tarjeta ya muestra "Actualizado hace" */
  lastUpdate: string;
  /* Historial de eventos de la unidad (p. ej. "[10:49 AM] Entrada a Zona Peligrosa") */
  alerts?: string[];
}

export function getBatteryLevel(battery: number): BatteryLevel {
  if (battery >= 70) return 'high';
  if (battery >= 30) return 'medium';
  return 'low';
}

export function getStatusLabel(status: VehicleStatus): string {
  const labels: Record<VehicleStatus, string> = {
    'en-ruta': 'En Ruta',
    'cargando': 'Cargando',
    'mantenimiento': 'En Mantenimiento',
  };
  return labels[status];
}

export function getTypeLabel(type: VehicleType): string {
  const labels: Record<VehicleType, string> = {
    'automovil': 'Automóvil',
    'van': 'Van',
    'camion': 'Camión',
    'motocicleta': 'Motocicleta',
  };
  return labels[type];
}

/* Colores base de estado */
export function getStatusColor(status: VehicleStatus): string {
  const colors: Record<VehicleStatus, string> = {
    'en-ruta': '#45BC75',
    'cargando': '#6155F5',
    'mantenimiento': '#F17F1B',
  };
  return colors[status];
}

/* Colores base de batería */
export function getBatteryColor(level: BatteryLevel): string {
  const colors: Record<BatteryLevel, string> = {
    high: '#45BC75',
    medium: '#F5C731',
    low: '#F53131',
  };
  return colors[level];
}

/* Colores por tipo de unidad */
export function getTypeColor(type: VehicleType): string {
  const colors: Record<VehicleType, string> = {
    automovil: '#6155F5',
    van: '#45BC75',
    camion: '#F17F1B',
    motocicleta: '#F5C731',
  };
  return colors[type];
}

/* Categoría de color activa para los marcadores */
export type ColorCategory = 'status' | 'battery' | 'type' | null;

/* Devuelve el color del marcador de un vehículo según la categoría activa */
export function getVehicleColor(vehicle: Vehicle, category: ColorCategory): string {
  if (!category) return '#AFAFAF';
  switch (category) {
    case 'status': return getStatusColor(vehicle.status);
    case 'battery': return getBatteryColor(getBatteryLevel(vehicle.battery));
    case 'type': return getTypeColor(vehicle.type);
  }
}

/* Alertas calculadas del estado actual primero, luego el historial de eventos de la unidad */
export function getVehicleAlerts(vehicle: Vehicle): string[] {
  const alerts: string[] = [];
  if (vehicle.status === 'mantenimiento') {
    alerts.push('Unidad en mantenimiento');
  }
  if (vehicle.battery <= 20) {
    alerts.push('Batería crítica');
  }
  for (const alert of vehicle.alerts ?? []) {
    if (!alerts.includes(alert)) alerts.push(alert);
  }
  return alerts;
}

export function getVehicleCardViewModel(vehicle: Vehicle) {
  const batteryLevel = getBatteryLevel(vehicle.battery);
  return {
    batteryColor: getBatteryColor(batteryLevel),
    statusColor: getStatusColor(vehicle.status),
    statusLabel: getStatusLabel(vehicle.status),
    typeLabel: getTypeLabel(vehicle.type),
    alerts: getVehicleAlerts(vehicle),
  };
}
