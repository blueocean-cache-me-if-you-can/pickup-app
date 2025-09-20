// client/src/components/PhotoPicker.jsx
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  ActionIcon, Avatar, Box, FileButton, Stack, Text, rem,
} from '@mantine/core';
import { IconPlus, IconUser, IconPhoto } from '@tabler/icons-react';

function PhotoPicker({
  size = 160,
  label = 'Upload a photo for your profile',
  accept = 'image/*',
  onChange,
  mode = 'profile',
  onError,
  maxSizeMB = 5,
  initialUrl = null,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);

  const resetRef = useRef(null);

  const handleFileChange = (f) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f && f.size > maxBytes) {
      onError?.(`Image must be ≤ ${maxSizeMB}MB`);
      resetRef.current?.(); // clears the input
      return;
    }

    setFile(f);
    onChange?.(f ?? null);
    resetRef.current?.();
  };

  useEffect(() => {
    let url;

    if (file) {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  const dimension = useMemo(() => rem(size), [size]);
  const badgeSize = useMemo(() => Math.max(32, Math.min(48, Math.floor(size * 0.3))), [size]);

  return (
    <Stack align='center' gap='sm'>
      <FileButton onChange={handleFileChange} resetRef={resetRef} accept={accept}>
        {({
          onClick, onKeyDown, onFocus, onBlur, className,
        }) => (
          <Box
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            className={className}
            role='button'
            aria-label='Upload profile photo'
            tabIndex={0}
            style={{
              position: 'relative',
              width: dimension,
              height: dimension,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <Avatar
              src={previewUrl || undefined}
              radius='50%'
              styles={{ root: { width: '100%', height: '100%' } }}
              color='gray'
              variant={previewUrl ? 'filled' : 'light'}
            >
              {(!previewUrl && mode === 'profile') && <IconUser size={Math.max(48, Math.floor(size * 0.35))} />}
              {(!previewUrl && mode === 'event') && <IconPhoto size={Math.max(48, Math.floor(size * 0.35))} />}
            </Avatar>

            <ActionIcon
              variant='filled'
              color='dark'
              radius='50%'
              style={{
                position: 'absolute',
                right: 4,
                bottom: 4,
                width: rem(badgeSize),
                height: rem(badgeSize),
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <IconPlus size={Math.floor(badgeSize * 0.6)} />
            </ActionIcon>
          </Box>
        )}
      </FileButton>

      <Text size='sm' c='dimmed' ta='center'>
        {label}
      </Text>
    </Stack>
  );
}

export default PhotoPicker;
