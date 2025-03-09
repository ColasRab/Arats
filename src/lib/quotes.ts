export const morningQuotes = [
    "Today is a new beginning, a chance to turn your dreams into reality.",
    "The morning sun has secrets to tell you. Don't go back to sleep.",
    "Every morning brings new potential, but if you keep doing the same things you won't see different results.",
    "Wake up with determination, go to bed with satisfaction.",
    "Your future is created by what you do today, not tomorrow.",
  ]
  
  export const noonQuotes = [
    "Take a breath. You're halfway through your day and doing great.",
    "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    "Your attitude determines your direction.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  ]
  
  export const eveningQuotes = [
    "Reflect on your day with gratitude, not judgment.",
    "The day is over, the night is here, tomorrow is a new opportunity.",
    "Your day was important because you were in it.",
    "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve others from the overflow.",
    "Each day provides its own gifts.",
  ]
  
  export const nightQuotes = [
    "Sleep is the best meditation.",
    "The night is more alive and more richly colored than the day.",
    "Stars can't shine without darkness.",
    "Never let the darkness or negativity outside affect your inner self.",
    "The darkest nights produce the brightest stars.",
  ]
  
  export function getQuoteForTimeOfDay(): string {
    const hour = new Date().getHours()
  
    if (hour >= 5 && hour < 12) {
      // Morning (5 AM - 11:59 AM)
      return morningQuotes[Math.floor(Math.random() * morningQuotes.length)]
    } else if (hour >= 12 && hour < 17) {
      // Noon/Afternoon (12 PM - 4:59 PM)
      return noonQuotes[Math.floor(Math.random() * noonQuotes.length)]
    } else if (hour >= 17 && hour < 22) {
      // Evening (5 PM - 9:59 PM)
      return eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)]
    } else {
      // Night (10 PM - 4:59 AM)
      return nightQuotes[Math.floor(Math.random() * nightQuotes.length)]
    }
  }
  
  export function getRandomQuote(): string {
    const allQuotes = [...morningQuotes, ...noonQuotes, ...eveningQuotes, ...nightQuotes]
    return allQuotes[Math.floor(Math.random() * allQuotes.length)]
  }
  