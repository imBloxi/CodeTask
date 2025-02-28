"use client"

import { TodoList } from "@/components/todo-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HeroPattern } from "@/components/ui/hero-pattern"
import { 
  Code, 
  Github, 
  Keyboard, 
  Layout, 
  Moon, 
  Palette, 
  Server, 
  Sparkles, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Copy,
  Command
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Code,
    title: "Code Snippets",
    description: "Add and format code examples directly in your tasks with syntax highlighting and copy functionality.",
    ariaLabel: "Code snippets feature"
  },
  {
    icon: Server,
    title: "Data Persistence",
    description: "Choose between local storage or database integration for reliable data persistence.",
    ariaLabel: "Data persistence feature"
  },
  {
    icon: Keyboard,
    title: "Keyboard First",
    description: "Optimized for keyboard navigation with intuitive shortcuts for faster task management.",
    ariaLabel: "Keyboard navigation feature"
  }
] as const

const benefits = [
  "Modern React with TypeScript",
  "Next.js 14 App Router",
  "Tailwind CSS for styling",
  "Shadcn UI components",
  "Dark mode support",
  "Responsive design"
] as const

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030711]">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-[#030711] py-32 lg:py-36 group"
        aria-label="Hero section"
      >
        <HeroPattern />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <Badge 
                variant="outline" 
                className="mb-4 px-4 py-2 gradient-border inline-flex items-center gap-2"
                aria-label="Version badge"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                <span className="text-sm font-medium">v0.1.0 - Beta Release</span>
                <Command className="h-3 w-3 text-white/70" />
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-x-20 -top-20 -bottom-20 mask-radial-faded">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 [mask-image:radial-gradient(circle_at_center,white,transparent_75%)]"
                />
              </div>
              <h1 className="relative text-gradient mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Task Management System
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 max-w-2xl text-lg text-white/70 sm:text-xl"
            >
              A modern, developer-focused task management system with code snippet support, 
              built with Next.js 14, TypeScript, and Shadcn UI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button 
                asChild 
                variant="default" 
                size="lg" 
                className="group relative overflow-hidden bg-white text-[#030711] hover:bg-white/90 transition-all duration-300"
              >
                <a href="#get-started" className="inline-flex items-center">
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="group gap-2 border-white/20 bg-transparent hover:bg-white/5 transition-all duration-300"
              >
                <a 
                  href="https://github.com/yourusername/task-management-system" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span>Star on GitHub</span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white transition-colors group-hover:bg-white/20">
                    Beta
                  </span>
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        className="border-t border-white/5 bg-[#030711]/50 py-20"
        aria-label="Benefits section"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Built for developers,
                  <br />
                  designed for productivity
                </h2>
                <p className="mt-4 text-lg text-white/70">
                  Our task management system combines the best of modern web development with intuitive task management.
                </p>
              </div>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features with Enhanced Cards */}
      <section 
        className="py-20"
        aria-label="Features section"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-12">
            Everything you need for better task management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden p-6 bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 hover-card-gradient opacity-0 transition-opacity group-hover:opacity-100" 
                  aria-hidden="true"
                />
                <div className="relative">
                  <div 
                    className="mb-4 rounded-full w-12 h-12 bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
                    aria-hidden="true"
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section 
        className="relative overflow-hidden bg-[#030711]/50 py-20"
        aria-label="Demo section"
      >
        <div className="absolute inset-0 bg-grid opacity-10" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                Try it out
              </h2>
              <p className="text-lg text-white/70">
                Experience the power of our task management system with our interactive demo
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#030711]/80 p-8 shadow-lg backdrop-blur-sm">
              <TodoList />
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section 
        className="py-20" 
        id="features"
        aria-label="Detailed features section"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-12">
              Powerful features, simple interface
            </h2>
            <Tabs defaultValue="ui" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="ui" className="gap-2 data-[state=active]:bg-white/10">
                  <Layout className="h-4 w-4" aria-hidden="true" />
                  UI & Design
                </TabsTrigger>
                <TabsTrigger value="dev" className="gap-2 data-[state=active]:bg-white/10">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Developer Tools
                </TabsTrigger>
                <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-white/10">
                  <Server className="h-4 w-4" aria-hidden="true" />
                  Data Management
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ui" className="mt-6 space-y-4">
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Layout className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-white">Modern Interface</h3>
                      <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                        <li>Responsive design that works on all devices</li>
                        <li>Beautiful animations and transitions</li>
                        <li>Customizable themes and colors</li>
                        <li>Intuitive task organization</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="dev" className="mt-6 space-y-4">
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Terminal className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-white">Developer Experience</h3>
                      <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                        <li>Syntax highlighting for code snippets</li>
                        <li>Git-style task branching</li>
                        <li>PR and issue linking</li>
                        <li>API integration support</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="data" className="mt-6 space-y-4">
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Server className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-white">Data Management</h3>
                      <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                        <li>Local storage for offline use</li>
                        <li>Optional database integration</li>
                        <li>Data export and import</li>
                        <li>Automatic backups</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-20"
        aria-label="Call to action section"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join our community of developers and start managing your tasks more efficiently.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="group gap-2 bg-white text-[#030711] hover:bg-white/90 transition-all duration-300"
              >
                <a href="/docs" className="inline-flex items-center">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="gap-2 border-white/20 bg-transparent hover:bg-white/5 transition-all duration-300"
              >
                <a 
                  href="https://github.com/yourusername/task-management-system/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Join Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
