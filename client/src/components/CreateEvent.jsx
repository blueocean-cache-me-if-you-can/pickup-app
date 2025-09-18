import React, { useState } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  ScrollArea,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import PhotoPicker from './PhotoPicker';
import EventFormInfo from './EventFormInfo';
import EventFormDetails from './EventFormDetails';
import useEventSelectOptions from '../hooks/useEventSelectOptions';
import useCreateEventForm from '../hooks/useCreateEventForm';

export function CreateEvent({
  activities = [],
  skillLevels = [],
  intensities = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { sportOptions, skillOptions, intensityOptions } = useEventSelectOptions({
    activities,
    skillLevels,
    intensities,
  });

  const form = useCreateEventForm();

  const handleSubmit = (e) => {
    // console.log('form submitted', values);
    e.preventDefault();
    const payload = form.values;
    console.log('CreateEvent payload:', payload);
    // onCreate?.(payload);
    // setIsOpen(false);
    // form.reset();
  };

  return (
    <>
      <Button variant='filled' color='teal' onClick={() => setIsOpen(true)}>
        <Group gap='xs'>
          <IconPlus size={16} />
          Create Activity
        </Group>
      </Button>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        size='80rem'
        radius='md'
        padding='lg'
        centered
        title={<Text fw={600}>Create New Event</Text>}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
      >
        <form onSubmit={e => handleSubmit(e)}>
          <Stack align='flex-start' w='100%' mah='100%'>
            <ScrollArea flex={1} w='100%'>
              <Group align='flex-start' gap='xl' wrap='nowrap' w='100%'>
                <PhotoPicker
                  size={160}
                  label='Add an event photo'
                  onChange={(f) => form.setFieldValue('imageFile', f)}
                  style={{ flex: '0 0 160px' }}
                  mode='event'
                />
                <EventFormDetails
                  form={form}
                  sportOptions={sportOptions}
                  skillOptions={skillOptions}
                  intensityOptions={intensityOptions}
                />
                <EventFormInfo form={form} />
              </Group>
            </ScrollArea>

            <Group w='100%' justify='flex-end'>
              <Button variant='default' onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button color='dark' type='submit'>Create Event</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default CreateEvent;
