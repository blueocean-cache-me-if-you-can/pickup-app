import React, {
  useEffect, useMemo, useState,
} from 'react';
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

function AddressPicker({
  value,
  onChange,
  label = 'Preferred address',
  placeholder = 'Preferred address',
  required = false,
}) {
  const [address, setAddress] = useState(value ?? '');

  const debouncedAddress = useDebounce(address, 300);
  const optionsFilter = useMemo(() => ({ options, search }) => {
    if (!search?.trim()) return [];
    return options;
  }, []);

  const { isReady, autocompleteService } = useGooglePlaces();
  const { options: suggestions, isLoading: isQueryLoading } = usePlaceAutocomplete(
    debouncedAddress,
    autocompleteService,
    isReady,
  );

  const { getCurrentAddress, isResolving } = useCurrentLocation();
  const isLoading = isQueryLoading || isResolving;

  useEffect(() => {
    setAddress(value ?? '');
  }, [value]);

  const handleUseMyLocation = async (e) => {
    e?.preventDefault?.();
    try {
      const resolved = await getCurrentAddress();
      if (resolved) {
        setAddress(resolved);
        onChange?.(resolved);
      }
    } catch (err) {
      console.error('Failed to use current location:', err);
    }
  };

  return (
    <Stack gap='xs'>
      <Autocomplete
        data={suggestions}
        value={address}
        onChange={(v) => {
          setAddress(v);
          onChange?.(v);
        }}
        placeholder={placeholder}
        rightSection={isLoading ? <Loader size='xs' /> : null}
        leftSection={<IconSearch size={16} />}
        limit={10}
        filter={optionsFilter}
        label={label}
        required={required}
        disabled={!isReady && !address}
      />
      <Group align='center' justify='center' gap='xs'>
        <IconLocation size={16} />
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
