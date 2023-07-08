import { MDXRemote } from 'next-mdx-remote/rsc';

import { QueryMenus } from '@/lib/graphql';

import DynamicIcon from '@/components/elements/DynamicIcon';
import NewsletterForm from '@/components/elements/forms/NewsletterForm';
import Link from '@/components/elements/links';
import LanguageSwitch from '@/components/layout/LanguageSwitch';

import { useServer } from '@/store/serverStore';

const Footer = async () => {
  const locale = useServer.getState().locale;
  const locales = useServer.getState().locales;
  const currentLocale = locales?.find((el) => el.attributes.code === locale);

  const { data } = await QueryMenus(locale);
  const { footer } = data.attributes;

  return (
    <footer className='w-full bg-carbon-900 text-white'>
      <div className='layout flex flex-col gap-6 p-3 py-6 md:px-6 lg:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
          {footer.columns.map((column) => (
            <nav
              key={column.id}
              className='text-center md:text-left flex flex-col gap-3'
            >
              {column.title && (
                <h3 className='text-base xl:text-lg font-semibold'>
                  {column.title}
                </h3>
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
                      className='text-xl lg:text-2xl xl:text-3xl'
                    >
                      {social.name}
                    </Link>
                  ))}
                </div>
              )}
              {column.links.length > 0 && (
                <ul className='flex flex-col gap-3 text-sm xl:text-base font-normal'>
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
              {column.newsletter && (
                <div className='w-full flex justify-center md:justify-start'>
                  <NewsletterForm
                    placeholder={column.newsletter.placeholder}
                    className='max-w-xs'
                  />
                </div>
              )}
            </nav>
          ))}
        </div>
        <div className='flex flex-col gap-3 border-white border-t-2 pt-6 text-center text-sm xl:text-base'>
          <div className='flex justify-center'>
            <LanguageSwitch className='flex flex-row items-center justify-center gap-3'>
              <div className='w-8 h-fit rounded-sm overflow-hidden'>
                <DynamicIcon
                  icon={`flagpack:${
                    currentLocale?.attributes.code ?? 'gb-ukm'
                  }`}
                  className='w-8 h-fit'
                />
              </div>
              <span>{currentLocale?.attributes.name}</span>
            </LanguageSwitch>
          </div>
          <div>
            <MDXRemote source={footer.copyright} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
