import { useMemo } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import { getFleetMetrics } from "../../lib/fleetMetrics";
import type { BatteryLevel, VehicleStatus, VehicleType } from "../../types/vehicle";
import {
  getBatteryColor,
  getBatteryLevel,
  getStatusColor,
  getStatusLabel,
  getTypeColor,
  getTypeLabel,
} from "../../types/vehicle";
import StatTile from "./StatTile";
import DistributionBar from "./DistributionBar";

const statusOrder: VehicleStatus[] = ["en-ruta", "cargando", "mantenimiento"];
const typeOrder: VehicleType[] = ["automovil", "van", "camion", "motocicleta"];
const batteryOrder: { key: BatteryLevel; label: string }[] = [
  { key: "high", label: "Alto (70%+)" },
  { key: "medium", label: "Media (30% - 69%)" },
  { key: "low", label: "Bajo (0% - 29%)" },
];

export default function FleetDashboard() {
  const vehicles = useVehicles();
  const metrics = useMemo(() => getFleetMetrics(vehicles), [vehicles]);

  const statusSegments = statusOrder.map((status) => ({
    key: status,
    label: getStatusLabel(status),
    value: metrics.statusCounts[status],
    color: getStatusColor(status),
  }));

  const batterySegments = batteryOrder.map((option) => ({
    key: option.key,
    label: option.label,
    value: metrics.batteryCounts[option.key],
    color: getBatteryColor(option.key),
  }));

  const typeSegments = typeOrder.map((type) => ({
    key: type,
    label: getTypeLabel(type),
    value: metrics.typeCounts[type],
    color: getTypeColor(type),
  }));

  return (
    <section className="w-full">
      <h1 className="text-xl font-semibold text-[#1E1E1E]">Indicadores de la Flota</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#4E4E4E]">
        Resumen operativo en tiempo real: disponibilidad, energía y alertas del total de unidades.
      </p>

      {metrics.total === 0 ? (
        <p className="mt-10 text-center text-sm text-[#4E4E4E]">
          Aún no hay unidades registradas en la flota.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Unidades en la flota"
              value={String(metrics.total)}
              hint={`${metrics.statusCounts["en-ruta"]} en ruta en este momento`}
            />
            <StatTile
              label="Batería promedio"
              value={`${metrics.averageBattery}%`}
              accentColor={getBatteryColor(getBatteryLevel(metrics.averageBattery))}
              hint={`${metrics.batteryCounts.low} por debajo del 30%`}
            />
            <StatTile
              label="Autonomía disponible"
              value={`${metrics.totalAutonomy.toLocaleString("es-MX")} km`}
              hint={`${metrics.averageAutonomy} km en promedio por unidad`}
            />
            <StatTile
              label="Unidades con alertas"
              value={String(metrics.alerted.length)}
              accentColor={metrics.alerted.length > 0 ? "#F53131" : "#45BC75"}
              hint={`${metrics.alertCount} alertas activas en total`}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <DistributionBar title="Estado Operativo" total={metrics.total} segments={statusSegments} />
            <DistributionBar title="Nivel de Batería" total={metrics.total} segments={batterySegments} />
            <DistributionBar title="Tipo de Unidad" total={metrics.total} segments={typeSegments} />
          </div>

          <div className="mt-3 rounded-[10px] border border-[#e0e0e0] bg-white px-4 py-3.5 shadow-sm">
            <h3 className="text-[13px] font-semibold text-[#1E1E1E]">Alertas activas</h3>

            {metrics.alerted.length === 0 ? (
              <p className="mt-3 text-[11px] text-[#4E4E4E]">Ninguna unidad reporta alertas.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {metrics.alerted.map(({ vehicle, alerts }) => (
                  <li key={vehicle.id}>
                    <a
                      href={`/unidades?vehicle=${vehicle.id}`}
                      className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-[#E6E6E6] hover:bg-[#F8FAFC]"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: getStatusColor(vehicle.status) }}
                      />
                      <strong className="text-[11px] text-[#1E1E1E]">{vehicle.label}</strong>
                      <span className="flex-1 text-[11px] text-[#4E4E4E]">
                        {getStatusLabel(vehicle.status)} · {vehicle.battery}% de batería
                      </span>
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#F53131] text-[10px] font-extrabold text-white">
                        {alerts.length}
                      </span>
                    </a>
                    <ul className="ml-6 space-y-0.5 pb-1">
                      {alerts.map((alert) => (
                        <li key={alert} className="text-[10px] leading-tight text-[#4E4E4E]">
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
