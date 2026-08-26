// ============================================
// Firebase Firestore Generic Helpers
// ============================================
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  onSnapshot,
  serverTimestamp as firestoreServerTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Buscar um documento por ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (err) {
    console.error(`Erro ao buscar documento em ${collectionName}/${docId}:`, err);
    return null;
  }
}

/**
 * Buscar documentos com filtros
 */
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as T
    );
  } catch (err) {
    console.error(`Erro ao buscar documentos em ${collectionName}:`, err);
    return [];
  }
}

/**
 * Criar ou sobrescrever documento
 */
export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  merge = true
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: firestoreServerTimestamp() }, { merge });
  } catch (err) {
    console.error(`Erro ao salvar documento em ${collectionName}/${docId}:`, err);
  }
}

/**
 * Atualizar campos de um documento
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: firestoreServerTimestamp() });
  } catch (err) {
    console.error(`Erro ao atualizar documento em ${collectionName}/${docId}:`, err);
  }
}

/**
 * Deletar um documento
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Erro ao deletar documento em ${collectionName}/${docId}:`, err);
  }
}

/**
 * Listener realtime em um documento
 */
export function subscribeToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
) {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Erro no listener de ${collectionName}/${docId}:`, error);
        callback(null);
      }
    );
  } catch (err) {
    console.error(`Erro ao inicializar listener de ${collectionName}/${docId}:`, err);
    return () => {};
  }
}

/**
 * Listener realtime em uma coleção
 */
export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
) {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as T
        );
        callback(data);
      },
      (error) => {
        console.error(`Erro no listener da coleção ${collectionName}:`, error);
        callback([]);
      }
    );
  } catch (err) {
    console.error(`Erro ao inicializar listener da coleção ${collectionName}:`, err);
    return () => {};
  }
}

/**
 * Buscar documento em subcoleção
 */
export async function getSubDocument<T = DocumentData>(
  parentCollection: string,
  parentId: string,
  subCollection: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, parentCollection, parentId, subCollection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (err) {
    console.error(
      `Erro ao buscar subdocumento em ${parentCollection}/${parentId}/${subCollection}/${docId}:`,
      err
    );
    return null;
  }
}

/**
 * Salvar documento em subcoleção
 */
export async function setSubDocument(
  parentCollection: string,
  parentId: string,
  subCollection: string,
  docId: string,
  data: DocumentData,
  merge = true
): Promise<void> {
  try {
    const docRef = doc(db, parentCollection, parentId, subCollection, docId);
    await setDoc(docRef, { ...data, updatedAt: firestoreServerTimestamp() }, { merge });
  } catch (err) {
    console.error(
      `Erro ao salvar subdocumento em ${parentCollection}/${parentId}/${subCollection}/${docId}:`,
      err
    );
  }
}

export async function serverTimestamp() {
  return firestoreServerTimestamp();
}
