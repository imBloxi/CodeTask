"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { TodoItem } from "@/types/todo"

interface TodoList {
  id: string
  name: string
  createdAt: string
  order: number
}

interface ListContextType {
  lists: TodoList[]
  createList: (name: string) => void
  updateList: (id: string, name: string) => void
  deleteList: (id: string) => void
  reorderList: (id: string, newOrder: number) => void
  getTodosForList: (listId: string) => TodoItem[]
  getListStats: (listId: string) => {
    total: number
    completed: number
    tags: { [key: string]: number }
  }
  exportList: (listId: string) => string
  importList: (data: string) => void
  getShareableLink: (listId: string) => string
}

const ListContext = createContext<ListContextType | undefined>(undefined)

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<TodoList[]>([])

  useEffect(() => {
    const savedLists = localStorage.getItem("todoLists")
    if (savedLists) {
      setLists(JSON.parse(savedLists))
    }
  }, [])

  const saveLists = (newLists: TodoList[]) => {
    setLists(newLists)
    localStorage.setItem("todoLists", JSON.stringify(newLists))
  }

  const createList = (name: string) => {
    const newList: TodoList = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      order: lists.length
    }
    saveLists([...lists, newList])
  }

  const updateList = (id: string, name: string) => {
    saveLists(lists.map(list => 
      list.id === id ? { ...list, name } : list
    ))
  }

  const deleteList = (id: string) => {
    localStorage.removeItem(`todos_${id}`)
    saveLists(lists.filter(list => list.id !== id))
  }

  const reorderList = (id: string, newOrder: number) => {
    const targetList = lists.find(l => l.id === id)
    if (!targetList) return

    const reorderedLists = lists
      .map(list => ({
        ...list,
        order: list.id === id 
          ? newOrder 
          : list.order >= newOrder && list.order < targetList.order
          ? list.order + 1
          : list.order <= newOrder && list.order > targetList.order
          ? list.order - 1
          : list.order
      }))
      .sort((a, b) => a.order - b.order)
    
    saveLists(reorderedLists)
  }

  const getTodosForList = (listId: string): TodoItem[] => {
    const savedTodos = localStorage.getItem(`todos_${listId}`)
    return savedTodos ? JSON.parse(savedTodos) : []
  }

  const getListStats = (listId: string) => {
    const todos = getTodosForList(listId)
    const tags: { [key: string]: number } = {}
    
    todos.forEach(todo => {
      todo.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1
      })
    })

    return {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      tags
    }
  }

  const exportList = (listId: string) => {
    const list = lists.find(l => l.id === listId)
    const todos = getTodosForList(listId)
    return JSON.stringify({ list, todos })
  }

  const importList = (data: string) => {
    try {
      const { list, todos } = JSON.parse(data)
      const newList = {
        ...list,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        order: lists.length
      }
      saveLists([...lists, newList])
      localStorage.setItem(`todos_${newList.id}`, JSON.stringify(todos))
    } catch (error) {
      console.error("Failed to import list:", error)
    }
  }

  const getShareableLink = (listId: string) => {
    const data = exportList(listId)
    return `${window.location.origin}/shared?data=${btoa(data)}`
  }

  return (
    <ListContext.Provider value={{
      lists,
      createList,
      updateList,
      deleteList,
      reorderList,
      getTodosForList,
      getListStats,
      exportList,
      importList,
      getShareableLink
    }}>
      {children}
    </ListContext.Provider>
  )
}

export function useList() {
  const context = useContext(ListContext)
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider")
  }
  return context
} 