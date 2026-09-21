import type { BatteryLevel, Vehicle, VehicleStatus, VehicleType } from '../types/vehicle';
import { getBatteryLevel, getVehicleAlerts } from '../types/vehicle';

/* Unidad con sus alertas ya calculadas (derivadas + historial) */
export interface AlertedVehicle {
  vehicle: Vehicle;
  alerts: string[];
}

export interface FleetMetrics {
  total: number;
  statusCounts: Record<VehicleStatus, number>;
  batteryCounts: Record<BatteryLevel, number>;
  typeCounts: Record<VehicleType, number>;
  /* Porcentaje promedio de batería de la flota */
  averageBattery: number;
  /* Kilómetros de autonomía disponibles, sumados y promediados */
  totalAutonomy: number;
  averageAutonomy: number;
  /* Unidades con alertas, las más críticas primero */
  alerted: AlertedVehicle[];
  alertCount: number;
}

/* Conteos y promedios de la flota. Única fuente de estos números:
   la usan el panel de filtros del mapa y el dashboard de indicadores. */
export function getFleetMetrics(vehicles: Vehicle[]): FleetMetrics {
  const statusCounts: Record<VehicleStatus, number> = { 'en-ruta': 0, 'cargando': 0, 'mantenimiento': 0 };
  const batteryCounts: Record<BatteryLevel, number> = { high: 0, medium: 0, low: 0 };
  const typeCounts: Record<VehicleType, number> = { automovil: 0, van: 0, camion: 0, motocicleta: 0 };

  let batterySum = 0;
  let autonomySum = 0;
  const alerted: AlertedVehicle[] = [];

  for (const vehicle of vehicles) {
    statusCounts[vehicle.status]++;
    batteryCounts[getBatteryLevel(vehicle.battery)]++;
    typeCounts[vehicle.type]++;

    batterySum += vehicle.battery;
    autonomySum += vehicle.autonomy;

    const alerts = getVehicleAlerts(vehicle);
    if (alerts.length > 0) alerted.push({ vehicle, alerts });
  }

  // Más alertas primero; a igualdad de alertas, la batería más baja primero
  alerted.sort((a, b) => b.alerts.length - a.alerts.length || a.vehicle.battery - b.vehicle.battery);

  const total = vehicles.length;

  return {
    total,
    statusCounts,
    batteryCounts,
    typeCounts,
    averageBattery: total ? Math.round(batterySum / total) : 0,
    totalAutonomy: autonomySum,
    averageAutonomy: total ? Math.round(autonomySum / total) : 0,
    alerted,
    alertCount: alerted.reduce((sum, item) => sum + item.alerts.length, 0),
  };
}
