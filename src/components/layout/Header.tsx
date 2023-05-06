import * as React from 'react';

import UnstyledLink from '@/components/elements/links/UnstyledLink';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Home
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <li>Cart</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
