'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import clsxm from "@/lib/clsxm";

import Switch from "@/components/elements/buttons/Switch";
import NextImage from "@/components/NextImage";


const ThemeSwitch = ({ className }: { className?: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = (isOn: boolean) => {
    setTheme(isOn ? 'light' : 'dark');
  }

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className={clsxm('w-full h-full', className)}>
      <Switch
        className="bg-carbon-200 dark:bg-carbon-900 text-4xl shadow-carbon-200-inner dark:shadow-carbon-900-inner"
        toggleClassName="bg-transparent"
        isDark={resolvedTheme !== 'dark' ?? true}
        toggleIsOn={resolvedTheme !== 'dark' ?? true}
        toggle={handleToggle}
        icon={<NextImage src={resolvedTheme === 'dark' ? "/images/moon-dynamic-color.png" : "/images/sun-dynamic-color.png"} quality={100} width={30} height={30} alt="3d icon of the moon" />}
      />
    </div>
  )
}

export default ThemeSwitch;