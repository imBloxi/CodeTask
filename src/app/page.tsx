"use client"

import * as React from "react"
import { TodoList } from "@/components/todo-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  Code2, 
  Github, 
  Keyboard, 
  LayoutDashboard, 
  Sparkles, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Database,
  Infinity,
  Laptop
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Code2,
    title: "Code-First Approach",
    description: "Built for developers with syntax highlighting, code snippets, and Git integration.",
    gradient: "from-[#FF5A5A] to-[#FF9B9B]"
  },
  {
    icon: Database,
    title: "Reliable Storage",
    description: "Choose between local storage or Supabase for secure data persistence.",
    gradient: "from-[#5B8DEF] to-[#9DBFF9]"
  },
  {
    icon: Keyboard,
    title: "Keyboard Driven",
    description: "Lightning-fast keyboard shortcuts for efficient task management.",
    gradient: "from-[#13B8A5] to-[#5EEEDD]"
  }
] as const

const techStack = [
  { name: "Next.js 14", icon: Infinity },
  { name: "TypeScript", icon: Code2 },
  { name: "Tailwind CSS", icon: Laptop },
  { name: "Shadcn UI", icon: LayoutDashboard },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 px-4 pt-20 md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className={cn(
                "inline-flex items-center rounded-md px-4 py-1.5 mb-4",
                "bg-secondary text-secondary-foreground"
              )}>
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium">Now in Public Beta</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <h1 className="bg-gradient-to-br from-white to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
                Modern Task Management
                <br />
                for Developers
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                A powerful task management system built with modern web technologies.
                Designed for developers who love clean interfaces and efficient workflows.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="h-12 px-6 gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-6 gap-2"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </Button>
            </motion.div>
          </div>

          {/* Tech Stack */}
          <div className="mt-20 flex justify-center">
            <Card className="relative overflow-hidden border-none bg-gradient-to-b from-background/10 to-background/80 p-2">
              <div className="flex items-center gap-4 px-4">
                {techStack.map((tech, i) => (
                  <React.Fragment key={tech.name}>
                    <div className="flex items-center gap-2 py-2">
                      <tech.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {tech.name}
                      </span>
                    </div>
                    {i < techStack.length - 1 && (
                      <Separator orientation="vertical" className="h-6" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Gradient Blur Effect */}
        <div className="absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
          <div className="absolute h-[50rem] w-[50rem] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[100px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="group relative overflow-hidden border-none bg-gradient-to-b from-background/10 to-background/80 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10 ${feature.gradient}`} />
              <div className="p-6">
                <feature.icon className="h-10 w-10 text-white mb-4" />
                <h3 className="mb-2 font-semibold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 bg-gradient-to-b from-background/50 to-background px-4 py-20 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Card className="overflow-hidden border-none bg-gradient-to-b from-background/10 to-background/80 p-6">
            <ScrollArea className="h-[600px] rounded-md">
              <TodoList />
            </ScrollArea>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join our growing community of developers and start managing your tasks more efficiently.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-6 gap-2">
              <Zap className="h-4 w-4" />
              Start for Free
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-6 gap-2">
              <Terminal className="h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
