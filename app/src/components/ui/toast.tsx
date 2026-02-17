// BEFORE (The cause of error)
// import React from 'react';
// import { Check, AlertCircle, X } from 'lucide-react';

// AFTER (Corrected)
import { X } from 'lucide-react'; 
import { cn } from '@/lib/utils';

// ... rest of your code ...

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onDismiss?: () => void
}

export const Toast = ({ title, description, variant = "default", onDismiss }: ToastProps) => {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        variant === "default" && "border-gray-200 bg-white text-gray-950",
        variant === "destructive" && "destructive group border-red-500 bg-red-600 text-white",
        variant === "success" && "border-green-500 bg-green-600 text-white"
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && (
          <div className={cn("text-sm opacity-90", variant === "default" && "text-gray-500", variant !== "default" && "text-white")}>
            {description}
          </div>
        )}
      </div>
      
      <button
        onClick={onDismiss}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          variant === "default" ? "text-gray-500 hover:bg-gray-100" : "text-white/80 hover:bg-white/20 hover:text-white"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}