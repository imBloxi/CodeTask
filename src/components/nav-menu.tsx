"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoList {
  id: string
  name: string
  createdAt: string
}

export function NavMenu() {
  const pathname = usePathname()
  const [lists, setLists] = React.useState<TodoList[]>([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [newListName, setNewListName] = React.useState("")

  React.useEffect(() => {
    const savedLists = localStorage.getItem("todoLists")
    if (savedLists) {
      setLists(JSON.parse(savedLists))
    }
  }, [])

  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: TodoList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      createdAt: new Date().toISOString()
    }

    const updatedLists = [...lists, newList]
    setLists(updatedLists)
    localStorage.setItem("todoLists", JSON.stringify(updatedLists))
    setNewListName("")
    setIsCreating(false)
  }

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Your Lists
          </h2>
          <div className="space-y-1">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === "/" && "bg-accent"
                )}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                All Tasks
              </Button>
            </Link>
            {lists.map((list) => (
              <Link key={list.id} href={`/list/${list.id}`} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === `/list/${list.id}` && "bg-accent"
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {list.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        {isCreating ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              className="w-full px-3 py-2 text-sm rounded-md border"
              onKeyDown={(e) => {
                if (e.key === "Enter") createNewList()
                if (e.key === "Escape") setIsCreating(false)
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={createNewList}
                className="w-full"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsCreating(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New List
          </Button>
        )}
      </div>
    </div>
  )
} 