import { useEffect } from 'react';
import { useForm } from '@mantine/form';

const useCreateEventForm = ({ onCreate, sportOptions = [] }) => {
  const form = useForm({
    initialValues: {
      imageFile: null,
      sport: sportOptions[0]?.value ?? '',
      minPlayers: 2,
      maxPlayers: 30,
      date: null,
      time: '',
      skillLevel: '',
      intensity: '',
      title: '',
      summary: '',
      description: '',
      instructions: '',
      address: '',
    },
    validate: {
      sport: (v) => (v ? null : 'Select a sport'),
      minPlayers: (v) => (v >= 2 && v <= 100 ? null : 'Choose between 2 and 100'),
      maxPlayers: (v, values) => {
        if (!(v >= 2 && v <= 100)) return 'Choose between 2 and 100';
        if (values?.minPlayers && v < values.minPlayers) return 'Max must be ≥ min';
        return null;
      },
      date: (v) => (v ? null : 'Date is required'),
      time: (v) => (v ? null : 'Time is required'),
      skillLevel: (v) => (v ? null : 'Select skill level'),
      title: (v) => (v.trim().length >= 2 ? null : 'Enter a title (min 2 chars)'),
      address: (v) => (v.trim() ? null : 'Address is required'),
    },
    transformValues: (values) => {
      const datePart = values.date ? values.date.toISOString().slice(0, 10) : '';
      return {
        ...values,
        datetime: datePart && values.time ? `${datePart}T${values.time}:00` : null,
      };
    },
  });

  useEffect(() => {
    if (!form.values.sport && sportOptions[0]?.value) {
      form.setFieldValue('sport', sportOptions[0].value);
    }
  }, [sportOptions, form]);

  return form;
};

export default useCreateEventForm;