import { useMemo, useState } from "react";
import VehicleCard, { type Vehicle, type VehicleStatus } from "./VehicleCard";

const defaultVehicles: Vehicle[] = [
  { id: "EV-001", owner: "Miguel Torres", battery: 85, range: 248, location: "Av. Convención de 1914 Pte. | Zona Centro", updated: "5s", status: "En Ruta", accent: "green" },
  { id: "EV-002", owner: "Carlos Ramírez", battery: 50, range: 143, location: "C. Chichén Itzá 199 | Zona Sur", updated: "4s", status: "En Ruta", alerts: ["[10:49 AM] Entrada a Zona Peligrosa", "[10:25 AM] Carga Completada"], accent: "green" },
  { id: "EV-003", owner: "Samantha Rivera", battery: 93, range: 285, location: "Talpa 140-104 | Zona Sur", updated: "3s", status: "En Ruta", accent: "green" },
  { id: "EV-004", owner: "Mariana Oliva", battery: 29, range: 35, location: "Las Cumbres | Zona Norte", updated: "3s", status: "Cargando", accent: "orange" },
  { id: "EV-005", owner: "Miguel Torres", battery: 78, range: 216, location: "San Marcos | Zona Centro", updated: "7s", status: "En Mantenimiento", accent: "purple" },
];

interface VehicleDirectoryProps {
  vehicles?: Vehicle[];
  onVehicleClick?: (vehicle: Vehicle) => void;
}

export default function VehicleDirectory({ vehicles = defaultVehicles, onVehicleClick }: VehicleDirectoryProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "">("");
  const filteredVehicles = useMemo(() => vehicles.filter((vehicle) => {
    const text = `${vehicle.id} ${vehicle.owner ?? ""} ${vehicle.location ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (!status || vehicle.status === status);
  }), [query, status, vehicles]);

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar Unidad" aria-label="Buscar unidad" className="h-[30px] w-full max-w-[340px] rounded border border-[#dfdfdf] bg-white px-3 text-[10px] outline-none focus:border-[#2f75ff]" />
        <select value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "")} className="h-[30px] rounded border-0 bg-[#666] px-2.5 text-[10px] font-bold text-white outline-none">
          <option value="">Estado Operativo</option>
          <option value="En Ruta">En Ruta</option>
          <option value="Cargando">Cargando</option>
          <option value="En Mantenimiento">En Mantenimiento</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "")} className="h-[30px] rounded border-0 bg-[#666] px-2.5 text-[10px] font-bold text-white outline-none">
          <option value="">Nivel de Bateria </option>
          <option value="En Ruta">Alto (70%+)</option>
          <option value="Cargando">Media (30% - 69%)</option>
          <option value="En Mantenimiento">Bajo (0% - 29%)</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "")} className="h-[30px] rounded border-0 bg-[#666] px-2.5 text-[10px] font-bold text-white outline-none">
          <option value="">Tipo de Unidad</option>
          <option value="En Ruta">Van</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onVehicleClick} />)}
        {filteredVehicles.length === 0 && <p className="col-span-full py-10 text-center text-sm text-[#555]">No encontramos unidades.</p>}
      </div>
    </section>
  );
}
