'use client'

import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'
import { SupabaseProvider } from './supabase-provider'
import { WorkspaceProvider } from '@/hooks/use-workspace'
import { TasksProvider } from '@/hooks/use-tasks'
import { SubscriptionProvider } from '@/hooks/use-subscription'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider>
        <WorkspaceProvider>
          <SubscriptionProvider>
            <TasksProvider>
              {children}
            </TasksProvider>
          </SubscriptionProvider>
        </WorkspaceProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
} 