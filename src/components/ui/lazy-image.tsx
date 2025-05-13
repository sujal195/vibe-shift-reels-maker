import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, handleImageError, getPlaceholder } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // If true, don't lazy-load (useful for LCP images)
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  width = 0, 
  height = 0,
  priority = false 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(getPlaceholder());
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Set dimensions to maintain aspect ratio and prevent CLS
  const [dimensions, setDimensions] = useState({ width, height });
  
  useEffect(() => {
    // If this is a priority image (above the fold / LCP candidate), load immediately
    if (priority) {
      const optimizedSrc = getOptimizedImageUrl(src || '');
      setImageSrc(optimizedSrc);
      return;
    }
    
    // Otherwise use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const optimizedSrc = getOptimizedImageUrl(src || '');
            setImageSrc(optimizedSrc);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' } // Start loading when within 200px of viewport
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [src, priority]);
  
  // Calculate and set proper aspect ratio if dimensions aren't provided
  useEffect(() => {
    if (!width || !height) {
      const img = new Image();
      img.src = getOptimizedImageUrl(src || '');
      
      img.onload = () => {
        setDimensions({
          width: img.naturalWidth || 300,
          height: img.naturalHeight || 200
        });
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setDimensions({ width: 300, height: 200 });
        setImageSrc(getPlaceholder());
        setIsLoaded(true);
      };
    }
  }, [src, width, height]);
  
  return (
    <div 
      className={cn("relative overflow-hidden", className)} 
      style={{ 
        width: dimensions.width || 'auto', 
        height: dimensions.height || 'auto',
        aspectRatio: dimensions.width && dimensions.height 
          ? `${dimensions.width} / ${dimensions.height}` 
          : undefined
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
      )}
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
        width={dimensions.width || undefined}
        height={dimensions.height || undefined}
      />
    </div>
  );
}
