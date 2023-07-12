import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { QueryMenus } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import Link from '@/components/elements/links';

import { useServer } from '@/store/serverStore';

const Footer = async () => {
  const locale = useServer.getState().locale;

  const { data } = await QueryMenus(locale);
  const { footer } = data.attributes;

  return (
    <footer className='relative w-full bg-carbon-200 dark:bg-carbon-900 text-carbon-900 dark:text-white font-normal dark:font-light overflow-hidden border-t-2 border-carbon-900 dark:border-white'>
      <span className='absolute -bottom-10 -right-10 rounded-full bg-primary-600 w-60 h-60'></span>
      <div className='w-full bg-carbon-200/60 dark:bg-carbon-900/60 backdrop-blur-200'>
        <div className='layout flex flex-col gap-6 p-3 py-6 md:px-6 lg:px-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {footer.columns.map((column) => (
              <nav
                key={column.id}
                className='text-center md:text-left flex flex-col gap-3'
              >
                {!column.logo.data && column.title && (
                  <h3 className='text-base xl:text-lg font-semibold text-carbon-700 dark:text-carbon-400'>
                    {column.title}
                  </h3>
                )}
                {column.logo.data && (
                  <Image
                    src={MediaUrl(column.logo.data.attributes.url)}
                    priority
                    quality={100}
                    width={column.logo.data.attributes.width}
                    height={column.logo.data.attributes.height}
                    alt={column.logo.data.attributes.alternativeText ?? ''}
                    className='object-contain object-center md:object-left w-full h-10'
                    sizes='50vw'
                  />
                )}
                {column.description && (
                  <p className='text-sm xl:text-base'>{column.description}</p>
                )}
                {column.socials.length > 0 && (
                  <div className='flex flex-row gap-3 justify-center md:justify-start'>
                    {column.socials.map((social) => (
                      <Link
                        key={social.id}
                        href={social.href}
                        icon={social.icon}
                        openNewTab={social.open_new_tab}
                        style={social.style}
                        variant={social.variant}
                        className='text-xl lg:text-2xl xl:text-3xl text-carbon-900 dark:text-white hover:text-primary-600 active:text-primary-600 focus:text-primary-600'
                      >
                        {social.name}
                      </Link>
                    ))}
                  </div>
                )}
                {column.links.length > 0 && (
                  <ul className='flex flex-col gap-3 text-sm xl:text-base underline'>
                    {column.links.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          icon={item.icon}
                          openNewTab={item.open_new_tab}
                          style={item.style}
                          variant={item.variant}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            ))}
          </div>
          <div className='flex flex-col gap-3 text-center text-sm xl:text-base text-carbon-700 dark:text-carbon-400'>
            <MDXRemote source={footer.copyright} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
