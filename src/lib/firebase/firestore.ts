// ============================================
// Firebase Firestore Generic Helpers (Edge/SSR Safe)
// ============================================
import type { DocumentData, QueryConstraint } from 'firebase/firestore';
import { getDbInstance } from './config';

async function getFs() {
  const mod = await import('firebase/firestore');
  const db = getDbInstance();
  return { ...mod, db };
}

/**
 * Buscar um documento por ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  const { doc, getDoc, db } = await getFs();
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
  if (typeof window === 'undefined') return [];
  const { query, collection, getDocs, db } = await getFs();
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
  if (typeof window === 'undefined') return;
  const { doc, setDoc, serverTimestamp, db } = await getFs();
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
  if (typeof window === 'undefined') return;
  const { doc, updateDoc, serverTimestamp, db } = await getFs();
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
  if (typeof window === 'undefined') return;
  const { doc, deleteDoc, db } = await getFs();
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
  let unsub: (() => void) | null = null;
  getFs().then(({ doc, onSnapshot, db }) => {
    const docRef = doc(db, collectionName, docId);
    unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    });
  });
  return () => {
    if (unsub) unsub();
  };
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
  let unsub: (() => void) | null = null;
  getFs().then(({ collection, query, onSnapshot, db }) => {
    const q = query(collection(db, collectionName), ...constraints);
    unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as T
      );
      callback(data);
    });
  });
  return () => {
    if (unsub) unsub();
  };
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
  if (typeof window === 'undefined') return null;
  const { doc, getDoc, db } = await getFs();
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
  if (typeof window === 'undefined') return;
  const { doc, setDoc, serverTimestamp, db } = await getFs();
  const docRef = doc(db, parentCollection, parentId, subCollection, docId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
}

export async function serverTimestamp() {
  const { serverTimestamp: st } = await import('firebase/firestore');
  return st();
}
