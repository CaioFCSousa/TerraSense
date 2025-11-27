import { useState, useCallback } from 'react';

export function useImageCapture() {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureImage = useCallback((file: File) => {
    setIsCapturing(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
      setIsCapturing(false);
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setIsCapturing(false);
    };

    reader.readAsDataURL(file);
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
  }, []);

  return {
    image,
    isCapturing,
    captureImage,
    clearImage
  };
}
