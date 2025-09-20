import React, { useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PhotoPicker from './PhotoPicker';
import EventFormInfo from './EventFormInfo';
import EventFormDetails from './EventFormDetails';
import useEventSelectOptions from '../hooks/useEventSelectOptions';
import useCreateEventForm from '../hooks/useCreateEventForm';
import useImageUpload from '../hooks/useImageUpload';
import useDateTimeFormatter from '../hooks/useDateTimeFormatter';
import { updateEvent, deleteEvent } from '../api';

function EditEvent({
  event,
  activities,
  skillLevels,
  intensities,
  onRefresh,
}) {
  const [isOpen, { open, close }] = useDisclosure(false);

  const { sportOptions, skillOptions, intensityOptions } = useEventSelectOptions({
    activities,
    skillLevels,
    intensities,
  });

  const form = useCreateEventForm();
  const { uploadEventImage } = useImageUpload();
  const { formatEventDateTime, toLocalDateTimeParts } = useDateTimeFormatter();
  const [lng, lat] = event.coordinates;
  const { date, time } = toLocalDateTimeParts(event.time, lng, lat);

  useEffect(() => {
    form.setValues({
      title: event.title,
      sport: event.activityId,
      skillLevel: event.skillId,
      intensity: event.intensityId,
      minPlayers: event.minPlayers,
      maxPlayers: event.maxPlayers,
      address: event.address,
      summary: event.brief_description,
      description: event.description,
      instructions: event.additional_info,
      imageFile: event.photo,
      date,
      time,
      lat,
      lng,
    });
  }, [event, lng, lat, date, time]);

  const handleDelete = async (eventId) => {
    try {
      const deletedEvent = await deleteEvent(eventId);
      console.log('success event deleted', deletedEvent);
    } catch (error) {
      console.error('error', error);
    } finally {
      close();
      form.reset();
      onRefresh?.();
    }
  };

  const handleSubmit = async (values) => {
    let imageUrl = event.photo;
    try {
      imageUrl = values.imageFile !== event.photo
        ? await uploadEventImage(values.imageFile, { maxSizeMB: 25 })
        : event.photo;
    } catch (error) {
      console.error('error', error);
      return;
    }

    const dateTimeString = formatEventDateTime(values.date, values.time, values.lng, values.lat);

    const payload = {};
    if (values.title !== event.title) payload.title = values.title;
    if (values.skillLevel !== event.skillId) payload.skillId = values.skillLevel;
    if (values.intensity !== event.intensityId) payload.intensityId = values.intensity;
    if (values.summary !== event.brief_description) payload.brief_description = values.summary;
    if (values.description !== event.description) payload.description = values.description;
    if (values.instructions !== event.additional_info) payload.additional_info = values.instructions;
    if (dateTimeString !== event.time) payload.time = dateTimeString;
    if (values.imageFile !== event.photo) payload.photo = imageUrl;
    if (values.minPlayers !== event.minPlayers) payload.minPlayers = values.minPlayers;
    if (values.maxPlayers !== event.maxPlayers) payload.maxPlayers = values.maxPlayers;
    console.log('payload', payload);

    try {
      if (Object.keys(payload).length > 0) {
        const updatedEvent = await updateEvent(payload, event._id);
        console.log('success event updated', updatedEvent);
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      close();
      form.reset();
      onRefresh?.();
    }
  };

  return (
    <>
      <Button
        m='xs'
        variant='filled'
        fullWidth
        data-no-expand
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        Edit
      </Button>

      <Modal
        opened={isOpen}
        onClose={() => close()}
        size='80rem'
        radius='md'
        padding='lg'
        centered
        title={<Text fw={600}>Edit Event</Text>}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
        // onClickCapture={(e) => e.stopPropagation() }
        // closeOnClickOutside={false}
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
                  initialUrl={event.photo}
                  maxSizeMB={5}
                  style={{ flex: '0 0 160px' }}
                  mode='event'
                />
                <EventFormDetails
                  form={form}
                  sportOptions={sportOptions}
                  skillOptions={skillOptions}
                  intensityOptions={intensityOptions}
                  mode='edit'
                />
                <EventFormInfo form={form} mode='edit' />
              </Group>
            </ScrollArea>

            <Group w='100%' justify='flex-end'>
              <Button variant='default' onClick={() => handleDelete(event._id)}>
                Delete
              </Button>
              <Button
                type='submit'
                data-no-expand
                onClick={(e) => e.stopPropagation()}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default EditEvent;
