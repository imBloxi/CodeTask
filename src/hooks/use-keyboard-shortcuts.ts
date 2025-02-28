"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useList } from "@/contexts/list-context"

export function useKeyboardShortcuts() {
  const router = useRouter()
  const { lists } = useList()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Cmd/Ctrl is pressed
      if (!(e.metaKey || e.ctrlKey)) return

      let index: number

      switch (e.key) {
        case "h":
          // Go home
          e.preventDefault()
          router.push("/")
          break
        case "k":
          // Search dialog is handled by SearchDialog component
          e.preventDefault()
          break
        case "n":
          // New list dialog is handled by NewListDialog component
          e.preventDefault()
          break
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          // Quick switch to list
          e.preventDefault()
          index = parseInt(e.key) - 1
          if (lists[index]) {
            router.push(`/list/${lists[index].id}`)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, lists])
} 