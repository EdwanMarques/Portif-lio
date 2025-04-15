import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Image({ src, alt, fallback = 'https://via.placeholder.com/400x300?text=Imagem+não+carregada', ...props }: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onError={() => {
        console.error(`Erro ao carregar imagem: ${src}`);
        setError(true);
      }}
      {...props}
    />
  );
} 