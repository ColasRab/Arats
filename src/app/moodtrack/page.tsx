import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">MoodTrack</h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl">
        Track your mood, receive timely check-ins, and get inspirational quotes throughout your day
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>PHQ-5 Assessment</CardTitle>
            <CardDescription>
              Complete a quick 5-question assessment to help us understand your baseline mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The PHQ-5 is a simplified version of the Patient Health Questionnaire that helps track mood and mental
              wellbeing.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="moodtrack/assessment" className="w-full">
              <Button className="w-full">Start Assessment</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Dashboard</CardTitle>
            <CardDescription>View your mood history and track your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your personal dashboard shows your mood trends and history of check-ins.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="moodtrack/dashboard" className="w-full">
              <Button className="w-full" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
              1
            </div>
            <h3 className="text-lg font-medium mb-2">Complete Assessment</h3>
            <p className="text-muted-foreground">Take the PHQ-5 assessment to establish your baseline</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
              2
            </div>
            <h3 className="text-lg font-medium mb-2">Receive Check-ins</h3>
            <p className="text-muted-foreground">Get notifications throughout the day to track your mood</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
              3
            </div>
            <h3 className="text-lg font-medium mb-2">Get Inspired</h3>
            <p className="text-muted-foreground">Receive timely inspirational quotes to brighten your day</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Link href="/moodtrack/enable-notifications">
          <Button size="lg">Enable Notifications</Button>
        </Link>
      </div>
    </div>
  )
}

