import { useEffect, useMemo, useState } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import type { BatteryLevel, Vehicle, VehicleStatus, VehicleType } from "../../types/vehicle";
import { getBatteryLevel, getStatusLabel, getTypeLabel } from "../../types/vehicle";
import VehicleCard from "./VehicleCard";

const statusOptions: VehicleStatus[] = ["en-ruta", "cargando", "mantenimiento"];
const typeOptions: VehicleType[] = ["automovil", "van", "camion", "motocicleta"];
const batteryOptions: { key: BatteryLevel; label: string }[] = [
  { key: "high", label: "Alto (70%+)" },
  { key: "medium", label: "Media (30% - 69%)" },
  { key: "low", label: "Bajo (0% - 29%)" },
];

const selectClassName = "h-[30px] rounded border-0 bg-[#666] px-2.5 text-[10px] font-bold text-white outline-none";

interface VehicleDirectoryProps {
  onVehicleClick?: (vehicle: Vehicle) => void;
}

export default function VehicleDirectory({ onVehicleClick }: VehicleDirectoryProps) {
  const vehicles = useVehicles();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "">("");
  const [battery, setBattery] = useState<BatteryLevel | "">("");
  const [type, setType] = useState<VehicleType | "">("");
  const [highlightedVehicleId, setHighlightedVehicleId] = useState<string | null>(null);

  const filteredVehicles = useMemo(() => {
    const search = query.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      if (status && vehicle.status !== status) return false;
      if (battery && getBatteryLevel(vehicle.battery) !== battery) return false;
      if (type && vehicle.type !== type) return false;

      const haystack = `${vehicle.label} ${vehicle.driver} ${vehicle.model} ${vehicle.location.address}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [query, status, battery, type, vehicles]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHighlightedVehicleId(params.get("vehicle"));
  }, []);

  useEffect(() => {
    if (!highlightedVehicleId) return;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(`vehicle-card-${highlightedVehicleId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus({ preventScroll: true });
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [highlightedVehicleId, filteredVehicles]);

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar Unidad" aria-label="Buscar unidad" className="h-[30px] w-full max-w-[340px] rounded border border-[#dfdfdf] bg-white px-3 text-[10px] outline-none focus:border-[#2f75ff]" />
        <select value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "")} aria-label="Estado operativo" className={selectClassName}>
          <option value="">Estado Operativo</option>
          {statusOptions.map((option) => <option key={option} value={option}>{getStatusLabel(option)}</option>)}
        </select>
        <select value={battery} onChange={(event) => setBattery(event.target.value as BatteryLevel | "")} aria-label="Nivel de batería" className={selectClassName}>
          <option value="">Nivel de Batería</option>
          {batteryOptions.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value as VehicleType | "")} aria-label="Tipo de unidad" className={selectClassName}>
          <option value="">Tipo de Unidad</option>
          {typeOptions.map((option) => <option key={option} value={option}>{getTypeLabel(option)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            cardId={`vehicle-card-${vehicle.id}`}
            vehicle={vehicle}
            isHighlighted={highlightedVehicleId === vehicle.id}
            onClick={onVehicleClick}
          />
        ))}
        {filteredVehicles.length === 0 && <p className="col-span-full py-10 text-center text-sm text-[#555]">No encontramos unidades.</p>}
      </div>
    </section>
  );
}
