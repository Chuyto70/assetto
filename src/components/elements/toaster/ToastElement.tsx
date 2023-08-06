import { ReactNode } from 'react';
import React from 'react';

import clsxm from '@/lib/clsxm';

import IconButton from '@/components/elements/buttons/IconButton';
import DynamicIcon from '@/components/elements/DynamicIcon';

import { ToasterTypes } from '@/store/toasterStore';

type Type = {
  children: ReactNode;
  close: () => void;
  type: ToasterTypes;
};

export default function Toast({ children, close, type }: Type) {
  const color =
    type === ToasterTypes.INFO
      ? 'border-gray-600 text-gray-600'
      : type === ToasterTypes.SUCCESS
        ? 'border-green-600 text-green-600'
        : type === ToasterTypes.WARNING
          ? 'border-yellow-600 text-yellow-600'
          : 'border-red-600 text-red-600';

  return (
    <div
      className={clsxm(
        color,
        'flex max-w-xs flex-row items-center justify-between gap-4 rounded-full border-2 bg-carbon-400/40 dark:bg-carbon-700/40 px-3 py-2 backdrop-blur-lg lg:max-w-lg'
      )}
    >
      {type === ToasterTypes.INFO && (
        <DynamicIcon icon='bi:info-lg' className='h-6 w-6 shrink-0' />
      )}
      {type === ToasterTypes.SUCCESS && (
        <DynamicIcon icon='bi:check-all' className='h-6 w-6 shrink-0' />
      )}
      {type === ToasterTypes.ERROR && (
        <DynamicIcon icon='ion:warning' className='h-6 w-6 shrink-0' />
      )}
      {type === ToasterTypes.WARNING && (
        <DynamicIcon icon='ion:alert' className='h-6 w-6 shrink-0' />
      )}
      <div className='flex items-center gap-2'>{children}</div>
      <IconButton
        icon='ion:close'
        className='h-6 w-6 rounded-full border-0 dark:text-carbon-200 dark:hover:text-carbon-700 bg-transparent shadow-none'
        variant='light'
        onClick={close}
      />
    </div>
  );
}
