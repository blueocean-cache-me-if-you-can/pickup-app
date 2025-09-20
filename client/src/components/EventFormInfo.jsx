import React from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import AddressPicker from './AddressPicker';

function EventFormInfo({ form, mode = 'create' }) {
  return (
    <Stack flex={1} miw={0}>
      <TextInput
        label='Title'
        placeholder='Event Title'
        value={form.values.title}
        onChange={(e) => form.setFieldValue('title', e.currentTarget.value)}
        error={form.errors.title}
      />

      <TextInput
        label='Brief Description'
        placeholder='Brief Description'
        value={form.values.summary}
        onChange={(e) => form.setFieldValue('summary', e.currentTarget.value)}
      />

      <Textarea
        label='Full Description'
        placeholder='Full Description'
        value={form.values.description}
        onChange={(e) => form.setFieldValue('description', e.currentTarget.value)}
      />

      <Textarea
        label='Additional Instructions'
        placeholder='Additional Instructions'
        value={form.values.instructions}
        onChange={(e) => form.setFieldValue('instructions', e.currentTarget.value)}
      />

      <AddressPicker
        label='Preferred address'
        value={form.values.address}
        onChange={(v) => form.setFieldValue('address', v)}
        onResolved={({ address, lat, lng }) => {
          if (address && address !== form.values.address) {
            form.setFieldValue('address', address);
          }
          form.setFieldValue('lat', lat);
          form.setFieldValue('lng', lng);
        }}
        error={form.errors.address || form.errors.lat || form.errors.lng}
        disabled={mode === 'edit'}
      />
    </Stack>
  );
}

export default EventFormInfo;