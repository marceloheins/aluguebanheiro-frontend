// src/features/uploads/hooks/useDownloadUrl.ts
import { useQuery } from '@tanstack/react-query';
import { getDownloadUrl } from '../api/uploadApi';

export function useDownloadUrl(fileKey?: string | null) {
  return useQuery({
    queryKey: ['download-url', fileKey],
    queryFn: () => getDownloadUrl(fileKey as string),
    enabled: !!fileKey, // Só faz a requisição se a fileKey existir
    staleTime: 4 * 60 * 1000, // Mantém a URL no cache por 4 minutos (ela expira em 5 min no S3)
  });
}