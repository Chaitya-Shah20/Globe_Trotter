// Mock Gemini AI Abstraction

export async function generateItinerarySuggestions(city: string, days: number) {
  // In a real implementation, this would call the Google Gemini API
  // e.g. const { text } = await generateText({ model: gemini('gemini-1.5-pro'), prompt: `...` })
  
  console.log(`[AI Mock] Generating suggestions for ${city} for ${days} days`)
  
  // Return mocked data to establish the data contract
  return [
    {
      day: 1,
      activities: [
        { name: "Morning City Tour", type: "SIGHTSEEING", estimatedDurationMinutes: 180 },
        { name: "Local Lunch", type: "MEAL", estimatedDurationMinutes: 60 },
        { name: "Museum Visit", type: "SIGHTSEEING", estimatedDurationMinutes: 120 }
      ]
    },
    {
      day: 2,
      activities: [
        { name: "Day trip to nearby attraction", type: "SIGHTSEEING", estimatedDurationMinutes: 300 },
        { name: "Dinner downtown", type: "MEAL", estimatedDurationMinutes: 90 }
      ]
    }
  ]
}

export async function extractDetailsFromText(text: string) {
  console.log(`[AI Mock] Extracting trip details from text`)
  return {
    destinations: ["Paris", "London"],
    estimatedDuration: 7
  }
}
