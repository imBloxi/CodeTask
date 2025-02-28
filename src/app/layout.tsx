import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { SearchDialog } from "@/components/search-dialog"
import { NewListDialog } from "@/components/new-list-dialog"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#030711",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Task Management System - Modern Developer Task Tracking",
    template: "%s | Task Management System"
  },
  description: "A modern task management system built for developers with code snippet support, real-time updates, and a beautiful dark theme UI.",
  keywords: ["task management", "developer tools", "code snippets", "project management", "todo list"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Task Management System - Modern Developer Task Tracking",
    description: "A modern task management system built for developers with code snippet support, real-time updates, and a beautiful dark theme UI.",
    siteName: "Task Management System"
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Management System - Modern Developer Task Tracking",
    description: "A modern task management system built for developers with code snippet support, real-time updates, and a beautiful dark theme UI.",
    creator: "@yourusername"
  },
  manifest: "/manifest.json"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          {children}
          <SearchDialog />
          <NewListDialog />
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            className: "dark",
          }}
        />
      </body>
    </html>
  )
}
