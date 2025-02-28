import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-8">Documentation</h1>

      <div className="space-y-12">
        {/* Installation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Prerequisites</h3>
            <ul className="list-disc list-inside mb-6 text-muted-foreground">
              <li>Node.js 18.17.0 or later</li>
              <li>pnpm 8.0.0 or later</li>
            </ul>

            <h3 className="font-semibold mb-4">Setup Steps</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4">
              <code>{`# Clone the repository
git clone https://github.com/imBloxi/CodeTask.git

# Navigate to project directory
cd CodeTask

# Install dependencies
pnpm install

# Start development server
pnpm dev`}</code>
            </pre>
          </Card>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Task Management</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Create, edit, and delete tasks</li>
                <li>Set priority levels</li>
                <li>Add due dates</li>
                <li>Categorize tasks</li>
                <li>Add code snippets</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">UI Features</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Dark/Light theme</li>
                <li>Responsive design</li>
                <li>Keyboard shortcuts</li>
                <li>Drag and drop (coming soon)</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Database Setup */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Database Setup (Optional)</h2>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              By default, CodeTask uses local storage for data persistence. For a more robust solution,
              you can set up a database connection.
            </p>

            <h3 className="font-semibold mb-2">Supported Databases</h3>
            <ul className="list-disc list-inside mb-6 text-muted-foreground">
              <li>SQLite (Default)</li>
              <li>PostgreSQL</li>
              <li>MySQL</li>
            </ul>

            <h3 className="font-semibold mb-2">Configuration Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Copy .env.example to .env</li>
              <li>Update database credentials in .env</li>
              <li>Install database dependencies:
                <pre className="bg-muted p-2 rounded-lg text-sm mt-2">
                  <code>pnpm add @prisma/client prisma</code>
                </pre>
              </li>
              <li>Run database migrations:
                <pre className="bg-muted p-2 rounded-lg text-sm mt-2">
                  <code>pnpm prisma migrate dev</code>
                </pre>
              </li>
            </ol>
          </Card>
        </section>

        {/* API Reference */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              CodeTask provides a simple API for managing tasks programmatically.
            </p>

            <h3 className="font-semibold mb-2">Endpoints</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`GET /api/tasks          # List all tasks
POST /api/tasks         # Create a new task
GET /api/tasks/:id      # Get task details
PUT /api/tasks/:id      # Update a task
DELETE /api/tasks/:id   # Delete a task`}</code>
            </pre>
          </Card>
        </section>

        {/* Contributing */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contributing</h2>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              We welcome contributions! Please read our contributing guidelines before submitting a PR.
            </p>

            <Button asChild variant="outline">
              <a
                href="https://github.com/imBloxi/CodeTask/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Contributing Guidelines
              </a>
            </Button>
          </Card>
        </section>
      </div>
    </main>
  )
} 