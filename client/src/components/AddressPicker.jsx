import React, { useEffect, useMemo, useState } from 'react';
import {
  Anchor,
  Autocomplete,
  Loader,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconLocation, IconSearch } from '@tabler/icons-react';
import useDebounce from '../hooks/useDebounce';
import useGooglePlaces from '../hooks/useGooglePlaces';
import usePlaceAutocomplete from '../hooks/usePlaceAutocomplete';
import useCurrentLocation from '../hooks/useCurrentLocation';
import useGeocodeAddress from '../hooks/useGeocodeAddress';

function AddressPicker({
  value,
  onChange,
  label = 'Preferred address',
  placeholder = 'Preferred address',
  onResolved,
  error,
}) {
  const [address, setAddress] = useState(value ?? '');

  const debouncedAddress = useDebounce(address, 300);

  const { isReady, autocompleteService } = useGooglePlaces();
  const { options: suggestions, isLoading: isQueryLoading } = usePlaceAutocomplete(
    debouncedAddress,
    autocompleteService,
    isReady,
  );

  const { getCurrentAddress, isResolving: isResolvingLocation } = useCurrentLocation();
  const { resolveAddress, isResolving: isGeocoding } = useGeocodeAddress();
  const isLoading = isQueryLoading || isResolvingLocation || isGeocoding;

  useEffect(() => {
    setAddress(value ?? '');
  }, [value]);

  const handleUseMyLocation = async (e) => {
    e?.preventDefault?.();
    try {
      const resolved = await getCurrentAddress();
      if (resolved?.address) {
        setAddress(resolved.address);
        onChange?.(resolved.address);
        onResolved?.(resolved);
      }
    } catch (err) {
      console.error('Failed to use current location:', err);
    }
  };

  const handleConfirmAddress = async (val) => {
    setAddress(val);
    onChange?.(val);
    try {
      const resolved = await resolveAddress(val);
      if (resolved) onResolved?.(resolved);
    } catch (err) {
      console.error('Failed to geocode address:', err);
    }
  };

  const optionsFilter = useMemo(
    () => ({ options, search }) => {
      if (!search?.trim()) return [];
      return options;
    },
    [],
  );

  return (
    <Stack gap='xs'>
      <Autocomplete
        data={suggestions}
        value={address}
        onChange={(v) => setAddress(v)}
        onOptionSubmit={handleConfirmAddress}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirmAddress(address);
          }
        }}
        placeholder={placeholder}
        rightSection={isLoading ? <Loader size='xs' /> : null}
        leftSection={<IconSearch size={16} />}
        limit={10}
        filter={optionsFilter}
        label={label}
        disabled={!isReady && !address}
        error={error}
      />

      <Group align='center' justify='center' gap='xs'>
        <IconLocation size={16} />
        <Anchor c='black' underline='always' onClick={handleUseMyLocation}>
          <Text size='xs'>Use my current location</Text>
        </Anchor>
      </Group>
    </Stack>
  );
}

export default AddressPicker;
