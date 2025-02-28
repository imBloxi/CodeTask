import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030711]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
        <p className="text-sm text-white/70">Loading...</p>
      </div>
    </div>
  )
} 