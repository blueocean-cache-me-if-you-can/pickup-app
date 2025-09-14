import React, { useEffect, useMemo, useState } from 'react';
import { 
    Anchor, 
    Autocomplete, 
    Loader, 
    Group, 
    Stack,
    Text
} from '@mantine/core';
import { MagnifyingGlassIcon, NavigationArrowIcon } from '@phosphor-icons/react';

const MOCK_DATA = [
	'123 Main St, Anytown, USA',
	'456 Main St, Anytown, USA',
	'789 Main St, Anytown, USA',
	'101 Main St, Anytown, USA',
	'1600 Pennsylvania Ave NW, Washington, DC',
	'1 Hacker Way, Menlo Park, CA',
	'350 Fifth Ave, New York, NY',
	'1 Infinite Loop, Cupertino, CA',
	'221B Baker Street, London, UK',
	'10 Downing Street, London, UK',
	'405 Howard St, San Francisco, CA',
	'200 W Madison St, Chicago, IL',
	'500 S Buena Vista St, Burbank, CA',
	'30 Rockefeller Plaza, New York, NY',
	'77 Massachusetts Ave, Cambridge, MA',
];

const mockSearch = (query) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const q = query.trim().toLowerCase();
			if (!q) {
				resolve([]);
				return;
			}
			const results = MOCK_DATA.filter(a => a.toLowerCase().includes(q)).slice(0, 10);
			resolve(results);
		}, 350);
	});
};

const useDebounce = (value, delay) => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);

	return debounced;
};

const AddressPicker = () => {
	const [address, setAddress] = useState('');
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const debouncedAddress = useDebounce(address, 300);

	const optionsFilter = useMemo(() => {
		return ({ options, search }) => {
			if (!search?.trim()) return [];
			return options;
		};
	}, []);

	useEffect(() => {
		let isActive = true;

		const q = debouncedAddress.trim();
		if (!q) {
			setData([]);
			setIsLoading(false);
			return () => { isActive = false; };
		}

		setIsLoading(true);
		mockSearch(q).then(results => {
			if (!isActive) return;
			setData(results);
			setIsLoading(false);
		});

		return () => {
			isActive = false;
		};
	}, [debouncedAddress]);

	return (
		<Stack gap="xs">
			<Autocomplete
				data={data}
				value={address}
				onChange={setAddress}
				placeholder="Preferred address"
				rightSection={isLoading ? <Loader size="xs" /> : null}
                leftSection={<MagnifyingGlassIcon size={16} />}
				limit={10}
				filter={optionsFilter}
                radius='md'
                c='#6E6E6E'
                styles={{
                    input: {
                        border: 'none',
                        backgroundColor: '#EBEBEB',
                    }
                }}
			/>
            <Group align="center" justify="center" gap="xs">
                <NavigationArrowIcon size={16} style={{transform: 'rotate(90deg)'}}/>
                <Anchor c='black' underline='always'>
                    <Text size="xs">
                        Use my current location
                    </Text>
                </Anchor>
            </Group>
		</Stack>
	);
};


export default AddressPicker;