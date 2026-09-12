import { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle, ColorCategory } from '../../types/vehicle';
import { getVehicleColor } from '../../types/vehicle';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleMarkerComponent from './VehicleMarker';
import SearchBar from '../dashboard/SearchBar';
import MapFilterPanel from '../dashboard/MapFilterPanel';
import VehicleCard from '../vehicle/VehicleCard';

/* Vuela hacia un vehículo cuando se selecciona */
function FlyToVehicle({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.flyTo([lat, lng], 15, { duration: 0.8 });
  return null;
}

/* Controles de zoom personalizados */
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1 animate-fade-in">
      {/* Botón de ubicación */}
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Centrar mapa"
        aria-label="Centrar mapa"
        onClick={() => map.setView([21.8818, -102.2916], 13, { animate: true })}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
        </svg>
      </button>
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Acercar"
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50"
        style={{ border: '1px solid #E6E6E6', color: '#616161' }}
        title="Alejar"
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
}

export default function FleetMap() {
  // Datos: mock o Firebase según MOCK_DATA
  const vehicles = useVehicles();

  // Estado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ColorCategory>(null);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return vehicles;

    const query = searchQuery.toLowerCase();
    return vehicles.filter((vehicle) => {
      const haystack = `${vehicle.label} ${vehicle.driver} ${vehicle.model} ${vehicle.location.address}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, vehicles]);

  const totalCount = vehicles.length;

  // Manejadores
  const handleMarkerClick = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  const handleViewDetails = useCallback((vehicleId: string) => {
    if (typeof window !== 'undefined') {
      window.location.assign(`/unidades?vehicle=${vehicleId}`);
    }
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Centro de Aguascalientes, México
  const mapCenter: [number, number] = [21.8818, -102.2916];

  return (
    <div className="relative w-full h-full">
      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {filteredVehicles.map((vehicle) => (
          <VehicleMarkerComponent
            key={vehicle.id}
            vehicle={vehicle}
            color={getVehicleColor(vehicle, activeCategory)}
            isSelected={selectedVehicle?.id === vehicle.id}
            onClick={handleMarkerClick}
          />
        ))}

        {selectedVehicle && (
          <FlyToVehicle
            lat={selectedVehicle.location.lat}
            lng={selectedVehicle.location.lng}
          />
        )}

        <ZoomControls />
      </MapContainer>

      {/* Barra lateral izquierda: Búsqueda + Filtros */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onMenuToggle={toggleFilters} />

        {showFilters && (
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-1">
            <MapFilterPanel
              vehicles={vehicles}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}
      </div>

      {/* Tarjeta del vehículo: flota sobre el mapa */}
      {selectedVehicle && (
        <div className="absolute top-4 left-[320px] z-[1000]">
          <VehicleCard
            vehicle={selectedVehicle}
            onClose={handleCloseCard}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
}
