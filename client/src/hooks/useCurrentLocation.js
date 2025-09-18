import { useState } from 'react';
import { loadGoogleMapsPlaces } from '../utils/loadGoogleMaps';

const useCurrentLocation = () => {
  const [isResolving, setIsResolving] = useState(false);

  const getCurrentAddress = async () => {
    setIsResolving(true);
    try {
      const google = await loadGoogleMapsPlaces();
      if (!('geolocation' in navigator)) throw new Error('Geolocation not supported');

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude: lat, longitude: lng } = pos.coords;
      const geocoder = new google.maps.Geocoder();

      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && Array.isArray(results) && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Reverse geocoding failed: ${status}`));
          }
        });
      });

      const address = result.formatted_address;
      return { address, lat, lng };
    } finally {
      setIsResolving(false);
    }
  };

  return { getCurrentAddress, isResolving };
};

export default useCurrentLocation;