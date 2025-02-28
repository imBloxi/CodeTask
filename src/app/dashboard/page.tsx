'use client'

import { Card } from '@/components/ui/card'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  // TODO: Replace with real data from Supabase
  const stats = [
    {
      label: 'Total Tasks',
      value: '12',
      icon: ListTodo,
      color: 'text-blue-500'
    },
    {
      label: 'In Progress',
      value: '4',
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      label: 'Completed',
      value: '6',
      icon: CheckCircle2,
      color: 'text-green-500'
    },
    {
      label: 'High Priority',
      value: '2',
      icon: AlertCircle,
      color: 'text-red-500'
    }
  ]

  const recentTasks = [
    {
      id: 1,
      title: 'Implement Authentication',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-03-20'
    },
    {
      id: 2,
      title: 'Create Dashboard UI',
      status: 'Completed',
      priority: 'Medium',
      dueDate: '2024-03-18'
    },
    {
      id: 3,
      title: 'Setup Database Schema',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-03-21'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome back! Here's an overview of your tasks.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="p-6 bg-white/5 border-white/10 hover:bg-white/[0.075] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className={`${stat.color} h-8 w-8 opacity-75`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
          <Link href="/dashboard/tasks">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white"
            >
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {recentTasks.map((task) => (
            <Card
              key={task.id}
              className="p-4 bg-white/5 border-white/10 hover:bg-white/[0.075] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-white/70">
                      Status: {task.status}
                    </span>
                    <span className="text-sm text-white/70">
                      Priority: {task.priority}
                    </span>
                    <span className="text-sm text-white/70">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 