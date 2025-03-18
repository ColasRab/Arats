import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/Moodtrack/theme-provider"
import { MobileHeader } from "@/components/Moodtrack/mobile-header"

// Load Inter font with a stable class name
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Use CSS variable approach
})

export const metadata: Metadata = {
  title: "MoodTrack - Mental Health Tracker",
  description: "Track your mood, receive timely check-ins, and get inspirational quotes throughout your day",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoodTrack",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <MobileHeader />
            <main className="flex flex-1 items-center justify-center">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

