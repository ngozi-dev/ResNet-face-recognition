'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Notification, NotificationProps } from '../components/ui/notification'

type NotificationContextType = {
  showNotification: (props: Omit<NotificationProps, 'onClose'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const showNotification = useCallback((props: Omit<NotificationProps, 'onClose'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...props, id }])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id!)}
        />
      ))}
    </NotificationContext.Provider>
  )
}

