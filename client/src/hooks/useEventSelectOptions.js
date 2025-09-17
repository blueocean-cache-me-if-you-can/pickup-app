import { useMemo } from 'react';

const toOption = (item) => ({
  value: String(item.id ?? item.value ?? item.name),
  label: item.name ?? item.label ?? String(item),
});

const useEventSelectOptions = ({ activities = [], skillLevels = [], intensities = [] }) => {
  const sportOptions = useMemo(() => activities.map(toOption), [activities]);
  const skillOptions = useMemo(() => skillLevels.map(toOption), [skillLevels]);
  const intensityOptions = useMemo(() => intensities.map(toOption), [intensities]);
  return { sportOptions, skillOptions, intensityOptions };
};

export default useEventSelectOptions;
