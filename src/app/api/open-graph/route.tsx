import { clsx } from 'clsx';
import { NextApiRequest } from 'next';
import { ImageResponse } from 'next/server';

import { deploymentURL } from '@/constant/env';

export const GET = async (req: NextApiRequest) => {

  const inter400 = fetch(
    new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  
  const inter700 = fetch(
    new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  
  const interRegular = await inter400;
  const interBold = await inter700;

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
    logo: logo ?? `${deploymentURL}/images/new-tab.png`,
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
          fontFamily: 'Inter',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 5rem',
          backgroundColor: clsx(query.theme === 'dark' ? '#222' : '#fff'),
        }}
      >
        <picture><img
          style={{
            width: query.logoWidth,
            ...(query.logoHeight && { height: query.logoHeight }),
          }}
          src={query.logo}
          alt='Favicon'
        /></picture>
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
      emoji: 'twemoji',
      fonts: [
        {
          name: 'Inter',
          data: interRegular,
          weight: 400,
        },
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
        },
      ],
    }
  );
}

export const runtime = 'edge';