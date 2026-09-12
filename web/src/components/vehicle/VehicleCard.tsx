import type { ReactNode } from "react";

export type VehicleStatus = "En Ruta" | "Cargando" | "En Mantenimiento";

export interface Vehicle {
  id: string;
  model?: string;
  type?: string;
  owner?: string;
  battery: number;
  range?: number;
  location?: string;
  updated?: string;
  status?: VehicleStatus;
  alerts?: string[];
  accent?: "green" | "orange" | "purple";
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: (vehicle: Vehicle) => void;
  action?: ReactNode;
}

function Icon({ name }: { name: "user" | "battery" | "bolt" | "pin" | "clock" | "alert" }) {
  const paths = {
    user: "M10.8 8.1a2.8 2.8 0 1 0-5.6 0 2.8 2.8 0 0 0 5.6 0ZM2.7 14a5.3 5.3 0 0 1 10.6 0H2.7Z",
    battery: "M2 4.4h10v7.2H2V4.4Zm10 2.3h2v2.8h-2V6.7Z",
    bolt: "m9 1-6 8h4l-1 6 6-8H8l1-6Z",
    pin: "M8 1.6a4.5 4.5 0 0 0-4.5 4.5c0 3.3 4.5 7.3 4.5 7.3s4.5-4 4.5-7.3A4.5 4.5 0 0 0 8 1.6Zm0 6.1a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z",
    clock: "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.7 3v3l2.1 1.2-.7 1.2L7.2 8.1V4.5h1.5Z",
    alert: "M8 1.3 15 14H1L8 1.3Zm0 4.1v4.2h1.4V5.4H8Zm0 5.4v1.4h1.4v-1.4H8Z",
  } as const;

  return (
    <svg aria-hidden="true" className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}

function Detail({ icon, label, value }: { icon: "user" | "bolt" | "pin" | "clock"; label: string; value?: string | number }) {
  if (value === undefined || value === "") return null;

  return (
    <div className="mt-2 text-[9.5px] leading-tight">
      <span className="flex items-center gap-1.5 font-semibold">
        <Icon name={icon} />
        {label}
      </span>
      <span className="ml-3.5 block text-[8.5px] text-[#5c5c5c]">{value}</span>
    </div>
  );
}

export default function VehicleCard({ vehicle, onClick, action }: VehicleCardProps) {
  const accent = vehicle.accent === "orange" ? "bg-[#ff8518]" : vehicle.accent === "purple" ? "bg-[#635bff]" : "bg-[#46c27b]";
  const battery = vehicle.battery < 30 ? "#ff424d" : vehicle.battery < 70 ? "#ffc000" : "#47c27c";
  const alerts = vehicle.alerts ?? [];

  return (
    <article
      className="relative min-h-[248px] overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-white py-3 pl-6 pr-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onClick?.(vehicle)}
    >
      <span className={`absolute bottom-3 left-2.5 top-3 w-0.5 rounded ${accent}`} />
      <div className="flex items-center justify-between text-[11px] leading-none">
        <strong>{vehicle.id}</strong>
        <div className="flex items-center gap-2">
          {action}
          {alerts.length > 0 && <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ff424d] text-[9px] font-extrabold text-white">{alerts.length}</span>}
        </div>
      </div>
      <div className="flex justify-between border-b border-[#bcbcbc] py-1 text-[10px]">
        <span>{vehicle.model ?? "Ford E-Transit"}</span>
        <span className="underline underline-offset-2">{vehicle.type ?? "Van"}</span>
      </div>
      <Detail icon="user" label="Usuario" value={vehicle.owner} />
      <div className="mt-2 text-[9.5px] leading-tight">
        <span className="flex items-center gap-1.5 font-semibold"><Icon name="battery" /> Batería</span>
        <div className="ml-3.5 mt-0.5 flex items-center gap-1.5">
          <div className="h-1 flex-1 overflow-hidden rounded bg-[#d9d9d9]"><span className="block h-full rounded" style={{ width: `${vehicle.battery}%`, background: battery }} /></div>
          <span className="w-5 text-[8px] text-[#777]">{vehicle.battery}%</span>
        </div>
      </div>
      <Detail icon="bolt" label="Autonomía Restante" value={vehicle.range ? `${vehicle.range} km` : undefined} />
      <Detail icon="pin" label="Ubicación" value={vehicle.location} />
      <Detail icon="clock" label="Actualizado hace" value={vehicle.updated} />
      <div className={`mt-1.5 text-[9.5px] leading-tight ${alerts.length ? "text-[#ff424d]" : ""}`}>
        <span className="flex items-center gap-1.5 font-semibold"><Icon name="alert" /> {alerts.length ? "Alertas" : "Sin Alertas"}</span>
        {alerts.map((alert) => <span className="ml-3.5 block text-[8px] text-[#686868]" key={alert}>{alert}</span>)}
      </div>
    </article>
  );
}
