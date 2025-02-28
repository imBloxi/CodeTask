'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Code2, Calendar, Tags, ArrowDown, Minus, ArrowUp, Check, Loader2 } from 'lucide-react'
import CodeEditor from '@uiw/react-textarea-code-editor'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'

const steps = [
  { id: 'basics', icon: FileText, label: 'Basic Info' },
  { id: 'technical', icon: Code2, label: 'Technical' },
  { id: 'planning', icon: Calendar, label: 'Planning' },
  { id: 'organization', icon: Tags, label: 'Organization' }
] as const

const priorities = [
  { value: 'low', label: 'Low', color: 'emerald', icon: ArrowDown },
  { value: 'medium', label: 'Medium', color: 'yellow', icon: Minus },
  { value: 'high', label: 'High', color: 'rose', icon: ArrowUp }
] as const

const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'sql', label: 'SQL' },
] as const

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  codeSnippet: z.string().optional(),
  language: z.string(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  dueDate: z.date(),
  estimatedTime: z.string().optional(),
  tags: z.array(z.string()),
  assignee: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface CreateTaskDialogProps {
  trigger?: React.ReactNode
  onSubmit: (data: TaskFormValues) => Promise<void>
}

export function CreateTaskDialog({ trigger, onSubmit }: CreateTaskDialogProps) {
  const [step, setStep] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      codeSnippet: '',
      language: 'typescript',
      status: 'not_started',
      dueDate: new Date(),
      estimatedTime: '',
      tags: [],
      assignee: '',
    },
  })

  const onSubmitForm = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      toast.success('Task created successfully')
      setOpen(false)
      form.reset()
      setStep(0)
    } catch (error) {
      toast.error('Failed to create task')
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    const currentFields = Object.keys(form.formState.errors)
    const stepFieldsMap = {
      0: ['title', 'description', 'priority'],
      1: ['codeSnippet', 'language'],
      2: ['status', 'dueDate', 'estimatedTime'],
      3: ['tags', 'assignee'],
    } as const

    const stepFields = stepFieldsMap[step as keyof typeof stepFieldsMap]
    if (!stepFields) return

    const hasErrors = currentFields.some(field => stepFields.includes(field))
    if (hasErrors) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (step < steps.length - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleAddTag = () => {
    const value = tagInput.trim()
    if (value && !form.getValues('tags').includes(value)) {
      form.setValue('tags', [...form.getValues('tags'), value])
      setTagInput('')
    }
  }

  const slideAnimation = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.2 }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 
                     transition-all duration-300 ease-out hover:scale-105"
          >
            Create Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 
                               border-white/10 shadow-xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription className="text-white/70">
            Add a new task to your project. Fill out the information step by step.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between px-2 py-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div 
                className="flex items-center cursor-pointer group"
                onClick={() => i < step && setStep(i)}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    i === step
                      ? "bg-primary text-primary-foreground scale-110"
                      : i < step
                      ? "bg-primary/20 text-primary group-hover:bg-primary/40"
                      : "bg-white/10 text-white/40"
                  )}
                >
                  {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium transition-colors duration-300",
                  i === step
                    ? "text-white"
                    : i < step
                    ? "text-primary/70 group-hover:text-primary"
                    : "text-white/40"
                )}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[2px] mx-2 transition-all duration-300",
                    i < step ? "bg-primary/50" : "bg-white/10"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                {...slideAnimation}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter task title"
                              className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your task"
                              className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[100px] transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <div className="flex gap-2">
                            {priorities.map((priority) => (
                              <Button
                                key={priority.value}
                                type="button"
                                variant={field.value === priority.value ? "default" : "outline"}
                                className={cn(
                                  "flex-1 transition-all duration-300",
                                  field.value === priority.value 
                                    ? `bg-${priority.color}-500/20 text-${priority.color}-500 scale-105`
                                    : "hover:bg-white/10"
                                )}
                                onClick={() => field.onChange(priority.value)}
                              >
                                <priority.icon className="w-4 h-4 mr-2" />
                                {priority.label}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Programming Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map(lang => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="codeSnippet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code Snippet</FormLabel>
                          <FormControl>
                            <div className="rounded-md overflow-hidden border border-white/10">
                              <CodeEditor
                                value={field.value}
                                language={form.getValues('language')}
                                placeholder="Enter your code here..."
                                onChange={(evn) => field.onChange(evn.target.value)}
                                padding={15}
                                style={{
                                  fontSize: 12,
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
                                  minHeight: '200px',
                                }}
                                data-color-mode="dark"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-white/5 border-white/10 transition-colors",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2 hours"
                              className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add tags"
                                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      handleAddTag()
                                    }
                                  }}
                                />
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={handleAddTag}
                                  className="bg-white/5 border-white/10 hover:bg-white/10"
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((tag, index) => (
                                  <Button
                                    key={index}
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/10 hover:bg-white/20 transition-colors group"
                                    onClick={() => {
                                      field.onChange(field.value.filter((_, i) => i !== index))
                                    }}
                                  >
                                    {tag}
                                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter assignee name"
                              className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                Previous
              </Button>
              {step === steps.length - 1 ? (
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90
                           transition-all duration-300 ease-out hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90
                           transition-all duration-300 ease-out hover:scale-105"
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 