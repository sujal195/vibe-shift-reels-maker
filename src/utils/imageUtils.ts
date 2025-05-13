
import optimizedPlaceholder from '../assets/optimized-placeholder.svg';

/**
 * Generates a placeholder image URL based on the dimensions specified.
 * Uses our optimized placeholder instead of the read-only one.
 */
export const getPlaceholder = () => {
  return optimizedPlaceholder;
};

/**
 * Checks if an image URL is broken and returns a placeholder if it is.
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = optimizedPlaceholder;
};

/**
 * Optimized image component that handles errors and lazy loading
 * Uses WebP format when available
 */
export const getOptimizedImageUrl = (url: string | null | undefined): string => {
  if (!url) return optimizedPlaceholder;
  
  // If URL is from Supabase storage, we can optimize via parameters
  if (url.includes('supabase.co/storage/v1/object/public')) {
    // Add WebP conversion parameters if supported
    try {
      // Test for WebP support
      if (window.navigator && window.navigator.userAgent) {
        const isWebPSupported = 
          window.navigator.userAgent.indexOf('Chrome') >= 0 || 
          window.navigator.userAgent.indexOf('Firefox') >= 0 ||
          window.navigator.userAgent.indexOf('Edge') >= 0;
          
        if (isWebPSupported) {
          // Add WebP conversion parameter if URL doesn't have parameters already
          if (!url.includes('?')) {
            return `${url}?format=webp&quality=80`;
          }
        }
      }
    } catch (e) {
      // Fallback silently if we can't detect WebP support
    }
    return url;
  }
  
  return url;
};

/**
 * Preload critical images to improve LCP (Largest Contentful Paint)
 * @param urls Array of image URLs to preload
 */
export const preloadCriticalImages = (urls: string[]): void => {
  if (typeof document === 'undefined') return;
  
  urls.forEach(url => {
    if (!url) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(url);
    document.head.appendChild(link);
  });
};

/**
 * Get image dimensions to prevent CLS (Cumulative Layout Shift)
 * @param url Image URL
 * @param defaultWidth Default width if cannot be determined
 * @param defaultHeight Default height if cannot be determined
 */
export const getImageDimensions = async (
  url: string,
  defaultWidth = 300,
  defaultHeight = 200
): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve({width: defaultWidth, height: defaultHeight});
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || defaultWidth,
        height: img.naturalHeight || defaultHeight
      });
    };
    
    img.onerror = () => {
      resolve({width: defaultWidth, height: defaultHeight});
    };
    
    img.src = url;
  });
};
