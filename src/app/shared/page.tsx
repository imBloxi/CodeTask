"use client"

import { useSearchParams } from "next/navigation"
import { useList } from "@/contexts/list-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SharedListPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { importList } = useList()
  
  const data = searchParams.get("data")

  const handleImport = () => {
    if (!data) return
    try {
      const decodedData = atob(data)
      importList(decodedData)
      router.push("/")
    } catch (error) {
      console.error("Failed to import shared list:", error)
    }
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invalid share link</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Import Shared List</h1>
      <p className="text-muted-foreground mb-6">
        Someone has shared a todo list with you. Would you like to import it?
      </p>
      <div className="flex gap-4">
        <Button onClick={handleImport}>Import List</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Cancel
        </Button>
      </div>
    </div>
  )
} 