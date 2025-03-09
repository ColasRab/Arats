"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/Moodtrack/theme-toggle"

interface MobileHeaderProps {
  title?: string
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Don't show back button on home page
  const showBackButton = pathname !== "/moodtrack"

  // Determine page title based on current path if not provided
  const pageTitle = title || getPageTitle(pathname)

  // Function to handle navigation and close the menu
  const handleNavigation = (href: string) => {
    setOpen(false) // Close the sheet
    router.push(href) // Navigate to the link
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-background border-b h-14 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-1" aria-label="Go back">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-semibold text-lg">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>MoodTrack</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={() => handleNavigation("/moodtrack")}
                  className="text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/moodtrack/dashboard")}
                  className="text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation("/moodtrack/check-in")}
                  className="text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                >
                  Mood Check-in
                </button>
                <button
                  onClick={() => handleNavigation("/moodtrack/assessment")}
                  className="text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                >
                  PHQ-5 Assessment
                </button>
                <button
                  onClick={() => handleNavigation("/moodtrack/enable-notifications")}
                  className="text-left px-4 py-2 hover:bg-muted rounded-md transition-colors"
                >
                  Notification Settings
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

// Helper function to determine page title based on pathname
function getPageTitle(pathname: string): string {
  switch (pathname) {
    case "/moodtrack":
      return "MoodTrack"
    case "/moodtrack/dashboard":
      return "Dashboard"
    case "/moodtrack/check-in":
      return "Mood Check-in"
    case "/moodtrack/assessment":
      return "PHQ-5 Assessment"
    case "/moodtrack/assessment/results":
      return "Assessment Results"
    case "/moodtrack/enable-notifications":
      return "Notifications"
    default:
      return "MoodTrack"
  }
}

