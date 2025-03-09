"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Only render the theme provider's effects after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // When rendering on the server or during hydration, provide a simplified wrapper
  // that doesn't apply any classes yet
  if (!mounted) {
    return <>{children}</>
  }

  // Once mounted on the client, use the full theme provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

