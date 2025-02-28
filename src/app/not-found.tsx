import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t find the page you&apos;re looking for. Please check the URL or return home.
        </p>
        <div className="pt-4">
          <Button 
            asChild
            size="lg"
            className="gap-2 transition-all hover:gap-3"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}