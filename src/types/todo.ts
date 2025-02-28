export interface CodeSnippet {
  code: string
  language: string
  fileName?: string
  lineNumbers?: {
    start: number
    end: number
  }
}

export type Category = "Frontend" | "Backend" | "Bug Fix" | "Feature" | "Documentation" | "Testing" | "DevOps" | "Other"
export type Priority = "low" | "medium" | "high"

export interface TodoItem {
  id: string
  title: string
  description: string
  tags: string[]
  completed: boolean
  createdAt: string
  priority: Priority
  category: Category
  codeSnippet?: CodeSnippet
  dueDate?: string
  assignee?: string
  githubIssue?: string
} 