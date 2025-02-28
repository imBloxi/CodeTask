"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030711] px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Something went wrong!</h1>
        <p className="text-white/70">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => reset()}
            className="bg-white text-[#030711] hover:bg-white/90"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-white/20 bg-transparent hover:bg-white/5"
          >
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  )
} 