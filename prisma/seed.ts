import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.expense.deleteMany()
  await prisma.itineraryActivity.deleteMany()
  await prisma.itineraryDay.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.tripStop.deleteMany()
  await prisma.tripMember.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.city.deleteMany()
  await prisma.user.deleteMany()

  // Create User
  const password = await hash('password123', 12)
  const user = await prisma.user.create({
    data: {
      email: 'demo@globetrotter.app',
      name: 'Demo User',
      password,
      role: 'USER',
      preferences: {
        create: {
          currency: 'USD',
          language: 'en',
        },
      },
    },
  })

  // Create Cities
  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522,
      costIndex: 5,
      imageUrl: 'https://images.unsplash.com/photo-1502602881469-4478ae466f72',
    },
  })

  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      lat: 35.6762,
      lng: 139.6503,
      costIndex: 4,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    },
  })

  // Create Activities in Paris
  const eiffel = await prisma.activity.create({
    data: {
      name: 'Eiffel Tower Tour',
      description: 'Visit the top of the Eiffel Tower',
      type: 'SIGHTSEEING',
      defaultCost: 30.0,
      durationMinutes: 120,
      cityId: paris.id,
    },
  })

  const louvre = await prisma.activity.create({
    data: {
      name: 'Louvre Museum',
      description: 'See the Mona Lisa and other masterpieces',
      type: 'SIGHTSEEING',
      defaultCost: 20.0,
      durationMinutes: 180,
      cityId: paris.id,
    },
  })

  // Create a Trip
  const trip = await prisma.trip.create({
    data: {
      name: 'Euro Trip 2026',
      description: 'A magical journey through France',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-05'),
      isPublic: true,
      ownerId: user.id,
    },
  })

  // Create a Stop
  const stop1 = await prisma.tripStop.create({
    data: {
      tripId: trip.id,
      cityId: paris.id,
      arrivalDate: new Date('2026-06-01'),
      departureDate: new Date('2026-06-05'),
      order: 0,
    },
  })

  // Create Itinerary Day
  const day1 = await prisma.itineraryDay.create({
    data: {
      date: new Date('2026-06-02'),
      stopId: stop1.id,
    },
  })

  // Add Activities to Day
  const itineraryActivity1 = await prisma.itineraryActivity.create({
    data: {
      dayId: day1.id,
      activityId: eiffel.id,
      startTime: new Date('2026-06-02T10:00:00Z'),
      endTime: new Date('2026-06-02T12:00:00Z'),
      customCost: 35.0,
      order: 0,
    },
  })

  // Add Expense
  await prisma.expense.create({
    data: {
      tripId: trip.id,
      itineraryActivityId: itineraryActivity1.id,
      amount: 35.0,
      currency: 'USD',
      category: 'activities',
      description: 'Eiffel Tower Tickets',
      date: new Date('2026-06-02'),
    },
  })

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
