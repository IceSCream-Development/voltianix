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

const focusRing = "focus-visible:ring-2 focus-visible:ring-[#2563EB]/40";
const selectClassName = `h-[30px] rounded border-0 bg-[#616161] px-2.5 text-[11px] font-bold text-white outline-none ${focusRing}`;

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

  const hasFilters = Boolean(query.trim() || status || battery || type);

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

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setBattery("");
    setType("");
  };

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
      <h1 className="text-xl font-semibold text-[#1E1E1E]">Monitoreo de todas las Unidades</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#4E4E4E]">
        Consulta el estado operativo, la batería, la ubicación y las alertas de cada unidad de la flota.
      </p>

      <div className="mb-5 mt-4 flex flex-wrap items-center gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar Unidad" aria-label="Buscar unidad" className={`h-[30px] w-full max-w-[340px] rounded border border-[#dfdfdf] bg-white px-3 text-[11px] outline-none focus:border-[#2f75ff] ${focusRing}`} />
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
        {filteredVehicles.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-10 text-center text-sm text-[#4E4E4E]">
            {hasFilters ? (
              <>
                <p>Ninguna unidad coincide con la búsqueda o los filtros. Quita algún filtro para ver más unidades.</p>
                <button type="button" onClick={clearFilters} className={`rounded-[5px] bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white outline-none transition-opacity hover:opacity-90 ${focusRing}`}>
                  Limpiar filtros
                </button>
              </>
            ) : (
              <p>Aún no hay unidades registradas en la flota.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
