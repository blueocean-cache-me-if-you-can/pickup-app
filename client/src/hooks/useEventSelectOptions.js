import { useMemo } from 'react';

const toIdNameOption = (item) => ({
  value: String(item._id ?? item.id ?? item.value ?? item.name),
  label: item.name ?? item.label ?? String(item),
});

const useEventSelectOptions = ({ activities, skillLevels, intensities }) => {
  const sportOptions = useMemo(() => activities.map(toIdNameOption), [activities]);
  const skillOptions = useMemo(() => skillLevels.map(toIdNameOption), [skillLevels]);
  const intensityOptions = useMemo(() => intensities.map(toIdNameOption), [intensities]);
  return { sportOptions, skillOptions, intensityOptions };
};

export default useEventSelectOptions;
