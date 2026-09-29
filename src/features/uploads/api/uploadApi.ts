// src/features/uploads/api/uploadApi.ts
import { api } from '../../../lib/api';

export async function getDownloadUrl(fileKey: string): Promise<string> {
  const { data } = await api.get('/uploads/download-url', {
    params: { fileKey },
  });
  return data.downloadUrl;
}