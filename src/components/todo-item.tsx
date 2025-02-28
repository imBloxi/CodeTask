"use client"

import { format } from "date-fns"
import { Trash2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TodoItem } from "@/types/todo"

interface TodoItemCardProps {
  todo: TodoItem
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItemCard({ todo, onComplete, onDelete }: TodoItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 shrink-0 rounded-full ${todo.completed ? "text-green-500" : "text-muted-foreground"}`}
            onClick={() => onComplete(todo.id)}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="sr-only">Mark as {todo.completed ? "incomplete" : "complete"}</span>
          </Button>
          <div>
            <h3 className={`font-semibold leading-none ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
              {todo.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                Created {format(new Date(todo.createdAt), "MMM d, yyyy")}
              </p>
              <Badge variant="secondary" className="text-xs">
                {todo.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {todo.priority}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      </CardHeader>
      <CardContent>
        {todo.description && (
          <p className={`text-sm mb-2 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
            {todo.description}
          </p>
        )}
        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {todo.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {todo.codeSnippet && (
          <div className="mt-4 space-y-2">
            <Badge variant="outline" className="text-xs">
              {todo.codeSnippet.language}
            </Badge>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              <code>{todo.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 