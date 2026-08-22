import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding GlobeTrotter database...')

  // Clear existing data safely
  await prisma.expense.deleteMany()
  await prisma.itineraryActivity.deleteMany()
  await prisma.itineraryDay.deleteMany()
  await prisma.tripStop.deleteMany()
  await prisma.tripMember.deleteMany()
  await prisma.tripShare.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.savedDestination.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.city.deleteMany()
  await prisma.userPreference.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Demo Users
  const password = await hash('password123', 12)
  const demoUser = await prisma.user.create({
    data: {
      id: 'usr_demo_001',
      email: 'demo@globetrotter.app',
      name: 'Elena Rostova',
      password,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'ADMIN',
      preferences: {
        create: {
          currency: 'USD',
          language: 'en',
        },
      },
    },
  })

  // 2. Create Cities
  const citiesData = [
    {
      id: 'city_paris',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      lat: 48.8566,
      lng: 2.3522,
      costIndex: 5,
      popularityScore: 4.95,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      description: 'The City of Light, world-renowned for art, gastronomy, and historic architecture.',
    },
    {
      id: 'city_tokyo',
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      lat: 35.6762,
      lng: 139.6503,
      costIndex: 4,
      popularityScore: 4.98,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      description: 'A mesmerizing blend of hyper-modern neon skylines, tranquil shrines, and culinary excellence.',
    },
    {
      id: 'city_rome',
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      lat: 41.9028,
      lng: 12.4964,
      costIndex: 4,
      popularityScore: 4.92,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      description: 'The Eternal City with thousands of years of art, ancient amphitheaters, and lively piazzas.',
    },
    {
      id: 'city_amsterdam',
      name: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      lat: 52.3676,
      lng: 4.9041,
      costIndex: 4,
      popularityScore: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
      description: 'Historic canal belts, world-class art museums, cycling culture, and open-air cafés.',
    },
    {
      id: 'city_dubai',
      name: 'Dubai',
      country: 'UAE',
      region: 'Middle East',
      lat: 25.2048,
      lng: 55.2708,
      costIndex: 5,
      popularityScore: 4.91,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      description: 'Futuristic architecture, ultra-luxury shopping, dune adventures, and breathtaking coastlines.',
    },
    {
      id: 'city_kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      lat: 35.0116,
      lng: 135.7681,
      costIndex: 3,
      popularityScore: 4.94,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      description: 'The cultural heart of Japan with thousands of classical Buddhist temples and gardens.',
    },
    {
      id: 'city_bali',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      lat: -8.4095,
      lng: 115.1889,
      costIndex: 2,
      popularityScore: 4.89,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      description: 'Tropical paradise with volcanic mountains, iconic terraced rice paddies, and beaches.',
    },
    {
      id: 'city_newyork',
      name: 'New York',
      country: 'United States',
      region: 'Americas',
      lat: 40.7128,
      lng: -74.0060,
      costIndex: 5,
      popularityScore: 4.97,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      description: 'The vibrant global metropolis of finance, Broadway theater, and iconic skyline.',
    },
  ]

  for (const c of citiesData) {
    await prisma.city.create({ data: c })
  }

  // 3. Create Activities
  const activitiesData = [
    // Paris
    {
      name: 'Eiffel Tower Summit & Gardens Tour',
      type: 'SIGHTSEEING',
      category: 'Sightseeing',
      description: 'Ascend to the summit for breathtaking 360-degree panoramic views of Paris.',
      defaultCost: 45.0,
      durationMinutes: 150,
      durationText: '2.5 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_paris',
    },
    {
      name: 'Louvre Classical Masterpieces Tour',
      type: 'CULTURE',
      category: 'Culture',
      description: 'Explore the Mona Lisa, Venus de Milo, and Winged Victory with an expert curator.',
      defaultCost: 35.0,
      durationMinutes: 180,
      durationText: '3.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_paris',
    },
    {
      name: 'Seine River Twilight Dinner Cruise',
      type: 'MEAL',
      category: 'Food',
      description: 'Savor gourmet French cuisine as illuminated monuments glide past.',
      defaultCost: 85.0,
      durationMinutes: 120,
      durationText: '2.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_paris',
    },
    // Rome
    {
      name: 'Colosseum & Roman Forum Guided Walk',
      type: 'SIGHTSEEING',
      category: 'Sightseeing',
      description: 'Step into gladiatorial history and explore the ancient civic center of Rome.',
      defaultCost: 50.0,
      durationMinutes: 210,
      durationText: '3.5 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_rome',
    },
    {
      name: 'Vatican Museums & Sistine Chapel',
      type: 'CULTURE',
      category: 'Culture',
      description: 'Marvel at Michelangelo’s ceiling frescoes and Renaissance collections.',
      defaultCost: 48.0,
      durationMinutes: 180,
      durationText: '3.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_rome',
    },
    {
      name: 'Trastevere Sunset Food & Wine Journey',
      type: 'MEAL',
      category: 'Food',
      description: 'Tasting tour featuring handmade pasta, Roman supplì, and local vintages.',
      defaultCost: 65.0,
      durationMinutes: 150,
      durationText: '2.5 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_rome',
    },
    // Tokyo
    {
      name: 'Tokyo Skytree Panoramic Deck',
      type: 'SIGHTSEEING',
      category: 'Sightseeing',
      description: 'Stand above the world’s largest metropolis with views extending to Mount Fuji.',
      defaultCost: 28.0,
      durationMinutes: 120,
      durationText: '2.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_tokyo',
    },
    {
      name: 'Authentic Edo Sushi Masterclass',
      type: 'MEAL',
      category: 'Food',
      description: 'Learn nigiri and maki rolling techniques directly from a master sushi chef.',
      defaultCost: 95.0,
      durationMinutes: 120,
      durationText: '2.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_tokyo',
    },
    // Amsterdam
    {
      name: 'Heritage Canal Ring Boat Cruise',
      type: 'SIGHTSEEING',
      category: 'Sightseeing',
      description: 'Glide through UNESCO-listed golden age waterways aboard a classic salon boat.',
      defaultCost: 26.0,
      durationMinutes: 90,
      durationText: '1.5 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_amsterdam',
    },
    {
      name: 'Van Gogh Museum Exhibition Walk',
      type: 'CULTURE',
      category: 'Culture',
      description: 'Explore the world’s largest collection of paintings by Vincent van Gogh.',
      defaultCost: 24.0,
      durationMinutes: 120,
      durationText: '2.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_amsterdam',
    },
    // Dubai
    {
      name: 'Desert Safari & Dune Bashing',
      type: 'ADVENTURE',
      category: 'Adventure',
      description: '4x4 dune drive, sunset camel rides, and Arabic culinary feast under the stars.',
      defaultCost: 75.0,
      durationMinutes: 360,
      durationText: '6.0 hrs',
      imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
      cityId: 'city_dubai',
    },
  ]

  for (const act of activitiesData) {
    await prisma.activity.create({ data: act })
  }

  // 4. Create Sample Trip
  const trip = await prisma.trip.create({
    data: {
      id: 'trip_euro_2026',
      name: 'European Grand Escape',
      description: 'Curated journey through art, culture, and cuisine in Paris, Amsterdam, and Rome.',
      startDate: new Date('2026-09-12'),
      endDate: new Date('2026-09-24'),
      budget: 3500.0,
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'gt-share-euro-2026',
      ownerId: demoUser.id,
    },
  })

  // 5. Create Trip Stops
  const stop1 = await prisma.tripStop.create({
    data: {
      id: 'stop_01_paris',
      tripId: trip.id,
      cityId: 'city_paris',
      cityName: 'Paris',
      country: 'France',
      arrivalDate: new Date('2026-09-12'),
      departureDate: new Date('2026-09-16'),
      order: 0,
      notes: 'Explore world-renowned museums, historic architecture, and Seine twilight cruises.',
      estimatedCost: 1200.0,
    },
  })

  const stop2 = await prisma.tripStop.create({
    data: {
      id: 'stop_02_ams',
      tripId: trip.id,
      cityId: 'city_amsterdam',
      cityName: 'Amsterdam',
      country: 'Netherlands',
      arrivalDate: new Date('2026-09-16'),
      departureDate: new Date('2026-09-20'),
      order: 1,
      notes: 'Canal cruises, Van Gogh Museum archives, and bicycle rides through historic districts.',
      estimatedCost: 950.0,
    },
  })

  const stop3 = await prisma.tripStop.create({
    data: {
      id: 'stop_03_rome',
      tripId: trip.id,
      cityId: 'city_rome',
      cityName: 'Rome',
      country: 'Italy',
      arrivalDate: new Date('2026-09-20'),
      departureDate: new Date('2026-09-24'),
      order: 2,
      notes: 'Colosseum tours, Roman Forum, Vatican treasures, and Trastevere culinary dining.',
      estimatedCost: 1350.0,
    },
  })

  // 6. Create Itinerary Days & Activities
  const day1 = await prisma.itineraryDay.create({
    data: {
      date: new Date('2026-09-13'),
      stopId: stop1.id,
    },
  })

  const itAct1 = await prisma.itineraryActivity.create({
    data: {
      dayId: day1.id,
      customName: 'Eiffel Tower Summit & Gardens Tour',
      category: 'activities',
      timeText: '09:30',
      customCost: 45.0,
      notes: 'Skip-the-line summit tickets reserved.',
      location: 'Champ de Mars, Paris',
      order: 0,
    },
  })

  const itAct2 = await prisma.itineraryActivity.create({
    data: {
      dayId: day1.id,
      customName: 'Lunch at Café de Flore',
      category: 'meals',
      timeText: '12:30',
      customCost: 35.0,
      notes: 'Outdoor bistro seating.',
      location: 'Saint-Germain-des-Prés',
      order: 1,
    },
  })

  // 7. Seed Expenses
  await prisma.expense.createMany({
    data: [
      {
        tripId: trip.id,
        category: 'activities',
        amount: 45.0,
        currency: 'USD',
        description: 'Eiffel Tower Tickets',
        date: new Date('2026-09-13'),
      },
      {
        tripId: trip.id,
        category: 'meals',
        amount: 35.0,
        currency: 'USD',
        description: 'Lunch at Café de Flore',
        date: new Date('2026-09-13'),
      },
      {
        tripId: trip.id,
        category: 'stay',
        amount: 650.0,
        currency: 'USD',
        description: 'Le Marais Boutique Hotel (4 nights)',
        date: new Date('2026-09-12'),
      },
      {
        tripId: trip.id,
        category: 'transport',
        amount: 140.0,
        currency: 'USD',
        description: 'Eurostar Express (Paris -> Amsterdam)',
        date: new Date('2026-09-16'),
      },
      {
        tripId: trip.id,
        category: 'stay',
        amount: 520.0,
        currency: 'USD',
        description: 'Jordaan Canal Loft Hotel (4 nights)',
        date: new Date('2026-09-16'),
      },
      {
        tripId: trip.id,
        category: 'transport',
        amount: 180.0,
        currency: 'USD',
        description: 'Flight (Amsterdam -> Rome FCO)',
        date: new Date('2026-09-20'),
      },
    ],
  })

  // 8. Saved Destinations
  await prisma.savedDestination.createMany({
    data: [
      { userId: demoUser.id, cityId: 'city_tokyo' },
      { userId: demoUser.id, cityId: 'city_kyoto' },
      { userId: demoUser.id, cityId: 'city_dubai' },
    ],
  })

  console.log('GlobeTrotter database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
