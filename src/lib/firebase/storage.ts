// ============================================
// Firebase Storage Helpers
// ============================================
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadMetadata,
} from 'firebase/storage';
import { getStorageInstance } from './config';

/**
 * Upload de arquivo com progresso
 */
export function uploadFileWithProgress(
  path: string,
  file: File,
  metadata?: UploadMetadata,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

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
  const storage = getStorageInstance();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

/**
 * Deletar arquivo
 */
export async function deleteFile(path: string): Promise<void> {
  const storage = getStorageInstance();
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
