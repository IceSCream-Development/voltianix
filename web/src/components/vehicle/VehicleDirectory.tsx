import { useEffect, useMemo, useState } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import type { BatteryLevel, ColorCategory, Vehicle, VehicleStatus, VehicleType } from "../../types/vehicle";
import { hasActiveFilters, matchesVehicleFilters } from "../../types/vehicle";
import { FILTER_CATEGORIES, toggleExclusive } from "../../lib/filterOptions";
import FilterPanel from "../dashboard/FilterPanel";
import VehicleCard from "./VehicleCard";

const focusRing = "focus-visible:ring-2 focus-visible:ring-[#2563EB]/40";
const PANEL_ID = "filtros-unidades";

interface VehicleDirectoryProps {
  onVehicleClick?: (vehicle: Vehicle) => void;
}

export default function VehicleDirectory({ onVehicleClick }: VehicleDirectoryProps) {
  const vehicles = useVehicles();
  const [query, setQuery] = useState("");
  /* Categoría que muestra el contenedor de opciones; los tres filtros de la fila
     cambian su contenido, no lo despliegan */
  const [activeCategory, setActiveCategory] = useState<Exclude<ColorCategory, null>>("status");
  /* Arreglo vacío = esa categoría no filtra; dentro de la categoría activa los
     valores se acumulan (lo resuelve matchesVehicleFilters) */
  const [selectedStatuses, setSelectedStatuses] = useState<VehicleStatus[]>([]);
  const [selectedBatteryLevels, setSelectedBatteryLevels] = useState<BatteryLevel[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<VehicleType[]>([]);
  const [highlightedVehicleId, setHighlightedVehicleId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      query,
      statuses: selectedStatuses,
      batteryLevels: selectedBatteryLevels,
      types: selectedTypes,
    }),
    [query, selectedStatuses, selectedBatteryLevels, selectedTypes]
  );

  const hasFilters = hasActiveFilters(filters);

  const filteredVehicles = useMemo(
    () => vehicles.filter((vehicle) => matchesVehicleFilters(vehicle, filters)),
    [vehicles, filters]
  );

  const clearSelections = () => {
    setSelectedStatuses([]);
    setSelectedBatteryLevels([]);
    setSelectedTypes([]);
  };

  /* Se filtra por una sola categoría a la vez (misma regla que el panel del mapa) */
  const applyToggle = (
    category: Exclude<ColorCategory, null>,
    value: VehicleStatus | BatteryLevel | VehicleType
  ) => {
    const next = toggleExclusive(
      { statuses: selectedStatuses, batteryLevels: selectedBatteryLevels, types: selectedTypes },
      category,
      value
    );

    setSelectedStatuses(next.statuses);
    setSelectedBatteryLevels(next.batteryLevels);
    setSelectedTypes(next.types);
  };

  /* Se filtra por una sola categoría a la vez: al cambiar de filtro se sueltan las
     marcas del anterior, para no arrastrar un cruce que ya no se ve en pantalla */
  const handleCategorySelect = (category: Exclude<ColorCategory, null>) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    clearSelections();
  };

  const clearFilters = () => {
    setQuery("");
    clearSelections();
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

      <div className="mb-5 mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar Unidad" aria-label="Buscar unidad" className={`h-[30px] w-full max-w-[340px] rounded border border-[#dfdfdf] bg-white px-3 text-[11px] outline-none focus:border-[#2f75ff] ${focusRing}`} />

          {FILTER_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                aria-pressed={isActive}
                aria-controls={PANEL_ID}
                onClick={() => handleCategorySelect(category.key)}
                className={`flex h-[30px] items-center rounded-[5px] px-3 text-[11px] font-bold outline-none transition-colors ${focusRing} ${
                  isActive ? "bg-[#616161] text-white" : "bg-[#F2F4F7] text-[#616161] hover:bg-[#E5E7EB]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <FilterPanel
          id={PANEL_ID}
          vehicles={vehicles}
          visibleCount={filteredVehicles.length}
          activeCategory={activeCategory}
          selectedStatuses={selectedStatuses}
          selectedBatteryLevels={selectedBatteryLevels}
          selectedTypes={selectedTypes}
          onStatusToggle={(status) => applyToggle("status", status)}
          onBatteryToggle={(level) => applyToggle("battery", level)}
          onTypeToggle={(type) => applyToggle("type", type)}
          onClearFilters={clearFilters}
          hasFilters={hasFilters}
        />
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
