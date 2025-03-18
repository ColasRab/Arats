// Helper functions for scheduling and sending notifications
import { getQuoteForTimeOfDay, morningQuotes, noonQuotes, eveningQuotes, nightQuotes } from "./quotes"

export async function scheduleNotifications() {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications")
    return false
  }

  if (Notification.permission !== "granted") {
    console.error("Notification permission not granted")
    return false
  }

  try {
    // Schedule daily mood check-in notifications
    scheduleNotificationForTime(8, 0, "Good morning!", "How are you feeling this morning?", "/check-in")
    scheduleNotificationForTime(12, 0, "Midday check-in", "Take a moment to reflect on your mood", "/check-in")
    scheduleNotificationForTime(18, 0, "Evening check-in", "How has your day been so far?", "/check-in")
    scheduleNotificationForTime(22, 0, "Goodnight", "Reflect on your day before you rest", "/check-in")

    // Schedule inspirational quote notifications
    scheduleQuoteNotification(7, 0, "morning") // Morning quote at 7 AM
    scheduleQuoteNotification(12, 0, "noon") // Noon quote at 12 PM
    scheduleQuoteNotification(19, 0, "evening") // Evening quote at 7 PM
    scheduleQuoteNotification(0, 0, "night") // Night quote at midnight

    // Schedule weekly PHQ-5 assessment notification
    scheduleWeeklyAssessment()

    return true
  } catch (error) {
    console.error("Error scheduling notifications:", error)
    return false
  }
}

function scheduleQuoteNotification(hour: number, minute: number, timeOfDay: "morning" | "noon" | "evening" | "night") {
  const now = new Date()
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime()

  setTimeout(() => {
    // Get a quote appropriate for the time of day
    let quoteCollection
    let title

    switch (timeOfDay) {
      case "morning":
        quoteCollection = morningQuotes
        title = "Morning Inspiration"
        break
      case "noon":
        quoteCollection = noonQuotes
        title = "Midday Inspiration"
        break
      case "evening":
        quoteCollection = eveningQuotes
        title = "Evening Inspiration"
        break
      case "night":
        quoteCollection = nightQuotes
        title = "Night Inspiration"
        break
    }

    const quote = quoteCollection[Math.floor(Math.random() * quoteCollection.length)]

    // Send the notification with the quote
    sendNotification(title, quote, "/dashboard", "quote")

    // Reschedule for the next day
    scheduleQuoteNotification(hour, minute, timeOfDay)
  }, timeUntilNotification)
}

function scheduleNotificationForTime(hour: number, minute: number, title: string, body: string, url: string) {
  const now = new Date()
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime()

  setTimeout(() => {
    sendNotification(title, body, url)
    // Reschedule for the next day
    scheduleNotificationForTime(hour, minute, title, body, url)
  }, timeUntilNotification)
}

function scheduleWeeklyAssessment() {
  // Get the last assessment date from localStorage
  const lastAssessment = localStorage.getItem("lastPhq5Assessment")
  const now = new Date()

  let nextAssessmentDate: Date

  if (lastAssessment) {
    // If there was a previous assessment, schedule the next one for 7 days after
    const lastDate = new Date(lastAssessment)
    nextAssessmentDate = new Date(lastDate)
    nextAssessmentDate.setDate(lastDate.getDate() + 7)

    // If the calculated next date is in the past (user might have been away),
    // schedule it for tomorrow
    if (nextAssessmentDate < now) {
      nextAssessmentDate = new Date(now)
      nextAssessmentDate.setDate(now.getDate() + 1)
      nextAssessmentDate.setHours(10, 0, 0, 0) // Set to 10 AM
    }
  } else {
    // If this is the first time, schedule for next day at 10 AM
    nextAssessmentDate = new Date(now)
    nextAssessmentDate.setDate(now.getDate() + 1)
    nextAssessmentDate.setHours(10, 0, 0, 0) // Set to 10 AM
  }

  const timeUntilAssessment = nextAssessmentDate.getTime() - now.getTime()

  setTimeout(() => {
    sendNotification(
      "Weekly PHQ-5 Assessment",
      "It's time for your weekly mental health check-in. This helps us track your progress over time.",
      "/assessment",
      "assessment",
    )

    // Reschedule for next week
    scheduleWeeklyAssessment()
  }, timeUntilAssessment)
}

export async function sendNotification(
  title: string,
  body: string,
  url: string,
  type: "mood-check-in" | "assessment" | "quote" = "mood-check-in",
) {
  if (Notification.permission !== "granted") return

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready

      // Check if we can use the Push API
      if ("PushManager" in window) {
        // In a real app, you would send a push notification through your server
        // For this demo, we'll use the showNotification API
        await registration.showNotification(title, {
          body,
          icon: "/icon-192x192.png",
          badge: "/badge-96x96.png",
          data: { url, type },
          actions: [
            {
              action: "open",
              title: "Open App",
            },
          ],
          tag: type,
          renotify: true,
        })
      } else {
        // Fallback to regular notification
        new Notification(title, {
          body,
          icon: "/icon-192x192.png",
        })
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      // Fallback if service worker has an issue
      new Notification(title, {
        body,
        icon: "/icon-192x192.png",
      })
    }
  } else {
    // Fallback if service worker is not available
    new Notification(title, {
      body,
      icon: "/icon-192x192.png",
    })
  }
}

// Function to record when a PHQ-5 assessment is completed
export function recordPhq5Completion() {
  const now = new Date()
  localStorage.setItem("lastPhq5Assessment", now.toISOString())
}

// Fallback notification system when service worker isn't available
export function setupFallbackNotifications() {
  if (Notification.permission !== "granted") return

  // Set up simple interval-based notifications instead of precise time-based ones
  // This is less accurate but works without a service worker

  // Daily mood check-ins (simplified to every 6 hours)
  setInterval(
    () => {
      const hour = new Date().getHours()
      let title, body

      if (hour >= 5 && hour < 12) {
        title = "Morning Check-in"
        body = "How are you feeling this morning?"
      } else if (hour >= 12 && hour < 17) {
        title = "Afternoon Check-in"
        body = "How's your day going so far?"
      } else if (hour >= 17 && hour < 22) {
        title = "Evening Check-in"
        body = "Reflect on your day before it ends."
      } else {
        title = "Night Check-in"
        body = "How are you feeling before bed?"
      }

      new Notification(title, {
        body,
        icon: "/icon-192x192.png",
      })
    },
    6 * 60 * 60 * 1000,
  ) // Every 6 hours

  // Inspirational quotes (every 6 hours, offset by 3 hours from mood check-ins)
  setInterval(
    () => {
      const quote = getQuoteForTimeOfDay()
      const hour = new Date().getHours()
      let title

      if (hour >= 5 && hour < 12) {
        title = "Morning Inspiration"
      } else if (hour >= 12 && hour < 17) {
        title = "Midday Inspiration"
      } else if (hour >= 17 && hour < 22) {
        title = "Evening Inspiration"
      } else {
        title = "Night Inspiration"
      }

      new Notification(title, {
        body: quote,
        icon: "/icon-192x192.png",
      })
    },
    6 * 60 * 60 * 1000,
  ) // Every 6 hours

  // Weekly assessment reminder (check once a day)
  setInterval(
    () => {
      const lastAssessment = localStorage.getItem("lastPhq5Assessment")
      if (!lastAssessment) {
        // No assessment done yet
        new Notification("PHQ-5 Assessment Reminder", {
          body: "You haven't completed your first PHQ-5 assessment yet.",
          icon: "/icon-192x192.png",
        })
        return
      }

      const lastDate = new Date(lastAssessment)
      const now = new Date()
      const daysSinceAssessment = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceAssessment >= 7) {
        new Notification("Weekly PHQ-5 Assessment", {
          body: "It's time for your weekly mental health check-in.",
          icon: "/icon-192x192.png",
        })
      }
    },
    24 * 60 * 60 * 1000,
  ) // Check once a day
}

