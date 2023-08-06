'use client';

import { ThemeProvider } from "next-themes";

const ThemesProvider = (props: { children?: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' enableSystem={true}>
      {props.children}
    </ThemeProvider>
  )
}

export default ThemesProvider;