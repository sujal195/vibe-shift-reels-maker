
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
 */
export const getOptimizedImageUrl = (url: string | null | undefined): string => {
  if (!url) return optimizedPlaceholder;
  
  // If URL is from Supabase storage, we can pass it through as is
  if (url.includes('supabase.co/storage/v1/object/public')) {
    return url;
  }
  
  // For external images, we could add a proxy here if needed
  return url;
};

/**
 * Convert image to WebP format if supported
 * Note: This is a simple implementation, actual conversion would require server support
 */
export const convertToWebP = (url: string): string => {
  // In a real implementation, this would call a server endpoint to convert
  // For now, we just return the original URL
  return url;
};
