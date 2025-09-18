// client/src/hooks/useImageUpload.js
const useImageUpload = () => {
    const readFileAsBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64String = String(reader.result).split(',')[1];
            resolve(base64String);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
    const uploadEventImage = async (imageFile, { maxSizeMB = 5 } = {}) => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (imageFile.size > maxBytes) {
        throw new Error(`Image must be ≤ ${maxSizeMB}MB`);
      }
  
      try {
        const base64 = await readFileAsBase64(imageFile);
        const filename = `event-img/${new Date().toISOString()}-${imageFile.name}`;
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, filename }),
        });
        const data = await response.json();
        return data?.url ?? '';
      } catch (err) {
        console.error('Image upload failed', err);
        return '';
      }
    };
  
    return { uploadEventImage };
  };
  
  export default useImageUpload;