"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner"
import { ListProvider } from "@/contexts/list-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ListProvider>
        {children}
      </ListProvider>
      <Toaster position="bottom-right" />
    </NextThemesProvider>
  )
} 