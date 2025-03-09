"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BellRing, BellOff, Download, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { setupFallbackNotifications } from "@/lib/notifications"

export default function EnableNotificationsPage() {
  const router = useRouter()
  const [notificationStatus, setNotificationStatus] = useState<"pending" | "granted" | "denied" | "unsupported">(
    "pending",
  )
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<"pending" | "registered" | "failed">("pending")
  const [isLoading, setIsLoading] = useState(false)
  const [isPWA, setIsPWA] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPWA(true)
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true)
    })

    // Check if notifications are supported
    if (!("Notification" in window)) {
      setNotificationStatus("unsupported")
      return
    }

    // Check current notification permission
    if (Notification.permission === "granted") {
      setNotificationStatus("granted")
    } else if (Notification.permission === "denied") {
      setNotificationStatus("denied")
    }
  }, [])

  const requestNotificationPermission = async () => {
    setIsLoading(true)

    try {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications")
        setNotificationStatus("unsupported")
        return
      }

      const permission = await Notification.requestPermission()
      setNotificationStatus(permission as "granted" | "denied")

      if (permission === "granted") {
        // Try to register service worker
        await registerServiceWorker()

        // For demo purposes, show a test notification
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
      setIsLoading(false)
    }
  }

  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      setServiceWorkerStatus("failed")
      // Set up fallback notifications
      setupFallbackNotifications()
      return
    }

    try {
      // Use the API route to serve the service worker
      const registration = await navigator.serviceWorker.register("/api/moodtrack/service-worker")
      console.log("Service Worker registered with scope:", registration.scope)
      setServiceWorkerStatus("registered")

      // Schedule notifications
      setupFallbackNotifications()
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      setServiceWorkerStatus("failed")

      // Fallback to regular notifications without service worker
      setupFallbackNotifications()
    }
  }

  const installPWA = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)

    // If the user accepted, let's update our UI
    if (outcome === "accepted") {
      setIsPWA(true)
      setIsInstallable(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enable Notifications</CardTitle>
          <CardDescription>Get mood check-ins and inspirational quotes throughout your day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
            {notificationStatus === "pending" && <BellRing className="h-12 w-12 text-primary mb-4" />}
            {notificationStatus === "granted" && <BellRing className="h-12 w-12 text-green-500 mb-4" />}
            {notificationStatus === "denied" && <BellOff className="h-12 w-12 text-red-500 mb-4" />}
            {notificationStatus === "unsupported" && <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />}

            <h3 className="text-lg font-medium mb-2">Notifications Schedule</h3>
            <p className="text-center text-muted-foreground">We'll send you:</p>
            <ul className="mt-2 space-y-1 text-center">
              <li>Daily mood check-ins (8 AM, 12 PM, 6 PM, 10 PM)</li>
              <li>Weekly PHQ-5 assessment reminders</li>
              <li>Inspirational quotes (7 AM, 12 PM, 7 PM, 12 AM)</li>
            </ul>
          </div>

          {serviceWorkerStatus === "failed" && notificationStatus === "granted" && (
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Service Worker Issue</AlertTitle>
              <AlertDescription>
                We couldn't register the service worker, but notifications will still work with reduced functionality.
              </AlertDescription>
            </Alert>
          )}

          {!isPWA && isInstallable && (
            <div className="flex flex-col items-center justify-center p-6 bg-primary/10 rounded-md">
              <Download className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Install as App</h3>
              <p className="text-center text-muted-foreground mb-4">
                Install MoodTrack on your device for the best experience with notifications
              </p>
              <Button onClick={installPWA} variant="outline" className="w-full">
                Install App
              </Button>
            </div>
          )}

          {notificationStatus === "pending" && (
            <div className="bg-primary/10 p-4 rounded-md">
              <p className="text-sm">
                You'll be asked to allow notifications. This is required for mood check-ins and inspirational quotes to
                work properly.
              </p>
            </div>
          )}

          {notificationStatus === "granted" && (
            <div className="bg-green-100 p-4 rounded-md">
              <p className="text-sm text-green-800">Notifications enabled successfully! You'll now receive:</p>
              <ul className="mt-2 text-sm text-green-800 list-disc list-inside">
                <li>Daily mood check-ins</li>
                <li>Weekly PHQ-5 assessment reminders</li>
                <li>Inspirational quotes</li>
              </ul>
            </div>
          )}

          {notificationStatus === "denied" && (
            <div className="bg-red-100 p-4 rounded-md">
              <p className="text-sm text-red-800">
                Notifications were denied. You'll need to enable them in your browser settings to receive mood check-ins
                and inspirational quotes.
              </p>
              <p className="text-sm text-red-800 mt-2">Instructions:</p>
              <ul className="mt-1 text-sm text-red-800 list-disc list-inside">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find "Notifications" in the site settings</li>
                <li>Change the setting to "Allow"</li>
              </ul>
            </div>
          )}

          {notificationStatus === "unsupported" && (
            <div className="bg-amber-100 p-4 rounded-md">
              <p className="text-sm text-amber-800">
                Your browser doesn't support notifications. For the best experience, please use a modern browser like
                Chrome, Firefox, or Edge.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {notificationStatus === "pending" && (
            <Button onClick={requestNotificationPermission} className="w-full" disabled={isLoading}>
              {isLoading ? "Requesting..." : "Enable Notifications"}
            </Button>
          )}

          {(notificationStatus === "granted" ||
            notificationStatus === "denied" ||
            notificationStatus === "unsupported") && (
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

