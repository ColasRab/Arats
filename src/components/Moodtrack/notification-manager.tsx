"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function NotificationManager() {
  const [showDialog, setShowDialog] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<"pending" | "granted" | "denied" | "unsupported">(
    "pending",
  )
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<"pending" | "registered" | "failed">("pending")

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      setNotificationStatus("unsupported")
      return
    }

    // Check current notification permission
    if (Notification.permission === "granted") {
      setNotificationStatus("granted")
      registerServiceWorker()
    } else if (Notification.permission === "denied") {
      setNotificationStatus("denied")
    } else {
      // Show dialog after a short delay to allow the page to load
      setTimeout(() => setShowDialog(true), 2000)
    }
  }, [])

  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      setServiceWorkerStatus("failed")
      return
    }

    try {
      // Use the API route to serve the service worker with the correct MIME type
      const registration = await navigator.serviceWorker.register("/api/service-worker")
      console.log("Service Worker registered with scope:", registration.scope)
      setServiceWorkerStatus("registered")

      // Schedule notifications
      scheduleNotifications()
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      setServiceWorkerStatus("failed")

      // Fallback: Try to use regular notifications without service worker
      if (notificationStatus === "granted") {
        scheduleNotificationsWithoutServiceWorker()
      }
    }
  }

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission as "granted" | "denied")

      if (permission === "granted") {
        registerServiceWorker()

        // Show a test notification
        setTimeout(() => {
          new Notification("MoodTrack", {
            body: "Notifications enabled successfully!",
            icon: "/icon-192x192.png",
          })
        }, 1000)
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      setNotificationStatus("denied")
    } finally {
      setShowDialog(false)
    }
  }

  const scheduleNotifications = () => {
    // This would normally schedule push notifications via the service worker
    console.log("Scheduling notifications via service worker")

    // For demo purposes, we'll just schedule a test notification for 10 seconds later
    setTimeout(() => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SCHEDULE_NOTIFICATION",
          payload: {
            title: "MoodTrack",
            body: "Time for your mood check-in!",
            url: "/check-in",
            type: "mood-check-in",
          },
        })
      }
    }, 10000)
  }

  const scheduleNotificationsWithoutServiceWorker = () => {
    // Fallback for when service worker registration fails
    console.log("Scheduling notifications without service worker")

    // For demo purposes, we'll just schedule a test notification for 10 seconds later
    setTimeout(() => {
      new Notification("MoodTrack", {
        body: "Time for your mood check-in!",
        icon: "/icon-192x192.png",
      })
    }, 10000)
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications</DialogTitle>
            <DialogDescription>
              MoodTrack would like to send you notifications for mood check-ins, weekly PHQ-5 assessments, and
              inspirational quotes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>You'll receive:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Daily mood check-ins (8 AM, 12 PM, 6 PM, 10 PM)</li>
              <li>Weekly PHQ-5 assessment reminders</li>
              <li>Inspirational quotes (7 AM, 12 PM, 7 PM, 12 AM)</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Not Now
            </Button>
            <Button onClick={requestNotificationPermission}>Allow Notifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

