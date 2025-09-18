import { useState } from 'react';
import { loadGoogleMapsPlaces } from '../utils/loadGoogleMaps';

const useGeocodeAddress = () => {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState(null);

  const resolveAddress = async (input) => {
    const address = (input || '').trim();
    if (!address) return null;
    setIsResolving(true);
    setError(null);
    try {
      const google = await loadGoogleMapsPlaces();
      const geocoder = new google.maps.Geocoder();

      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && Array.isArray(results) && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const loc = result.geometry?.location;
      const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
      const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;

      return {
        address: result.formatted_address || address,
        lat,
        lng,
      };
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsResolving(false);
    }
  };

  return { resolveAddress, isResolving, error };
};

export default useGeocodeAddress;