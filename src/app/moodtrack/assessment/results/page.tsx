'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { recordPhq5Completion } from "@/lib/notifications"

type PHQ5Results = {
  [key: string]: string; // or 'number' if you expect values to be numbers
}

export default function ResultsPage() {
  const [score, setScore] = useState<number | null>(null)
  const [interpretation, setInterpretation] = useState("")

  useEffect(() => {
    const resultsString = localStorage.getItem("phq5Results")

    if (resultsString) {
      try {
        const results: PHQ5Results = JSON.parse(resultsString)

        // Calculate total score
        const totalScore = Object.values(results).reduce((sum, value) => sum + (Number(value) || 0), 0)

        setScore(totalScore)

        // Set interpretation based on score
        if (totalScore <= 4) {
          setInterpretation("Minimal or no depression")
        } else if (totalScore <= 9) {
          setInterpretation("Mild depression")
        } else if (totalScore <= 14) {
          setInterpretation("Moderate depression")
        } else {
          setInterpretation("Severe depression")
        }

        // Record that the PHQ-5 assessment was completed
        recordPhq5Completion()
      } catch (error) {
        console.error("Error parsing PHQ-5 results:", error)
      }
    }
  }, [])

  if (score === null) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading results...</p>
      </div>
    )
  }

  const maxScore = 15 // 5 questions with max 3 points each
  const scorePercentage = (score / maxScore) * 100

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Your PHQ-5 Results</CardTitle>
          <CardDescription>Based on your responses to the assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Score: {score} out of {maxScore}
              </span>
              <span>{interpretation}</span>
            </div>
            <Progress value={scorePercentage} className="h-3" />
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">What does this mean?</h3>
            <p className="text-sm text-muted-foreground">
              The PHQ-5 is a screening tool that helps identify potential signs of depression. Your results are not a
              diagnosis but can help you understand your current mental wellbeing.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We'll use this information to personalize your mood tracking experience and provide relevant inspirational
              quotes.
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-md">
            <h3 className="font-medium mb-2">Next Steps</h3>
            <p className="text-sm">
              You'll receive weekly reminders to take this assessment again to track your progress over time. This helps
              us understand how your mood changes week to week.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/moodtrack">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/moodtrack/dashboard">
            <Button>View Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
