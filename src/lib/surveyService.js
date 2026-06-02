import { db, auth } from './firebase';
import { 
  collection, addDoc, getDoc, doc, getDocs, setDoc, query, limit, serverTimestamp, deleteDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const STORAGE_KEY = 'ia_cuestionario_progreso';
const BACKUP_KEY = 'ia_cuestionario_backup';

/**
 * Genera un ID único para el participante con formato IA-STUDY-XXXXX
 */
export function generateParticipantId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `IA-STUDY-${result}`;
}

/**
 * Guarda el progreso temporal en localStorage
 */
export function saveLocalProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar progreso local:', error);
  }
}

/**
 * Obtiene el progreso temporal de localStorage
 */
export function getLocalProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al leer progreso local:', error);
    return null;
  }
}

/**
 * Limpia el progreso temporal de localStorage
 */
export function clearLocalProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Envía las respuestas finales a Firebase Firestore y limpia el progreso local.
 * En caso de falla, guarda un respaldo en localStorage.
 */
export async function submitSurveyResponse(data) {
  try {
    const payload = {
      ...data,
      submittedAt: serverTimestamp(),
      systemInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    const docRef = await addDoc(collection(db, 'survey_responses'), payload);
    clearLocalProgress();
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('Error al enviar respuestas a Firebase:', error);
    
    // Guardar una copia de respaldo para que el usuario no pierda su participación
    try {
      const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
      backups.push({
        ...data,
        failedAt: new Date().toISOString(),
        error: error.message
      });
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
    } catch (e) {
      console.error('Error al guardar respaldo local:', e);
    }
    
    throw error;
  }
}

/**
 * Verifica si un usuario es administrador buscando en la colección 'admins'
 */
export async function checkIsAdmin(uid) {
  if (!uid) return false;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error al verificar privilegios de administrador:', error);
    return false;
  }
}

/**
 * Verifica si existen administradores en la colección 'admins'
 */
export async function hasAdmins() {
  try {
    const q = query(collection(db, 'admins'), limit(1));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('Error al verificar existencia de administradores:', error);
    throw error;
  }
}

/**
 * Registra la primera cuenta de administrador en Firebase Auth y Firestore
 */
export async function registerFirstAdmin(email, password) {
  try {
    // 1. Crear el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // 2. Crear el documento correspondiente en la colección 'admins'
    await setDoc(doc(db, 'admins', uid), {
      email,
      createdAt: new Date().toISOString(),
      role: 'admin'
    });
    
    return userCredential.user;
  } catch (error) {
    console.error('Error al registrar administrador inicial:', error);
    throw error;
  }
}

/**
 * Recupera todas las respuestas almacenadas en la base de datos
 */
export async function getAllResponses() {
  try {
    const snap = await getDocs(collection(db, 'survey_responses'));
    return snap.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    }));
  } catch (error) {
    console.error('Error al recuperar las respuestas:', error);
    throw error;
  }
}

/**
 * Elimina todas las respuestas registradas en Firestore
 */
export async function clearAllResponses() {
  try {
    const snap = await getDocs(collection(db, 'survey_responses'));
    const deletePromises = snap.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    console.error('Error al vaciar las respuestas:', error);
    throw error;
  }
}
