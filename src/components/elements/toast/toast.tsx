import { ReactNode } from 'react';
import { BsCheckAll, BsInfoLg } from 'react-icons/bs';
import { IoAlert, IoClose, IoWarning } from 'react-icons/io5';

import clsxm from '@/lib/clsxm';

import IconButton from '@/components/elements/buttons/IconButton';

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
        'flex max-w-xs flex-row items-center justify-between gap-4 rounded-full border-2 bg-white/60 p-4 backdrop-blur-lg lg:max-w-lg'
      )}
    >
      {type === ToasterTypes.INFO && <BsInfoLg className='h-6 w-6 shrink-0' />}
      {type === ToasterTypes.SUCCESS && (
        <BsCheckAll className='h-6 w-6 shrink-0' />
      )}
      {type === ToasterTypes.ERROR && (
        <IoWarning className='h-6 w-6 shrink-0' />
      )}
      {type === ToasterTypes.WARNING && (
        <IoAlert className='h-6 w-6 shrink-0' />
      )}
      <div className='flex items-center gap-2'>{children}</div>
      <IconButton
        icon={IoClose}
        className='h-6 w-6 rounded-full border-0 bg-transparent text-gray-400 shadow-none'
        variant='light'
        onClick={close}
      />
    </div>
  );
}
