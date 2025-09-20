import React from 'react';
import {
  Stack, Text, Select, RangeSlider,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';

function EventFormDetails({
  form, sportOptions, skillOptions, intensityOptions, mode = 'create',
}) {
  return (
    <Stack>
      <Text fw={600}>Event Details</Text>

      <Select
        label='Sport'
        placeholder='Choose a sport'
        data={sportOptions}
        value={form.values.sport}
        onChange={(v) => form.setFieldValue('sport', v)}
        error={form.errors.sport}
        disabled={mode === 'edit'}
      />

      <Stack gap={6}>
        <Text size='sm'>
          Players:
          {' '}
          {form.values.minPlayers}
          {' '}
          -
          {' '}
          {form.values.maxPlayers}
        </Text>
        <RangeSlider
          min={2}
          max={100}
          step={1}
          marks={[
            { value: 2, label: '2' },
            { value: 100, label: '100' },
          ]}
          value={[form.values.minPlayers, form.values.maxPlayers]}
          onChange={([min, max]) => {
            form.setFieldValue('minPlayers', min);
            form.setFieldValue('maxPlayers', max);
          }}
        />
      </Stack>

      <DatePickerInput
        label='Date'
        placeholder='Select date'
        value={form.values.date}
        onChange={(v) => form.setFieldValue('date', v)}
        error={form.errors.date}
      />

      <TimeInput
        label='Time'
        placeholder='Select time'
        value={form.values.time}
        onChange={(e) => form.setFieldValue('time', e.currentTarget.value)}
        error={form.errors.time}
      />

      <Select
        label='Skill Level'
        placeholder='Choose skill level'
        data={skillOptions}
        value={form.values.skillLevel}
        onChange={(v) => form.setFieldValue('skillLevel', v)}
        error={form.errors.skillLevel}
      />

      <Select
        label='Intensity'
        placeholder='Choose intensity'
        data={intensityOptions}
        value={form.values.intensity}
        onChange={(v) => form.setFieldValue('intensity', v)}
      />
    </Stack>
  );
}

export default EventFormDetails;
