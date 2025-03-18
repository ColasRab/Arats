"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, LineChart, MapPin, Moon, User, Weight, Calendar, Settings, LogOut, Menu, X, Save } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    age: "35",
    gender: "male",
    phone: "+1 (555) 123-4567",
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Profile data:", formData)

    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">MindTrack</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/logout">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col md:grid md:grid-cols-[220px_1fr]">
        <aside className={`${sidebarOpen ? "flex" : "hidden"} w-full flex-col border-r bg-muted/40 md:flex`}>
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
              <LineChart className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/mood-logs" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
              <Calendar className="h-5 w-5" />
              Mood Logs
            </Link>
            <Link href="/sleep-tracking" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
              <Moon className="h-5 w-5" />
              Sleep Tracking
            </Link>
            <Link href="/weight-tracking" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
              <Weight className="h-5 w-5" />
              Weight Tracking
            </Link>
            <Link href="/location-data" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted">
              <MapPin className="h-5 w-5" />
              Location Data
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Your Profile</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Manage your profile picture and personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button size="sm">Change Picture</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-binary" id="non-binary" />
                        <Label htmlFor="non-binary">Non-binary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                        <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="gap-1">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Data Collection</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are currently sharing the following data types for mental wellbeing assessment:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    <li>Mood logs</li>
                    <li>Sleep patterns</li>
                    <li>Weight changes</li>
                    <li>Location data (for entropy calculation)</li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Data Export</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can export all your data in a machine-readable format at any time.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Export Data
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Account Deletion</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deleting your account will permanently remove all your data from our systems. This action cannot be
                    undone.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-2">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

