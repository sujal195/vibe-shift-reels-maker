
import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, handleImageError, getPlaceholder } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function LazyImage({ src, alt, className, width, height }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(getPlaceholder());
  
  useEffect(() => {
    const img = new Image();
    img.src = getOptimizedImageUrl(src || '');
    
    img.onload = () => {
      setImageSrc(img.src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setImageSrc(getPlaceholder());
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onError={handleImageError}
        loading="lazy"
        width={width}
        height={height}
      />
    </div>
  );
}
