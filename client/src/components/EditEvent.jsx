import React, { useState } from 'react';
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

function EditEvent({
  event,
  activities,
  skillLevels,
  intensities,
}) {
  const [isOpen, { open, close }] = useDisclosure(false);

  const { sportOptions, skillOptions, intensityOptions } = useEventSelectOptions({
    activities,
    skillLevels,
    intensities,
  });

  const form = useCreateEventForm();
  const { uploadEventImage } = useImageUpload();
  const { formatEventDateTime } = useDateTimeFormatter();

  const handleSubmit = async (values) => {
    const imageUrl = values.imageFile
      ? await uploadEventImage(values.imageFile, { maxSizeMB: 25 })
      : '';

    const dateTimeString = formatEventDateTime(values.date, values.time);

    // const location = [values.longitude, values.latitude];

    const payload = {
      title: values.title,
      user_id: event.owner.user_id,
      activityId: values.sport,
      skillId: values.skillLevel,
      intensityId: values.intensity,
      brief_description: values.summary,
      description: values.description,
      additional_info: values.instructions,
      time: dateTimeString,
      imageUrl,
      location: values.address,
      minPlayers: values.minPlayers,
      maxPlayers: values.maxPlayers,
      latitude: values.lat,
      longitude: values.lng,
    };
    console.log('payload', payload);

    // e.preventDefault();
    // const payload = form.values;
    // console.log('CreateEvent payload:', payload);
    // onCreate?.(payload);
    close();
    form.reset();
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
                <Button 
                    variant='default' 
                    data-no-expand 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        close(); 
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    color='dark' 
                    type='submit' 
                    data-no-expand 
                    onClick={(e) => e.stopPropagation()}
                >
                    Create Event
                </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default EditEvent;
