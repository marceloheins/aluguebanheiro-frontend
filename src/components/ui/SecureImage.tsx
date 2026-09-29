// src/components/ui/SecureImage.tsx
"use client";

import { useDownloadUrl } from '../../features/uploads/hooks/useDownloadUrl';
interface SecureImageProps {
  fileKey?: string | null;
  alt: string;
  className?: string;
}

export function SecureImage({ fileKey, alt, className = '' }: SecureImageProps) {
  const { data: imageUrl, isLoading, isError } = useDownloadUrl(fileKey);

  // Exibe um bloco cinza animado enquanto busca a URL
  if (isLoading) {
    return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
  }

  // Tratativa caso falhe ou o arquivo não exista
  if (isError || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-xs border border-dashed border-gray-300 rounded-md ${className}`}>
        Imagem indisponível
      </div>
    );
  }

  // Usamos a tag <img> padrão do HTML pois URLs do S3 variam dinamicamente,
  // o que dificultaria o uso do <Image> do Next.js sem configurações extras no next.config.js
  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={`object-cover rounded-md ${className}`} 
    />
  );
}