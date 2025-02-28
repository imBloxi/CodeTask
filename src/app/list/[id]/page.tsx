"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AddTodoForm } from "@/components/add-todo-form"
import { TodoItemCard } from "@/components/todo-item"
import { TodoItem } from "@/types/todo"
import { v4 as uuidv4 } from "uuid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface TodoList {
  id: string
  name: string
  createdAt: string
}

export default function ListPage() {
  const params = useParams()
  const listId = params.id as string

  const [list, setList] = useState<TodoList | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    // Load list details
    const savedLists = localStorage.getItem("todoLists")
    if (savedLists) {
      const lists = JSON.parse(savedLists)
      const currentList = lists.find((l: TodoList) => l.id === listId)
      setList(currentList || null)
    }

    // Load todos for this list
    const savedTodos = localStorage.getItem(`todos_${listId}`)
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [listId])

  useEffect(() => {
    // Save todos whenever they change
    if (todos.length > 0) {
      localStorage.setItem(`todos_${listId}`, JSON.stringify(todos))
    }
  }, [todos, listId])

  const handleAddTodo = (newTodo: Omit<TodoItem, "id" | "createdAt" | "completed">) => {
    const todo: TodoItem = {
      ...newTodo,
      id: uuidv4(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTodos([todo, ...todos])
  }

  const handleCompleteTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const allTags = Array.from(
    new Set(todos.flatMap(todo => todo.tags))
  )

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => todo.tags.includes(tag))
    
    const matchesCompleted = showCompleted || !todo.completed

    return matchesSearch && matchesTags && matchesCompleted
  })

  if (!list) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">List not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{list.name}</h1>
        <p className="text-muted-foreground">
          Manage your code review feedback and PR changes in one place.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </Button>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedTags(
                    selectedTags.includes(tag)
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag]
                  )
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      <AddTodoForm onSubmit={handleAddTodo} />
      
      <div className="space-y-4">
        {filteredTodos.map(todo => (
          <TodoItemCard
            key={todo.id}
            todo={todo}
            onComplete={handleCompleteTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {todos.length === 0
                ? "No todos yet. Add your first todo above!"
                : "No todos match your filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 