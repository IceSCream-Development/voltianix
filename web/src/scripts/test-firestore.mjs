/**
 * SCRIPT DE PRUEBA TEMPORAL — SERÁ ELIMINADO
 * --------------------------------------------------
 * Prueba de conexión a Firestore usando el SDK de Firebase.
 *
 * ⚠️ IMPORTANTE: Antes de ejecutar, asegúrate de que las reglas de
 * Firestore en la consola de Firebase permitan lectura/escritura
 * (modo TEST) para pruebas, o que tu proyecto esté en modo producción
 * con reglas adecuadas.
 *
 * Requiere Node 18+ (fetch nativo).
 *
 * Para ejecutar:
 *   cd web
 *   node scripts/test-firestore.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Cargar variables desde .env manualmente (sin dotenv) ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('❌ No se encontró el archivo .env en', filePath);
    process.exit(1);
  }
  const vars = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv(envPath);

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY,
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.PUBLIC_FIREBASE_APP_ID,
};

// Validación básica
for (const [k, v] of Object.entries(firebaseConfig)) {
  if (!v) {
    console.error(`❌ Falta la variable ${k} en .env`);
    process.exit(1);
  }
}

console.log('🚀 Inicializando Firebase para proyecto:', firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // --- 1. Escribir un documento de prueba ---
  const testDoc = {
    label: 'TEST-001',
    driver: 'Script de prueba',
    model: 'Tesla Model 3',
    type: 'automovil',
    status: 'en-ruta',
    battery: 100,
    autonomy: 400,
    location: { lat: 21.8853, lng: -102.2916 },
    createdAt: new Date().toISOString(),
  };

  console.log('Escribiendo documento en colección "vehicles"...');
  const docRef = await addDoc(collection(db, 'vehicles'), testDoc);
  console.log('Documento creado con ID:', docRef.id);

  // --- 2. Leer todos los documentos de la colección ---
  console.log('Leyendo colección "vehicles"...');
  const querySnapshot = await getDocs(collection(db, 'vehicles'));
  console.log(`Se encontraron ${querySnapshot.size} vehículo(s):`);
  querySnapshot.forEach((doc) => {
    console.log('  -', doc.id, '=>', JSON.stringify(doc.data()));
  });

  // --- 3. Limpiar el documento de prueba (opcional) ---
  console.log('Eliminando documento de prueba...');
  await deleteDoc(docRef);
  console.log('Documento de prueba eliminado.');

  console.log('\¡Prueba completada con éxito! Firestore está conectado y funcionando.');
} catch (err) {
  console.error('\n Error al conectar con Firestore:');
  console.error('   ', err.message);
  console.error('\n Posibles causas:');
  console.error('   - Las reglas de Firestore no permiten lectura/escritura.');
  console.error('   - El proyecto no tiene Firestore habilitado en la consola.');
  console.error('   - Credenciales incorrectas en .env.');
  console.error('\n   Para pruebas, pon las reglas en modo TEST en Firebase Console:');
  console.error('   Firestore Database → Rules → allow read, write: if true;');
}
