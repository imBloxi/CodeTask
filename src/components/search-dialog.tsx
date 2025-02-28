"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useList } from "@/contexts/list-context"
import { Search, List, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  type: "list" | "todo" | "tag"
  title: string
  subtitle?: string
  listId?: string
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const router = useRouter()
  const { lists, getTodosForList } = useList()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const results = React.useMemo(() => {
    if (!search) return []

    const searchResults: SearchResult[] = []
    const searchLower = search.toLowerCase()

    // Search lists
    lists.forEach(list => {
      if (list.name.toLowerCase().includes(searchLower)) {
        searchResults.push({
          id: list.id,
          type: "list",
          title: list.name,
        })
      }

      // Search todos in list
      const todos = getTodosForList(list.id)
      todos.forEach(todo => {
        if (
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
        ) {
          searchResults.push({
            id: todo.id,
            type: "todo",
            title: todo.title,
            subtitle: `in ${list.name}`,
            listId: list.id,
          })
        }
      })

      // Search tags
      todos.forEach(todo => {
        todo.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchLower)) {
            searchResults.push({
              id: `${list.id}-${tag}`,
              type: "tag",
              title: tag,
              subtitle: `in ${list.name}`,
              listId: list.id,
            })
          }
        })
      })
    })

    return searchResults
  }, [search, lists, getTodosForList])

  // Reset selected index when results change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [results.length])

  const onSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.type === "list") {
      router.push(`/list/${result.id}`)
    } else if (result.type === "todo" || result.type === "tag") {
      router.push(`/list/${result.listId}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % results.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + results.length) % results.length)
        break
      case "Enter":
        e.preventDefault()
        if (results[selectedIndex]) {
          onSelect(results[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b pb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search lists, todos, and tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          {results.length > 0 && (
            <div className="flex flex-col gap-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-left text-sm hover:bg-accent",
                    selectedIndex === index && "bg-accent"
                  )}
                  onClick={() => onSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {result.type === "list" && <List className="h-4 w-4" />}
                  {result.type === "todo" && <Search className="h-4 w-4" />}
                  {result.type === "tag" && <Tag className="h-4 w-4" />}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          {search && results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No results found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 