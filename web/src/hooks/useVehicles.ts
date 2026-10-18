import { useEffect, useState } from 'react';
import type { Vehicle, VehicleStatus, VehicleType } from '../types/vehicle';
import { db } from '../lib/firebase';
import { collection, onSnapshot, type GeoPoint } from 'firebase/firestore';
import { mockVehicles } from '../data/mock/vehicles';

/* ------------------------------------------------------------------ */
/* Variable de entorno: MOCK_DATA                                      */
/*   0 = usar datos mock                                               */
/*   1 = usar datos de Firebase (Firestore)                            */
/* ------------------------------------------------------------------ */
const USE_MOCK = import.meta.env.PUBLIC_MOCK_DATA !== '1';

/* ------------------------------------------------------------------ */
/* Estructura de un documento en Firestore (colección "vehicles").     */
/* La escribe voltianix_simulator; ver su README para el esquema.      */
/* ------------------------------------------------------------------ */
export interface FirestoreVehicle {
  name?: string;
  driver?: string;
  model?: string;
  type?: string;
  status: string;
  battery?: number;
  /* Autonomía con 100 % de carga */
  rangeKm?: number;
  location?: GeoPoint;
  address?: string;
  speedKmh?: number;
  lastUpdate: { seconds: number; nanoseconds: number } | Date | null;
}

/* ------------------------------------------------------------------ */
/* Valores por defecto para campos que falten en el documento          */
/* ------------------------------------------------------------------ */
const DEFAULT_VALUES = {
  driver: 'Sin asignar',
  model: 'Desconocido',
  type: 'automovil' as VehicleType,
  rangeKm: 100,
  address: 'Ubicación no disponible',
};

const VEHICLE_TYPES: VehicleType[] = ['automovil', 'van', 'camion', 'motocicleta'];

function isVehicleType(value: unknown): value is VehicleType {
  return VEHICLE_TYPES.includes(value as VehicleType);
}

/* ------------------------------------------------------------------ */
/* Adapter: convierte un documento de Firestore a la interfaz Vehicle  */
/* ------------------------------------------------------------------ */
function mapFirestoreToVehicle(id: string, doc: FirestoreVehicle): Vehicle {
  const status: VehicleStatus =
    doc.status === 'en_ruta' ? 'en-ruta'
    : doc.status === 'cargando' ? 'cargando'
    : 'mantenimiento';

  // lastUpdate puede ser un timestamp de Firestore o Date.
  // Se guarda como tiempo relativo sin "Hace" porque la tarjeta ya muestra "Actualizado hace".
  let lastUpdate = 'un momento';
  if (doc.lastUpdate) {
    const ts =
      typeof doc.lastUpdate === 'object' && 'seconds' in doc.lastUpdate
        ? new Date(doc.lastUpdate.seconds * 1000)
        : new Date(doc.lastUpdate);
    const seconds = Math.max(0, Math.round((Date.now() - ts.getTime()) / 1000));
    if (seconds < 60) lastUpdate = `${seconds}s`;
    else if (seconds < 3600) lastUpdate = `${Math.floor(seconds / 60)} min`;
    else if (seconds < 86400) lastUpdate = `${Math.floor(seconds / 3600)} h`;
    else lastUpdate = `${Math.floor(seconds / 86400)} d`;
  }

  const battery = doc.battery ?? 0;
  const rangeKm = doc.rangeKm ?? DEFAULT_VALUES.rangeKm;

  return {
    id,
    label: doc.name ?? id,
    driver: doc.driver ?? DEFAULT_VALUES.driver,
    model: doc.model ?? DEFAULT_VALUES.model,
    type: isVehicleType(doc.type) ? doc.type : DEFAULT_VALUES.type,
    status,
    battery,
    autonomy: Math.round((battery * rangeKm) / 100),
    location: {
      lat: doc.location?.latitude ?? 0,
      lng: doc.location?.longitude ?? 0,
      address: doc.address ?? DEFAULT_VALUES.address,
    },
    lastUpdate,
  };
}

/* ------------------------------------------------------------------ */
/* Hook principal: devuelve la lista de vehículos según MOCK_DATA      */
/* ------------------------------------------------------------------ */
export function useVehicles(): Vehicle[] {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    USE_MOCK ? mockVehicles : []
  );

  useEffect(() => {
    // Sin configuración de Firebase no hay base de datos a la cual suscribirse
    if (USE_MOCK || !db) return;

    // Modo Firebase: suscripción en tiempo real a la colección "vehicles"
    const unsubscribe = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) =>
          mapFirestoreToVehicle(docSnap.id, docSnap.data() as FirestoreVehicle)
        );
        setVehicles(list);
      },
      (error) => {
        console.error('❌ Error al leer Firestore:', error.message);
        setVehicles([]);
      }
    );

    return () => unsubscribe();
  }, []);

  return vehicles;
}
