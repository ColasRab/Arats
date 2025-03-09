"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const PHQ5_QUESTIONS = [
  {
    id: "q1",
    question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
  },
  {
    id: "q2",
    question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
  },
  {
    id: "q3",
    question:
      "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
  },
  {
    id: "q4",
    question: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
  },
  {
    id: "q5",
    question: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
  },
]

const ANSWER_OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedValue, setSelectedValue] = useState<string>("")

  const handleNext = () => {
    if (selectedValue) {
      setAnswers({ ...answers, [PHQ5_QUESTIONS[currentQuestion].id]: selectedValue })
      setSelectedValue("")

      if (currentQuestion < PHQ5_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Save answers and redirect to results
        localStorage.setItem("phq5Results", JSON.stringify(answers))
        router.push("./assessment/results")
      }
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>PHQ-5 Assessment</CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {PHQ5_QUESTIONS.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h2 className="text-xl font-medium">{PHQ5_QUESTIONS[currentQuestion].question}</h2>

            <RadioGroup value={selectedValue} onValueChange={setSelectedValue} className="space-y-3">
              {ANSWER_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedValue}>
            {currentQuestion < PHQ5_QUESTIONS.length - 1 ? "Next" : "Complete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

