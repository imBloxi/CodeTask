'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutGrid,
  ListTodo,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useWorkspace } from '@/hooks/use-workspace'
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher'
import { CreateWorkspaceDialog } from '@/components/workspace/create-workspace-dialog'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: ListTodo,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const { workspace } = useWorkspace()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    if (!workspace) {
      router.push('/login')
    }
  }, [workspace, router])

  if (!workspace) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-4 border-b bg-background px-4 shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <nav className="flex flex-col gap-4 p-4">
              <WorkspaceSwitcher />
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href ? 'bg-accent' : 'transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:gap-8">
          <WorkspaceSwitcher />
          <Button variant="outline" size="icon" asChild>
            <CreateWorkspaceDialog>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Create workspace</span>
            </CreateWorkspaceDialog>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="hidden w-[240px] flex-col gap-4 border-r p-4 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href ? 'bg-accent' : 'transparent'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
} 