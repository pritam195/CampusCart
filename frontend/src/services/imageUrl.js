/**
 * Construct image URL for backend assets
 * Handles both relative paths (/public/...) and full URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/public/def-pic.jpg'; // Fallback to default
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's already a relative path starting with /public/, return as is
  // Vite proxy will handle routing to backend
  if (imagePath.startsWith('/public/')) {
    return imagePath;
  }

  // Otherwise, prepend /public/
  return `/public/${imagePath}`;
};
