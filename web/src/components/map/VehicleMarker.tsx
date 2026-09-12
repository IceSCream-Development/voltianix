import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../../types/vehicle';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  color: string;
  isSelected: boolean;
  onClick: (vehicle: Vehicle) => void;
}

function createMarkerIcon(vehicle: Vehicle, color: string, isSelected: boolean) {
  const scale = isSelected ? 1.1 : 1;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        transform: scale(${scale});
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
        z-index: ${isSelected ? 1000 : 1};
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: ${color};
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Poppins', system-ui, sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px ${color}40;
          border: 2px solid rgba(255, 255, 255, 0.9);
          letter-spacing: 0.02em;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        ">
          ${vehicle.label}
        </div>
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid rgba(255, 255, 255, 0.9);
          margin: 3px auto 0;
          transition: background 0.3s ease, border-color 0.3s ease;
        "></div>
      </div>
    `,
    iconSize: [76, 42],
    iconAnchor: [38, 36],
    popupAnchor: [0, -36],
  });
}

export default function VehicleMarker({ vehicle, color, isSelected, onClick }: VehicleMarkerProps) {
  return (
    <Marker
      position={[vehicle.location.lat, vehicle.location.lng]}
      icon={createMarkerIcon(vehicle, color, isSelected)}
      eventHandlers={{
        click: () => onClick(vehicle),
      }}
    />
  );
}
