import dynamic from 'next/dynamic';
import React from 'react';
import { IconBaseProps, IconType } from 'react-icons/lib';

export type DynamicIcon = {
  family: string;
  icon: string;
} & IconBaseProps;

const DynamicIcon = ({ family, icon, ...rest }: DynamicIcon) => {
  const Icons = {
    ci: dynamic(async () => {
      const mod = await import('react-icons/ci');
      return mod[icon as keyof IconType];
    }),
    fa: dynamic(async () => {
      const mod = await import('react-icons/fa');
      return mod[icon as keyof IconType];
    }),
    io: dynamic(async () => {
      const mod = await import('react-icons/io');
      return mod[icon as keyof IconType];
    }),
    io5: dynamic(async () => {
      const mod = await import('react-icons/io5');
      return mod[icon as keyof IconType];
    }),
    md: dynamic(async () => {
      const mod = await import('react-icons/md');
      return mod[icon as keyof IconType];
    }),
    ti: dynamic(async () => {
      const mod = await import('react-icons/ti');
      return mod[icon as keyof IconType];
    }),
    go: dynamic(async () => {
      const mod = await import('react-icons/go');
      return mod[icon as keyof IconType];
    }),
    fi: dynamic(async () => {
      const mod = await import('react-icons/fi');
      return mod[icon as keyof IconType];
    }),
    gi: dynamic(async () => {
      const mod = await import('react-icons/gi');
      return mod[icon as keyof IconType];
    }),
    wi: dynamic(async () => {
      const mod = await import('react-icons/wi');
      return mod[icon as keyof IconType];
    }),
    di: dynamic(async () => {
      const mod = await import('react-icons/di');
      return mod[icon as keyof IconType];
    }),
    ai: dynamic(async () => {
      const mod = await import('react-icons/ai');
      return mod[icon as keyof IconType];
    }),
    bs: dynamic(async () => {
      const mod = await import('react-icons/bs');
      return mod[icon as keyof IconType];
    }),
    ri: dynamic(async () => {
      const mod = await import('react-icons/ri');
      return mod[icon as keyof IconType];
    }),
    fc: dynamic(async () => {
      const mod = await import('react-icons/fc');
      return mod[icon as keyof IconType];
    }),
    gr: dynamic(async () => {
      const mod = await import('react-icons/gr');
      return mod[icon as keyof IconType];
    }),
    hi: dynamic(async () => {
      const mod = await import('react-icons/hi');
      return mod[icon as keyof IconType];
    }),
    hi2: dynamic(async () => {
      const mod = await import('react-icons/hi2');
      return mod[icon as keyof IconType];
    }),
    si: dynamic(async () => {
      const mod = await import('react-icons/si');
      return mod[icon as keyof IconType];
    }),
    sl: dynamic(async () => {
      const mod = await import('react-icons/sl');
      return mod[icon as keyof IconType];
    }),
    im: dynamic(async () => {
      const mod = await import('react-icons/im');
      return mod[icon as keyof IconType];
    }),
    bi: dynamic(async () => {
      const mod = await import('react-icons/bi');
      return mod[icon as keyof IconType];
    }),
    cg: dynamic(async () => {
      const mod = await import('react-icons/cg');
      return mod[icon as keyof IconType];
    }),
    vsc: dynamic(async () => {
      const mod = await import('react-icons/vsc');
      return mod[icon as keyof IconType];
    }),
    tb: dynamic(async () => {
      const mod = await import('react-icons/tb');
      return mod[icon as keyof IconType];
    }),
    tfi: dynamic(async () => {
      const mod = await import('react-icons/tfi');
      return mod[icon as keyof IconType];
    }),
  };

  const Icon = family && icon ? Icons[family as keyof typeof Icons] : null;

  if (!Icon) return <></>;

  return (
    <>
      <Icon {...rest} />
    </>
  );
};

export default DynamicIcon;
