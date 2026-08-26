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
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { getDbInstance } from './config';

/**
 * Buscar um documento por ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const db = getDbInstance();
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

/**
 * Buscar documentos com filtros
 */
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getDbInstance();
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as T
  );
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
  const db = getDbInstance();
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
}

/**
 * Atualizar campos de um documento
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const db = getDbInstance();
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

/**
 * Deletar um documento
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const db = getDbInstance();
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

/**
 * Listener realtime em um documento
 */
export function subscribeToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
) {
  if (typeof window === 'undefined') return () => {};
  const db = getDbInstance();
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

/**
 * Listener realtime em uma coleção
 */
export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
) {
  if (typeof window === 'undefined') return () => {};
  const db = getDbInstance();
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T
    );
    callback(data);
  });
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
  const db = getDbInstance();
  const docRef = doc(db, parentCollection, parentId, subCollection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
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
  const db = getDbInstance();
  const docRef = doc(db, parentCollection, parentId, subCollection, docId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
}

// Re-exporta utilitários do Firestore usados frequentemente
export { where, orderBy, limit, serverTimestamp, collection, query };
