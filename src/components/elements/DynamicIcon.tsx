'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';

import Skeleton from '@/components/Skeleton';

const DynamicIcon = ({
  icon,
  className,
  wrapperClassName,
}: {
  icon: string;
  className?: string;
  wrapperClassName?: string;
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={wrapperClassName}>
      {loading && (
        <Skeleton className='rounded-full opacity-40 w-full h-full' />
      )}
      <Icon
        icon={icon}
        className={className}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default DynamicIcon;
