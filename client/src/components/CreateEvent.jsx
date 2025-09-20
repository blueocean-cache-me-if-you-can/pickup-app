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
import useImageUpload from '../hooks/useImageUpload';
import useDateTimeFormatter from '../hooks/useDateTimeFormatter';
import { createEvent } from '../api';

function CreateEvent({
  user,
  activities,
  skillLevels,
  intensities,
  onRefresh,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { sportOptions, skillOptions, intensityOptions } = useEventSelectOptions({
    activities,
    skillLevels,
    intensities,
  });

  const form = useCreateEventForm();
  const { uploadEventImage } = useImageUpload();
  const { formatEventDateTime } = useDateTimeFormatter();

  const handleSubmit = async (values) => {
    let imageUrl = '';
    try {
      imageUrl = values.imageFile
        ? await uploadEventImage(values.imageFile, { maxSizeMB: 25 })
        : '';
    } catch (error) {
      console.error('error', error);
      return;
    } finally {
      const dateTimeString = formatEventDateTime(
        values.date,
        values.time,
        values.lng,
        values.lat,
      );

      const location = [values.lng, values.lat];

      const payload = {
        title: values.title,
        user_id: user._id,
        activityId: values.sport,
        skillId: values.skillLevel,
        intensityId: values.intensity,
        brief_description: values.summary,
        description: values.description,
        additional_info: values.instructions,
        time: dateTimeString,
        photo: imageUrl,
        address: values.address,
        minPlayers: values.minPlayers,
        maxPlayers: values.maxPlayers,
        coordinates: location,
      };
      console.log('payload', payload);
      try {
        const event = await createEvent(payload);
        console.log('success event created', event);
      } catch (error) {
        console.error('error', error);
      } finally {
        setIsOpen(false);
        form.reset();
        onRefresh?.();
      }
    }
  };

  return (
    <>
      <Button variant='filled' color='teal' onClick={() => setIsOpen(true)}>
        <Group gap='xs'>
          <IconPlus size={16} />
          Create Event
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
        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log('form errors', errors))}>
          <Stack align='flex-start' w='100%' mah='100%'>
            <ScrollArea flex={1} w='100%'>
              <Group align='flex-start' gap='xl' wrap='nowrap' w='100%'>
                <PhotoPicker
                  size={160}
                  label='Add an event photo'
                  onChange={(f) => form.setFieldValue('imageFile', f)}
                  onError={(msg) => form.setFieldError('imageFile', msg)}
                  maxSizeMB={5}
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
              <Button type='submit'>Create Event</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default CreateEvent;
