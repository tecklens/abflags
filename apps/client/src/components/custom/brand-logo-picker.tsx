import 'react-color-palette/css';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { get } from 'lodash';
import { IconUpload } from '@tabler/icons-react';

export default function BrandLogoPicker({
  logo,
  onChange,
}: {
  logo?: string | File | undefined;
  onChange: (file: File) => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(get(acceptedFiles, 0));
    },
    [onChange],
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/gif': ['.gif'],
    },
    onDrop,
  });

  useEffect(() => {
    if (logo) {
      if (typeof logo == 'string') {
        setImage(logo);
      } else {
        setImage(URL.createObjectURL(logo));
      }
    }
  }, [logo]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={'flex flex-col items-center space-y-3'}
      >
        <input {...getInputProps()} />
        <div
          className={'aspect-square max-w-[300px] max-h-[300px] rounded-full'}
        >
          {image ? (
            <div
              className={
                'w-full aspect-square max-w-[300px] rounded-full relative border border-3 border-gray-300 group'
              }
            >
              <img
                alt="preview"
                src={image}
                className={'object-cover h-full w-full rounded-full'}
              />
              <div
                className={
                  'hidden group-hover:flex absolute h-full w-full top-0 left-0 bg-black/60 items-center justify-center rounded-full'
                }
              >
                <IconUpload size={28} color={'#fff'} />
              </div>
            </div>
          ) : (
            <div
              className={
                'flex flex-col space-y-1 rounded-full bg-green-600/10 hover:bg-green-600/30 items-center justify-center py-2 text-green-600' +
                'w-full aspect-square max-w-[300px] px-3 border border-3 border-gray-300'
              }
            >
              <IconUpload size={28} />
              <div className={'text-center'}>
                Drag 'n' drop some files here, or click to select files
              </div>
            </div>
          )}
        </div>
        <em className={'text-xs'}>
          Only .jpg, .jpeg, .png and .webp formats are supported.
        </em>
      </div>
    </div>
  );
}
