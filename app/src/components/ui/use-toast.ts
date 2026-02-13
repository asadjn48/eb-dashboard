/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000 // 5 seconds

type ToastType = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Global State
let memoryState: { toasts: ToastType[] } = { toasts: [] }
const listeners: Array<(state: typeof memoryState) => void> = []

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const dispatch = (action: any) => {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = {
        ...memoryState,
        toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
      }
      break
    case "UPDATE_TOAST":
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
      break
    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        memoryState.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }
      break
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        memoryState = {
          ...memoryState,
          toasts: [],
        }
      } else {
        memoryState = {
          ...memoryState,
          toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
        }
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ ...props }: Omit<ToastType, "id">) {
  const id = genId()

  const update = (props: ToastType) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })
  
  // Auto dismiss
  addToRemoveQueue(id)

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }