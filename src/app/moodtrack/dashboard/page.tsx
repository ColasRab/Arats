"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NotificationManager } from "@/components/Moodtrack/notification-manager"
import { setupFallbackNotifications } from "@/lib/notifications"

// Mock data for the mood chart
const MOCK_MOOD_DATA = [
  { date: "Mon", mood: 3 },
  { date: "Tue", mood: 4 },
  { date: "Wed", mood: 2 },
  { date: "Thu", mood: 5 },
  { date: "Fri", mood: 3 },
  { date: "Sat", mood: 4 },
  { date: "Sun", mood: 4 },
]

// Inspirational quotes
const INSPIRATIONAL_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
]

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [quote, setQuote] = useState("")
  const [showAssessmentReminder, setShowAssessmentReminder] = useState(false)
  const [daysUntilNextAssessment, setDaysUntilNextAssessment] = useState(0)

  useEffect(() => {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
    setQuote(INSPIRATIONAL_QUOTES[randomIndex])

    // Check when the last PHQ-5 assessment was completed
    const lastAssessment = localStorage.getItem("lastPhq5Assessment")

    if (lastAssessment) {
      const lastDate = new Date(lastAssessment)
      const now = new Date()

      // Calculate days since last assessment
      const daysSinceAssessment = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      // If it's been more than 5 days, show a reminder
      if (daysSinceAssessment >= 5) {
        setShowAssessmentReminder(true)
        setDaysUntilNextAssessment(7 - daysSinceAssessment)
      }
    } else {
      // If no assessment has been done, show a reminder
      setShowAssessmentReminder(true)
      setDaysUntilNextAssessment(0)
    }

    // Set up fallback notifications if needed
    if (Notification.permission === "granted") {
      setupFallbackNotifications()
    }
  }, [])

  return (
    <div className="container py-6 px-4">
      <NotificationManager />

      {showAssessmentReminder && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Weekly Assessment Reminder</AlertTitle>
          <AlertDescription>
            {daysUntilNextAssessment > 0
              ? `Your next PHQ-5 assessment is due in ${daysUntilNextAssessment} days.`
              : "It's time for your weekly PHQ-5 assessment to track your progress."}
            <Button variant="link" className="p-0 h-auto" onClick={() => (window.location.href = "./assessment")}>
              Take assessment now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Mood Tracker</CardTitle>
            <CardDescription>Your mood over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_MOOD_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Quote</CardTitle>
            <CardDescription>A little inspiration for your day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <blockquote className="italic">"{quote}"</blockquote>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
                setQuote(INSPIRATIONAL_QUOTES[randomIndex])
              }}
            >
              New Quote
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Mood History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Check-in History</CardTitle>
              <CardDescription>Your recent mood entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_MOOD_DATA.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{entry.date}</p>
                      <p className="text-sm text-muted-foreground">Recorded at 12:30 PM</p>
                    </div>
                    <div className="flex items-center">
                      {entry.mood === 1 && <span className="text-2xl">😢</span>}
                      {entry.mood === 2 && <span className="text-2xl">😕</span>}
                      {entry.mood === 3 && <span className="text-2xl">😐</span>}
                      {entry.mood === 4 && <span className="text-2xl">🙂</span>}
                      {entry.mood === 5 && <span className="text-2xl">😄</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>See your mood patterns by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

