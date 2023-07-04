'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';

import clsxm from '@/lib/clsxm';

import Skeleton from '@/components/Skeleton';

const DynamicIcon = ({
  icon,
  className,
  skeletonClassName,
}: {
  icon: string;
  className?: string;
  skeletonClassName?: string;
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {skeletonClassName && loading && (
        <Skeleton
          className={clsxm('rounded-full opacity-40', skeletonClassName)}
        />
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
