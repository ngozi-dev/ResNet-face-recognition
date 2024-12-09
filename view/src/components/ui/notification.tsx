'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const notificationVariants = cva(
  "fixed z-50 flex items-center justify-between p-4 mb-4 rounded-lg shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
      },
      position: {
        topRight: "top-4 right-4",
        topLeft: "top-4 left-4",
        bottomRight: "bottom-4 right-4",
        bottomLeft: "bottom-4 left-4",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "topRight",
    },
  }
)

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  message: string
  duration?: number
  onClose?: () => void
}

export function Notification({
  className,
  variant,
  position,
  message,
  duration = 5000,
  onClose,
  ...props
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(notificationVariants({ variant, position, className }))}
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          {...(props as any)}
        >
          <span>{message}</span>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose && onClose()
            }}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

