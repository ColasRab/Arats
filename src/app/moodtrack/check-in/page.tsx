"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const MOOD_OPTIONS = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😕", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😄", label: "Very Happy" },
]

export default function CheckInPage() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  const handleSubmit = () => {
    if (selectedMood !== null) {
      // In a real app, you would save this to a database
      console.log(`Mood check-in: ${selectedMood}`)

      // For demo purposes, save to localStorage
      const now = new Date()
      const checkIns = JSON.parse(localStorage.getItem("moodCheckIns") || "[]")
      checkIns.push({
        timestamp: now.toISOString(),
        mood: selectedMood,
      })
      localStorage.setItem("moodCheckIns", JSON.stringify(checkIns))

      // Show a random quote
      router.push("./dashboard")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>Select the emoji that best represents your current mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-md transition-all ${
                  selectedMood === option.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span className="text-4xl mb-2">{option.emoji}</span>
                <span className="text-xs text-center">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={selectedMood === null} className="w-full">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

