'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  MoreVertical,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User2,
} from 'lucide-react'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { format } from 'date-fns'

// Task status and priority types
type Status = 'not_started' | 'in_progress' | 'completed'
type Priority = 'low' | 'medium' | 'high'

// Task interface
interface Task {
  id: number
  title: string
  description: string
  codeSnippet?: string
  language?: string
  status: Status
  priority: Priority
  dueDate: Date
  estimatedTime?: string
  tags: string[]
  assignee?: string
}

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: Replace with real data from Supabase
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Implement Authentication',
      description: 'Set up user authentication using Supabase Auth',
      codeSnippet: 'const supabase = createClient()',
      language: 'typescript',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date('2024-03-20'),
      estimatedTime: '4 hours',
      tags: ['auth', 'security'],
      assignee: 'John Doe'
    },
    {
      id: 2,
      title: 'Create Dashboard UI',
      description: 'Design and implement the main dashboard interface',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date('2024-03-18'),
      tags: ['ui', 'frontend'],
      assignee: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Setup Database Schema',
      description: 'Define and implement the database schema for tasks',
      codeSnippet: 'CREATE TABLE tasks (...)',
      language: 'sql',
      status: 'not_started',
      priority: 'high',
      dueDate: new Date('2024-03-21'),
      estimatedTime: '6 hours',
      tags: ['database', 'backend'],
      assignee: 'Mike Johnson'
    }
  ]

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Status badge variants
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge variant="default" className="bg-yellow-500/20 text-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="bg-white/20 text-white">
            Not Started
          </Badge>
        )
    }
  }

  // Priority badge variants
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="default" className="bg-red-500/20 text-red-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            High
          </Badge>
        )
      case 'medium':
        return (
          <Badge variant="default" className="bg-yellow-500/20 text-yellow-500">
            Medium
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="bg-emerald-500/20 text-emerald-500">
            Low
          </Badge>
        )
    }
  }

  const handleCreateTask = async (data: any) => {
    // TODO: Implement task creation with Supabase
    console.log('Creating task:', data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-white/70">Manage and track your coding tasks</p>
        </div>
        <CreateTaskDialog onSubmit={handleCreateTask} />
      </div>

      <Card className="bg-white/5 border-white/10">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white/70">Task</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Priority</TableHead>
                <TableHead className="text-white/70">Due Date</TableHead>
                <TableHead className="text-white/70">Assignee</TableHead>
                <TableHead className="text-white/70">Tags</TableHead>
                <TableHead className="text-white/70 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{task.title}</div>
                      <div className="text-sm text-white/70">{task.description}</div>
                      {task.estimatedTime && (
                        <div className="text-xs text-white/50 mt-1">
                          Estimated: {task.estimatedTime}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-white/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(task.dueDate, 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.assignee && (
                      <div className="flex items-center text-white/70">
                        <User2 className="w-4 h-4 mr-2" />
                        {task.assignee}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-white/5 border-white/10 text-white/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="h-5 w-5 text-white/70" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/10 border-white/20"
                      >
                        <DropdownMenuItem className="text-white cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
} 