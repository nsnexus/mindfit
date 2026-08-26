// ============================================
// Firebase Storage Helpers (Pure Browser Dynamic Import)
// ============================================
import type { UploadMetadata } from 'firebase/storage';
import { getStorageInstance } from './config';

/**
 * Helper interno para carregar o módulo Storage e a instância
 */
async function getSt() {
  if (typeof window === 'undefined') return null;
  const storage = await getStorageInstance();
  if (!storage) return null;
  const mod = await import('firebase/storage');
  return { ...mod, storage };
}

/**
 * Upload de arquivo com progresso
 */
export async function uploadFileWithProgress(
  path: string,
  file: File,
  metadata?: UploadMetadata,
  onProgress?: (progress: number) => void
): Promise<string> {
  const st = await getSt();
  if (!st) throw new Error('Firebase Storage não disponível');

  const { ref, uploadBytesResumable, getDownloadURL, storage } = st;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

/**
 * Upload simples de arquivo
 */
export async function uploadFile(
  path: string,
  file: File,
  metadata?: UploadMetadata
): Promise<string> {
  const st = await getSt();
  if (!st) throw new Error('Firebase Storage não disponível');

  const { ref, uploadBytes, getDownloadURL, storage } = st;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

/**
 * Deletar arquivo
 */
export async function deleteFile(path: string): Promise<void> {
  const st = await getSt();
  if (!st) return;

  const { ref, deleteObject, storage } = st;
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Gera o path de armazenamento para fotos de progresso do usuário
 */
export function getProgressPhotoPath(
  userId: string,
  type: 'front' | 'side' | 'back',
  date: string
): string {
  return `users/${userId}/progress/${date}_${type}.jpg`;
}

/**
 * Gera o path de armazenamento para foto de perfil
 */
export function getProfilePhotoPath(userId: string): string {
  return `users/${userId}/profile/avatar.jpg`;
}
