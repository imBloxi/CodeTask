'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useWorkspace } from '@/hooks/use-workspace'
import { CreateWorkspaceDialog } from './create-workspace-dialog'

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false)
  const { workspace, workspaces, selectWorkspace } = useWorkspace()

  if (!workspaces) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a workspace"
          className="w-[200px] justify-between"
        >
          {workspace?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search workspace..." />
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces.map((ws) => (
                <CommandItem
                  key={ws.id}
                  onSelect={() => {
                    selectWorkspace(ws)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      workspace?.id === ws.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {ws.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <CreateWorkspaceDialog>
                  <div className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Workspace
                  </div>
                </CreateWorkspaceDialog>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 