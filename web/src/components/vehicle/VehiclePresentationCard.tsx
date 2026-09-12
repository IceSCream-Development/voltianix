import VehicleCard, { type Vehicle } from "./VehicleCard";

interface VehiclePresentationCardProps {
  vehicle: Vehicle;
  onClick?: (vehicle: Vehicle) => void;
}

export default function VehiclePresentationCard({ vehicle, onClick }: VehiclePresentationCardProps) {
  return <VehicleCard vehicle={vehicle} onClick={onClick} />;
}
