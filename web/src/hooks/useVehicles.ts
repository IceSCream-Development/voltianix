import { useEffect, useState } from 'react';
import type { Vehicle, VehicleStatus, VehicleType } from '../types/vehicle';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { mockVehicles } from '../data/mock/vehicles';

/* ------------------------------------------------------------------ */
/* Variable de entorno: MOCK_DATA                                      */
/*   0 = usar datos mock                                               */
/*   1 = usar datos de Firebase (Firestore)                            */
/* ------------------------------------------------------------------ */
const USE_MOCK = import.meta.env.PUBLIC_MOCK_DATA !== '1';

/* ------------------------------------------------------------------ */
/* Estructura real de un documento en Firestore (colección "vehicles") */
/* ------------------------------------------------------------------ */
export interface FirestoreVehicle {
  vehicleId: string;
  batteryLevel: number;
  latitude: number;
  longitude: number;
  speedKmh: number;
  status: string;
  lastUpdate: { seconds: number; nanoseconds: number } | Date | null;
}

/* ------------------------------------------------------------------ */
/* Valores por defecto para campos que Firestore aún no tiene          */
/* ------------------------------------------------------------------ */
const DEFAULT_VALUES = {
  driver: 'Sin asignar',
  model: 'Desconocido',
  type: 'automovil' as VehicleType,
  autonomy: 100,
  address: 'Ubicación no disponible',
};

/* ------------------------------------------------------------------ */
/* Adapter: convierte un documento de Firestore a la interfaz Vehicle  */
/* ------------------------------------------------------------------ */
function mapFirestoreToVehicle(doc: FirestoreVehicle): Vehicle {
  const status: VehicleStatus =
    doc.status === 'en_ruta' ? 'en-ruta'
    : doc.status === 'cargando' ? 'cargando'
    : 'mantenimiento';

  // lastUpdate puede ser un timestamp de Firestore o Date
  let lastUpdate = 'Hace un momento';
  if (doc.lastUpdate) {
    const ts =
      typeof doc.lastUpdate === 'object' && 'seconds' in doc.lastUpdate
        ? new Date(doc.lastUpdate.seconds * 1000)
        : new Date(doc.lastUpdate);
    lastUpdate = ts.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return {
    id: doc.vehicleId,
    label: doc.vehicleId,
    driver: DEFAULT_VALUES.driver,
    model: DEFAULT_VALUES.model,
    type: DEFAULT_VALUES.type,
    status,
    battery: doc.batteryLevel,
    autonomy: DEFAULT_VALUES.autonomy,
    location: {
      lat: doc.latitude,
      lng: doc.longitude,
      address: DEFAULT_VALUES.address,
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
    if (USE_MOCK) return;

    // Modo Firebase: suscripción en tiempo real a la colección "vehicles"
    const unsubscribe = onSnapshot(
      collection(db, 'vehicles'),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) =>
          mapFirestoreToVehicle(docSnap.data() as FirestoreVehicle)
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
