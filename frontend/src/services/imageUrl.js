
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/public/def-pic.jpg'; 
  }

  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  
  
  if (imagePath.startsWith('/public/')) {
    return imagePath;
  }

  
  return `/public/${imagePath}`;
};
