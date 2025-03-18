"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/context/app-context"

// Types for notifications
type NotificationType = "mood-check" | "quote" | "reminder" | "alert"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  action?: () => void
  actionLabel?: string
  timestamp: Date
  read: boolean
}

interface Quote {
  text: string
  author: string
  category: "inspiring" | "happy" | "enlightening"
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  showMoodCheck: boolean
  currentQuote: Quote | null
  showQuote: boolean
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissMoodCheck: () => void
  dismissQuote: () => void
  requestNotificationPermission: () => Promise<boolean>
  hasNotificationPermission: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Sample quotes database
const quotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "inspiring",
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "happy",
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "enlightening",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "enlightening",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    category: "inspiring",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "inspiring",
  },
  {
    text: "Happiness is not in the mere possession of money; it lies in the joy of achievement.",
    author: "Franklin D. Roosevelt",
    category: "happy",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "inspiring",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "inspiring",
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "enlightening",
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
    category: "happy",
  },
  {
    text: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: "Franklin D. Roosevelt",
    category: "inspiring",
  },
  {
    text: "Always remember that you are absolutely unique. Just like everyone else.",
    author: "Margaret Mead",
    category: "happy",
  },
  {
    text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    author: "Robert Louis Stevenson",
    category: "enlightening",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "inspiring",
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const { isAuthenticated } = useAppContext()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showMoodCheck, setShowMoodCheck] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [showQuote, setShowQuote] = useState(false)
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setHasNotificationPermission(true)
      }
    }
  }, [])

  // Schedule mood checks at random times when authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    // Function to schedule the next mood check
    const scheduleNextMoodCheck = () => {
      // Random time between 30 minutes and 3 hours
      const randomMinutes = Math.floor(Math.random() * (180 - 30 + 1) + 30)

      console.log(`Scheduled next mood check in ${randomMinutes} minutes`)

      return setTimeout(
        () => {
          // Show in-app notification
          setShowMoodCheck(true)

          // Add to notifications list
          addNotification({
            type: "mood-check",
            title: "Mood Check",
            message: "How are you feeling right now?",
            action: () => setShowMoodCheck(true),
            actionLabel: "Log Mood",
          })

          // Send browser notification if permission granted
          if (hasNotificationPermission) {
            const notification = new Notification("MindTrack Mood Check", {
              body: "How are you feeling right now?",
              icon: "/favicon.ico",
            })

            notification.onclick = () => {
              window.focus()
              setShowMoodCheck(true)
            }
          }

          // Schedule the next one
          scheduleNextMoodCheck()
        },
        randomMinutes * 60 * 1000,
      )
    }

    // Initial schedule
    const timeoutId = scheduleNextMoodCheck()

    // Clean up on unmount
    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, hasNotificationPermission])

  // Schedule quotes for morning, noon, and night
  useEffect(() => {
    if (!isAuthenticated) return

    // Function to get a random quote
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      return quotes[randomIndex]
    }

    // Function to show a quote
    const showQuoteNotification = (timeOfDay: string) => {
      const quote = getRandomQuote()
      setCurrentQuote(quote)
      setShowQuote(true)

      // Add to notifications
      addNotification({
        type: "quote",
        title: `${timeOfDay} Inspiration`,
        message: `"${quote.text}" - ${quote.author}`,
        action: () => {
          setCurrentQuote(quote)
          setShowQuote(true)
        },
        actionLabel: "View",
      })

      // Send browser notification if permission granted
      if (hasNotificationPermission) {
        const notification = new Notification(`MindTrack ${timeOfDay} Quote`, {
          body: `"${quote.text}" - ${quote.author}`,
          icon: "/favicon.ico",
        })

        notification.onclick = () => {
          window.focus()
          setCurrentQuote(quote)
          setShowQuote(true)
        }
      }
    }

    // Schedule quotes for morning (8 AM), noon (12 PM), and night (8 PM)
    const scheduleQuotes = () => {
      const now = new Date()
      const currentHour = now.getHours()

      // Calculate times for today
      const morning = new Date(now)
      morning.setHours(8, 0, 0, 0)

      const noon = new Date(now)
      noon.setHours(12, 0, 0, 0)

      const night = new Date(now)
      night.setHours(20, 0, 0, 0)

      // Schedule morning quote
      let morningDelay
      if (currentHour < 8) {
        morningDelay = morning.getTime() - now.getTime()
      } else {
        // Schedule for tomorrow
        morning.setDate(morning.getDate() + 1)
        morningDelay = morning.getTime() - now.getTime()
      }

      // Schedule noon quote
      let noonDelay
      if (currentHour < 12) {
        noonDelay = noon.getTime() - now.getTime()
      } else {
        // Schedule for tomorrow
        noon.setDate(noon.getDate() + 1)
        noonDelay = noon.getTime() - now.getTime()
      }

      // Schedule night quote
      let nightDelay
      if (currentHour < 20) {
        nightDelay = night.getTime() - now.getTime()
      } else {
        // Schedule for tomorrow
        night.setDate(night.getDate() + 1)
        nightDelay = night.getTime() - now.getTime()
      }

      // Set timeouts
      const morningTimeout = setTimeout(() => {
        showQuoteNotification("Morning")
        // Reschedule for next day
        setTimeout(() => scheduleQuotes(), 1000)
      }, morningDelay)

      const noonTimeout = setTimeout(() => {
        showQuoteNotification("Noon")
      }, noonDelay)

      const nightTimeout = setTimeout(() => {
        showQuoteNotification("Evening")
      }, nightDelay)

      // For demo purposes, also show a quote immediately
      setTimeout(() => {
        showQuoteNotification("Welcome")
      }, 5000)

      return [morningTimeout, noonTimeout, nightTimeout]
    }

    // Initial scheduling
    const timeouts = scheduleQuotes()

    // Clean up on unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [isAuthenticated, hasNotificationPermission])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const dismissMoodCheck = () => {
    setShowMoodCheck(false)
  }

  const dismissQuote = () => {
    setShowQuote(false)
  }

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      })
      return false
    }

    if (Notification.permission === "granted") {
      setHasNotificationPermission(true)
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setHasNotificationPermission(granted)

      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive mood check reminders and inspirational quotes",
        })
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive push notifications. You can enable them in your browser settings.",
        })
      }

      return granted
    }

    toast({
      title: "Notifications blocked",
      description: "Please enable notifications in your browser settings",
      variant: "destructive",
    })

    return false
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showMoodCheck,
        currentQuote,
        showQuote,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissMoodCheck,
        dismissQuote,
        requestNotificationPermission,
        hasNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

