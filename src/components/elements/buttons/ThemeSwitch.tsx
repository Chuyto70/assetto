'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div>The current theme is: {theme}</div>
  )
}

export default ThemeSwitch