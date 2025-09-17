import { useEffect, useState } from 'react';

const usePlaceAutocomplete = (query, service, isReady) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;
    const q = (query || '').trim();

    if (!q) {
      setOptions([]);
      setIsLoading(false);
      return () => { isActive = false; };
    }

    if (!isReady || !service) {
      setIsLoading(false);
      return () => { isActive = false; };
    }

    setIsLoading(true);
    service.getPlacePredictions(
      { input: q, types: ['geocode'] },
      (predictions, status) => {
        if (!isActive) return;
        if (status === 'OK' && Array.isArray(predictions)) {
          setOptions(predictions.slice(0, 10).map((p) => p.description));
        } else {
          setOptions([]);
        }
        setIsLoading(false);
      },
    );

    return () => { isActive = false; };
  }, [query, isReady, service]);

  return { options, isLoading };
};

export default usePlaceAutocomplete;
