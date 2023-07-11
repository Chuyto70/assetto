import { clsx } from 'clsx';
import { ImageResponse, NextRequest } from 'next/server';

import { deploymentURL } from '@/constant/env';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url ? req.url : 'locahost');

  const siteName = searchParams.get('siteName');
  const description = searchParams.get('description');
  const theme = searchParams.get('theme');
  const logo = searchParams.get('logo');
  const templateTitle = searchParams.get('templateTitle');
  const logoWidth = searchParams.get('logoWidth');
  const logoHeight = searchParams.get('logoHeight');

  const query = {
    siteName: siteName ?? 'Site Name',
    description: description ?? 'Description',
    theme: theme ?? 'dark',
    logo: logo ?? `${deploymentURL}/images/favicon.png`,
    templateTitle,
    logoWidth: logoWidth ? +logoWidth : 100,
    logoHeight: logoHeight ? +logoHeight : undefined,
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          fontFamily: 'Rachana',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 5rem',
          backgroundColor: clsx(query.theme === 'dark' ? '#222' : '#fff'),
        }}
      >
        <picture>
          <img
            style={{
              width: query.logoWidth,
              ...(query.logoHeight && { height: query.logoHeight }),
            }}
            src={query.logo}
            alt='Favicon'
          />
        </picture>
        {query.templateTitle ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1
              tw={clsx(
                'mt-8',
                'text-6xl font-bold',
                query.theme === 'dark' ? 'text-white' : 'text-black'
              )}
            >
              {query.templateTitle}
            </h1>
            <h3
              tw={clsx(
                'text-2xl font-bold',
                query.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {query.siteName}
            </h3>
          </div>
        ) : (
          <h1
            tw={clsx(
              'mt-6',
              'text-6xl font-bold',
              query.theme === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            {query.siteName}
          </h1>
        )}
        <p
          tw={clsx(
            'text-3xl',
            query.theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
          )}
        >
          {query.description}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: 'twemoji'
    }
  );
};

export const runtime = 'edge';
