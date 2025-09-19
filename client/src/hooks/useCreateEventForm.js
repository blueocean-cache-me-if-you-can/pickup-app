import { useForm } from '@mantine/form';

const useCreateEventForm = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      imageFile: null,
      sport: '',
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
      lat: null,
      lng: null,
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
      lat: (v) => (v == null ? 'Select an address from the list or use current location' : null),
      lng: (v) => (v == null ? 'Select an address from the list or use current location' : null),
    },
  });

  return form;
};

export default useCreateEventForm;
