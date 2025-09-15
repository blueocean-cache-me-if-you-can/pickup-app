import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  Anchor,
  Autocomplete,
  Loader,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { MagnifyingGlassIcon, NavigationArrowIcon } from '@phosphor-icons/react';

const loadGoogleMapsPlaces = async () => {
  if (window.google?.maps?.places) return window.google;

  // eslint-disable-next-line no-undef
  const apiKey = process.env.GOOGLE_API;
  if (!apiKey) throw new Error('Missing GOOGLE_API environment variable');

  const existing = document.getElementById('google-maps-js');
  if (existing) {
    if (window.google?.maps?.places) return window.google;
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', reject);
    });
  }

  const script = document.createElement('script');
  script.id = 'google-maps-js';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
  script.async = true;
  script.defer = true;

  const p = new Promise((resolve, reject) => {
    script.onload = () => resolve(window.google);
    script.onerror = reject;
  });

  document.head.appendChild(script);
  return p;
};

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

function AddressPicker() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const autocompleteSvcRef = useRef(null);

  const debouncedAddress = useDebounce(address, 300);

  const optionsFilter = useMemo(() => ({ options, search }) => {
    if (!search?.trim()) return [];
    return options;
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsPlaces()
      .then((google) => {
        if (cancelled) return;
        autocompleteSvcRef.current = new google.maps.places.AutocompleteService();
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps Places:', err);
        setIsReady(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let isActive = true;

    const q = debouncedAddress.trim();
    if (!q) {
      setData([]);
      setIsLoading(false);
      return () => { isActive = false; };
    }

    if (!isReady || !autocompleteSvcRef.current) {
      setIsLoading(false);
      return () => { isActive = false; };
    }

    setIsLoading(true);
    autocompleteSvcRef.current.getPlacePredictions(
      { input: q, types: ['geocode'] },
      (predictions, status) => {
        if (!isActive) return;
        if (status === 'OK' && Array.isArray(predictions)) {
          setData(predictions.slice(0, 10).map((p) => p.description));
        } else {
          setData([]);
        }
        setIsLoading(false);
      },
    );

    return () => {
      isActive = false;
    };
  }, [debouncedAddress, isReady]);

  const handleUseMyLocation = async (e) => {
    e?.preventDefault?.();
    try {
      setIsLoading(true);
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
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && Array.isArray(results) && results[0]) {
          setAddress(results[0].formatted_address);
          setData([]);
        } else {
          console.error('Reverse geocoding failed:', status);
        }
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Failed to use current location:', err);
      setIsLoading(false);
    }
  };

  return (
    <Stack gap='xs'>
      <Autocomplete
        data={data}
        value={address}
        onChange={setAddress}
        placeholder='Preferred address'
        rightSection={isLoading ? <Loader size='xs' /> : null}
        leftSection={<MagnifyingGlassIcon size={16} />}
        limit={10}
        filter={optionsFilter}
        label='Preferred address'
        required
      />
      <Group align='center' justify='center' gap='xs'>
        <NavigationArrowIcon size={16} style={{ transform: 'rotate(90deg)' }} />
        <Anchor c='black' underline='always' onClick={handleUseMyLocation}>
          <Text size='xs'>
            Use my current location
          </Text>
        </Anchor>
      </Group>
    </Stack>
  );
}

export default AddressPicker;
