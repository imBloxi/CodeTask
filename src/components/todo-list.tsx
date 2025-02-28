"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2, Calendar, Search, FolderIcon, AlertCircle, Plus, User, Github, Code, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { TodoItem, Category, Priority } from "@/types/todo"

const CATEGORIES: Category[] = [
  "Frontend",
  "Backend",
  "Bug Fix",
  "Feature",
  "Documentation",
  "Testing",
  "DevOps",
  "Other"
]

const PRIORITIES: Record<Priority, { label: string; color: string; icon: string }> = {
  low: { label: "Low", color: "bg-blue-500", icon: "minus" },
  medium: { label: "Medium", color: "bg-yellow-500", icon: "equal" },
  high: { label: "High", color: "bg-red-500", icon: "alert-triangle" }
}

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby"
] as const

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium")
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [codeSnippet, setCodeSnippet] = useState<{ language: string; code: string } | undefined>()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [assignee, setAssignee] = useState<string>("")
  const [githubIssue, setGithubIssue] = useState<string>("")

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || todo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const completedTodos = filteredTodos.filter((todo) => todo.completed).length
  const totalTodos = filteredTodos.length
  const progress = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        description: "",
        completed: false,
        priority: selectedPriority,
        category: selectedCategory === "All" ? "Other" : selectedCategory,
        createdAt: new Date().toISOString(),
        tags: selectedTags,
        ...(selectedDate && { dueDate: selectedDate }),
        ...(assignee && { assignee }),
        ...(githubIssue && { githubIssue: githubIssue.trim() }),
        ...(codeSnippet && { codeSnippet })
      }
      setTodos([newTodoItem, ...todos])
      setNewTodo("")
      setIsAddingTodo(false)
      setSelectedDate("")
      setCodeSnippet(undefined)
      setSelectedTags([])
      setAssignee("")
      setGithubIssue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "Enter":
          handleAddTodo()
          break
        case "k":
          e.preventDefault()
          setSearchTerm("")
          break
        default:
          break
      }
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchTerm("")
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Code Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage your development tasks efficiently
          </p>
        </div>
        <Dialog open={isAddingTodo} onOpenChange={setIsAddingTodo}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task">Task Description</Label>
                <Input
                  id="task"
                  placeholder="What needs to be done?"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value: Category | "All") => setSelectedCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={selectedPriority}
                    onValueChange={(value: Priority) => setSelectedPriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITIES).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Code Snippet</Label>
                <Select
                  value={codeSnippet?.language || "_none"}
                  onValueChange={(language) =>
                    setCodeSnippet(language === "_none" ? undefined : { language, code: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">None</SelectItem>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {codeSnippet && (
                  <Textarea
                    placeholder="Paste your code here"
                    value={codeSnippet.code}
                    onChange={(e) =>
                      setCodeSnippet({ ...codeSnippet, code: e.target.value })
                    }
                    className="font-mono"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Assignee</Label>
                  <Input
                    placeholder="Enter assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>GitHub Issue</Label>
                <Input
                  placeholder="Issue URL or number"
                  value={githubIssue}
                  onChange={(e) => setGithubIssue(e.target.value)}
                />
              </div>
              <Button onClick={handleAddTodo} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks... (Ctrl+K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select 
          value={selectedCategory} 
          onValueChange={(value: Category | "All") => setSelectedCategory(value)}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Progress value={progress} className="w-[200px]" />
              <span className="text-sm text-muted-foreground">
                {completedTodos} of {totalTodos} tasks completed
              </span>
            </div>
          </div>
          <Select value={selectedPriority} onValueChange={(value: Priority) => setSelectedPriority(value)}>
            <SelectTrigger className="max-w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITIES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              className={cn(
                "p-4 transition-all duration-200 hover:shadow-md",
                todo.completed && "opacity-75"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <Label
                      htmlFor={`todo-${todo.id}`}
                      className={cn(
                        "text-base",
                        todo.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        <FolderIcon className="mr-1 h-3 w-3" />
                        {todo.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn("text-white", PRIORITIES[todo.priority].color)}
                      >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        {PRIORITIES[todo.priority].label}
                      </Badge>
                      {todo.dueDate && (
                        <Badge variant="outline" className="text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(todo.dueDate, "MMM d")}
                        </Badge>
                      )}
                      {todo.assignee && (
                        <Badge variant="outline">
                          <User className="mr-1 h-3 w-3" />
                          {todo.assignee}
                        </Badge>
                      )}
                      {todo.githubIssue && (
                        <Badge variant="outline">
                          <a
                            href={todo.githubIssue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary flex items-center"
                          >
                            <Github className="mr-1 h-3 w-3" />
                            Issue
                          </a>
                        </Badge>
                      )}
                    </div>
                    {todo.codeSnippet && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            <Code className="mr-1 h-3 w-3" />
                            {todo.codeSnippet.language}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (todo.codeSnippet?.code) {
                                navigator.clipboard.writeText(todo.codeSnippet.code)
                              }
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                          <code>{todo.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 