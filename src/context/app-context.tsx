"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

type MoodType = "happy" | "neutral" | "sad" | ""
type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say" | ""

interface UserData {
  name: string
  email: string
  age: string
  gender: Gender
  locationTracking: boolean
  sleepTracking: boolean
  weightTracking: boolean
  moodTracking: boolean
}

interface SleepData {
  date: Date
  bedTime: Date
  wakeTime: Date
  duration: number
  quality: number
  notes: string
}

interface WeightData {
  date: Date
  weight: number
  unit: "kg" | "lbs"
  notes: string
}

interface MoodData {
  date: Date
  mood: MoodType
  activities: string[]
  notes: string
}

interface PHQData {
  date: Date
  score: number
  answers: number[]
}

interface AppContextType {
  user: UserData | null
  setUser: (user: UserData | null) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<UserData>, password: string) => Promise<boolean>
  sleepData: SleepData[]
  addSleepData: (data: SleepData) => void
  weightData: WeightData[]
  addWeightData: (data: WeightData) => void
  moodData: MoodData[]
  addMoodData: (data: MoodData) => void
  phqData: PHQData[]
  addPHQData: (data: PHQData) => void
  mentalWellbeingScore: number
  calculateMentalWellbeingScore: () => number
  darkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sleepData, setSleepData] = useState<SleepData[]>([])
  const [weightData, setWeightData] = useState<WeightData[]>([])
  const [moodData, setMoodData] = useState<MoodData[]>([])
  const [phqData, setPHQData] = useState<PHQData[]>([])
  const [mentalWellbeingScore, setMentalWellbeingScore] = useState(72)
  const [darkMode, setDarkMode] = useState(false)

  // Check for saved user data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }

    // Apply dark mode if saved
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Update the login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login for demo purposes
      if (email && password) {
        const mockUser: UserData = {
          name: "John Doe",
          email: email,
          age: "35",
          gender: "male",
          locationTracking: true,
          sleepTracking: true,
          weightTracking: true,
          moodTracking: true,
        }

        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(mockUser))

        toast({
          title: "Login successful",
          description: "Welcome back to MindTrack!",
        })

        return true
      }

      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })

      return false
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
      return false
    }
  }

  // Update the register function
  const register = async (userData: Partial<UserData>, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to register
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (userData.email && password) {
        const newUser: UserData = {
          name: userData.name || "",
          email: userData.email,
          age: userData.age || "",
          gender: userData.gender || "prefer-not-to-say",
          locationTracking: userData.locationTracking || false,
          sleepTracking: userData.sleepTracking || false,
          weightTracking: userData.weightTracking || false,
          moodTracking: userData.moodTracking || false,
        }

        setUser(newUser)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(newUser))

        toast({
          title: "Registration successful",
          description: "Welcome to MindTrack!",
        })

        return true
      }

      toast({
        title: "Registration failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      })

      return false
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const addSleepData = (data: SleepData) => {
    setSleepData((prev) => [...prev, data])
    // In a real app, this would also send the data to your backend
    toast({
      title: "Sleep data saved",
      description: `Sleep quality: ${data.quality}/10, Duration: ${data.duration.toFixed(1)} hours`,
    })
  }

  const addWeightData = (data: WeightData) => {
    setWeightData((prev) => [...prev, data])
    // In a real app, this would also send the data to your backend
    toast({
      title: "Weight data saved",
      description: `Weight: ${data.weight} ${data.unit}`,
    })
  }

  const addMoodData = (data: MoodData) => {
    setMoodData((prev) => [...prev, data])
    // In a real app, this would also send the data to your backend
    toast({
      title: "Mood logged",
      description: `Your ${data.mood} mood has been recorded`,
    })
  }

  const addPHQData = (data: PHQData) => {
    setPHQData((prev) => [...prev, data])
    // In a real app, this would also send the data to your backend
    toast({
      title: "PHQ assessment completed",
      description: `Your score is ${data.score} out of 27`,
    })

    // Recalculate mental wellbeing score when new PHQ data is added
    calculateMentalWellbeingScore()
  }

  const calculateMentalWellbeingScore = () => {
    // In a real app, this would use Multivariate Linear Regression
    // to calculate a score based on all the collected data

    // For demo purposes, we'll use a simple algorithm
    let score = 70 // Base score

    // Adjust based on latest PHQ score if available
    if (phqData.length > 0) {
      const latestPHQ = phqData[phqData.length - 1]
      // PHQ-9 scores range from 0-27, higher is worse
      // Invert and scale to adjust our score
      score -= (latestPHQ.score / 27) * 20
    }

    // Adjust based on mood data if available
    if (moodData.length > 0) {
      const recentMoods = moodData.slice(-7) // Last 7 entries
      const moodScores = recentMoods.map((m) => {
        if (m.mood === "happy") return 10
        if (m.mood === "neutral") return 5
        return 0 // sad
      })

      const avgMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length
      score += avgMoodScore
    }

    // Adjust based on sleep quality if available
    if (sleepData.length > 0) {
      const recentSleep = sleepData.slice(-7) // Last 7 entries
      const avgQuality = recentSleep.reduce((sum, data) => sum + data.quality, 0) / recentSleep.length
      score += (avgQuality / 10) * 10
    }

    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score))

    setMentalWellbeingScore(Math.round(score))
    return Math.round(score)
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev
      localStorage.setItem("darkMode", String(newMode))

      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      return newMode
    })
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        register,
        sleepData,
        addSleepData,
        weightData,
        addWeightData,
        moodData,
        addMoodData,
        phqData,
        addPHQData,
        mentalWellbeingScore,
        calculateMentalWellbeingScore,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

