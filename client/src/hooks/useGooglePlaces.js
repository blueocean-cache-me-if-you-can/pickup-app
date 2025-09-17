import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsPlaces } from '../utils/loadGoogleMaps';

const useGooglePlaces = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const autocompleteServiceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsPlaces()
      .then((google) => {
        if (cancelled) return;
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        setIsReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setIsReady(false);
      });

    return () => { cancelled = true; };
  }, []);

  return {
    isReady,
    error,
    autocompleteService: autocompleteServiceRef.current,
  };
};

export default useGooglePlaces;
