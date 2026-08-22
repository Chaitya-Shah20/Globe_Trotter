import 'dotenv/config'
import prisma from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
  // Clear existing data
  await prisma.expense.deleteMany()
  await prisma.itineraryActivity.deleteMany()
  await prisma.itineraryDay.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.tripStop.deleteMany()
  await prisma.tripMember.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.savedDestination.deleteMany()
  await prisma.city.deleteMany()
  await prisma.userPreference.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
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

  const barcelona = await prisma.city.create({
    data: {
      name: 'Barcelona',
      country: 'Spain',
      lat: 41.3879,
      lng: 2.1700,
      costIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1000&q=80',
    },
  })

  const dubai = await prisma.city.create({
    data: {
      name: 'Dubai',
      country: 'United Arab Emirates',
      lat: 25.2048,
      lng: 55.2708,
      costIndex: 5,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    },
  })

  const bali = await prisma.city.create({
    data: {
      name: 'Bali',
      country: 'Indonesia',
      lat: -8.4095,
      lng: 115.1889,
      costIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    },
  })

  // ─── PARIS ACTIVITIES (8) ───
  const eiffel = await prisma.activity.create({
    data: {
      name: 'Eiffel Tower Tour',
      description: 'Ascend to the summit of the iconic iron lattice tower for breathtaking panoramic views of Paris, the Seine, and beyond.',
      type: 'SIGHTSEEING',
      defaultCost: 30.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Louvre Museum',
      description: 'Explore the world\'s largest art museum housing the Mona Lisa, Venus de Milo, and over 380,000 objects across 60,600 sqm.',
      type: 'SIGHTSEEING',
      defaultCost: 22.0,
      durationMinutes: 240,
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Seine River Cruise',
      description: 'Glide past illuminated landmarks on an evening boat cruise through the heart of Paris.',
      type: 'SIGHTSEEING',
      defaultCost: 18.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Le Marais Food Tour',
      description: 'Taste authentic French pastries, aged cheeses, charcuterie, and wine in one of Paris\'s most vibrant neighborhoods.',
      type: 'FOOD',
      defaultCost: 85.0,
      durationMinutes: 180,
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Montmartre Wine Tasting',
      description: 'Sample premier cru wines in the artistic hilltop village of Montmartre, home to the last vineyard in Paris.',
      type: 'FOOD',
      defaultCost: 55.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Moulin Rouge Show',
      description: 'Experience the legendary cabaret with dazzling costumes, can-can dancers, and champagne under the iconic red windmill.',
      type: 'NIGHTLIFE',
      defaultCost: 120.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Galeries Lafayette Shopping',
      description: 'Browse luxury fashion, beauty, and gourmet treats under the stunning Art Nouveau glass dome.',
      type: 'SHOPPING',
      defaultCost: 0.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Hammam Spa Experience',
      description: 'Unwind in a traditional Moroccan-style hammam with steam rooms, exfoliating scrubs, and relaxation pools.',
      type: 'WELLNESS',
      defaultCost: 65.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      cityId: paris.id,
    },
  })

  // ─── TOKYO ACTIVITIES (8) ───
  await prisma.activity.create({
    data: {
      name: 'Senso-ji Temple Visit',
      description: 'Walk through the Thunder Gate and explore Tokyo\'s oldest and most significant Buddhist temple in Asakusa.',
      type: 'SIGHTSEEING',
      defaultCost: 0.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1583266203671-d8d890500d84?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'TeamLab Borderless',
      description: 'Immerse yourself in a world of interactive digital art installations that respond to your movement.',
      type: 'SIGHTSEEING',
      defaultCost: 32.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Tsukiji Outer Market Food Tour',
      description: 'Sample fresh sushi, tamagoyaki, wagyu skewers, and matcha treats at Tokyo\'s legendary fish market.',
      type: 'FOOD',
      defaultCost: 45.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Ramen Tasting Tour',
      description: 'Slurp your way through 3 of Tokyo\'s best ramen shops, from rich tonkotsu to delicate shoyu broths.',
      type: 'FOOD',
      defaultCost: 38.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Mt. Fuji Day Trip',
      description: 'Journey to the 5th station of Japan\'s sacred mountain with stops at Lake Kawaguchi and Oshino Hakkai.',
      type: 'ADVENTURE',
      defaultCost: 95.0,
      durationMinutes: 600,
      imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Shibuya Nightlife Crawl',
      description: 'Explore neon-lit izakayas, rooftop bars, and karaoke rooms in Tokyo\'s most electric neighborhood.',
      type: 'NIGHTLIFE',
      defaultCost: 50.0,
      durationMinutes: 180,
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Harajuku & Akihabara Shopping',
      description: 'Dive into Kawaii fashion on Takeshita Street and browse anime, manga, and electronics in Akihabara.',
      type: 'SHOPPING',
      defaultCost: 0.0,
      durationMinutes: 240,
      imageUrl: 'https://images.unsplash.com/photo-1532236204992-f5e82c22d55d?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Onsen Hot Spring Experience',
      description: 'Soak in natural mineral hot springs at a traditional Japanese bathhouse for total relaxation.',
      type: 'WELLNESS',
      defaultCost: 25.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
      cityId: tokyo.id,
    },
  })

  // ─── BARCELONA ACTIVITIES (8) ───
  await prisma.activity.create({
    data: {
      name: 'Sagrada Familia Tour',
      description: 'Marvel at Gaudí\'s unfinished masterpiece basilica with its soaring spires and kaleidoscopic stained glass.',
      type: 'SIGHTSEEING',
      defaultCost: 36.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1583779457711-ab3f13a67e5a?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Park Güell',
      description: 'Wander through Gaudí\'s colorful mosaic park overlooking the city with dragon fountains and organic architecture.',
      type: 'SIGHTSEEING',
      defaultCost: 10.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'La Boqueria Market Tour',
      description: 'Feast on fresh juices, jamón ibérico, seafood tapas, and artisanal cheeses at Europe\'s most famous food market.',
      type: 'FOOD',
      defaultCost: 40.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Gothic Quarter Walking Tour',
      description: 'Navigate medieval alleyways, Roman ruins, and hidden plazas in Barcelona\'s atmospheric old town.',
      type: 'SIGHTSEEING',
      defaultCost: 15.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Barceloneta Beach & Kayaking',
      description: 'Paddle along the Mediterranean coast with views of the Barcelona skyline and historic port.',
      type: 'ADVENTURE',
      defaultCost: 45.0,
      durationMinutes: 180,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Flamenco Night Show',
      description: 'Feel the passion of authentic Andalusian flamenco with live guitar, singing, and dance in an intimate tablao.',
      type: 'NIGHTLIFE',
      defaultCost: 45.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Passeig de Gràcia Shopping',
      description: 'Stroll past Gaudí\'s Casa Batlló and Casa Milà while browsing high-end designer boutiques.',
      type: 'SHOPPING',
      defaultCost: 0.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Aire Ancient Baths',
      description: 'Relax in candlelit Roman-inspired thermal pools, salt baths, and aromatic steam rooms in a historic building.',
      type: 'WELLNESS',
      defaultCost: 50.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
      cityId: barcelona.id,
    },
  })

  // ─── DUBAI ACTIVITIES (8) ───
  await prisma.activity.create({
    data: {
      name: 'Burj Khalifa Observation Deck',
      description: 'Ride to the 148th floor of the world\'s tallest building for 360° views across the Arabian Gulf.',
      type: 'SIGHTSEEING',
      defaultCost: 75.0,
      durationMinutes: 90,
      imageUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Desert Safari & Dune Bashing',
      description: 'Race over golden sand dunes in a 4x4, ride camels, and feast at a Bedouin camp under the stars.',
      type: 'ADVENTURE',
      defaultCost: 65.0,
      durationMinutes: 360,
      imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Old Dubai Spice & Gold Souk Tour',
      description: 'Haggle for saffron, frankincense, and 22-karat gold jewelry in atmospheric covered markets.',
      type: 'SHOPPING',
      defaultCost: 0.0,
      durationMinutes: 150,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Dubai Marina Dinner Cruise',
      description: 'Enjoy a buffet dinner aboard a dhow as you cruise past the glittering Marina skyline at night.',
      type: 'FOOD',
      defaultCost: 75.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Skydiving over Palm Jumeirah',
      description: 'Free-fall from 13,000 feet with tandem skydive views of the Palm, Burj Al Arab, and the coastline.',
      type: 'ADVENTURE',
      defaultCost: 550.0,
      durationMinutes: 60,
      imageUrl: 'https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Atlantis Aquaventure Waterpark',
      description: 'Ride record-breaking waterslides, float in the lazy river, and swim with dolphins at the Palm\'s mega resort.',
      type: 'ADVENTURE',
      defaultCost: 85.0,
      durationMinutes: 360,
      imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'White Dubai Nightclub',
      description: 'Party at one of the world\'s top nightclubs with rooftop views of the Burj Khalifa and top international DJs.',
      type: 'NIGHTLIFE',
      defaultCost: 100.0,
      durationMinutes: 240,
      imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Talise Ottoman Spa',
      description: 'Indulge in luxury treatments with Turkish hammam, gold facials, and Arabian-inspired rituals at Jumeirah Zabeel Saray.',
      type: 'WELLNESS',
      defaultCost: 200.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&w=800&q=80',
      cityId: dubai.id,
    },
  })

  // ─── BALI ACTIVITIES (8) ───
  await prisma.activity.create({
    data: {
      name: 'Ubud Rice Terraces Trek',
      description: 'Hike through the emerald Tegallalang rice terraces with a local guide explaining traditional Subak irrigation.',
      type: 'ADVENTURE',
      defaultCost: 25.0,
      durationMinutes: 180,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Uluwatu Temple Sunset',
      description: 'Watch the traditional Kecak fire dance as the sun sets over the Indian Ocean at this cliffside temple.',
      type: 'SIGHTSEEING',
      defaultCost: 5.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Balinese Cooking Class',
      description: 'Visit a morning market, learn to prepare 8 traditional Balinese dishes, then feast on your creations.',
      type: 'FOOD',
      defaultCost: 35.0,
      durationMinutes: 240,
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Nusa Penida Snorkeling Trip',
      description: 'Snorkel with manta rays at Manta Point, explore Crystal Bay, and see the famous Kelingking cliffs.',
      type: 'ADVENTURE',
      defaultCost: 55.0,
      durationMinutes: 480,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Seminyak Beach Club',
      description: 'Lounge poolside with cocktails and sunset DJ sets at one of Bali\'s legendary beach clubs.',
      type: 'NIGHTLIFE',
      defaultCost: 40.0,
      durationMinutes: 240,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Ubud Art Market Shopping',
      description: 'Browse handcrafted batik textiles, wood carvings, rattan bags, and silver jewelry from local artisans.',
      type: 'SHOPPING',
      defaultCost: 0.0,
      durationMinutes: 120,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Jungle Spa & Yoga Retreat',
      description: 'Practice sunrise yoga overlooking the Ayung River valley followed by a traditional Balinese massage.',
      type: 'WELLNESS',
      defaultCost: 45.0,
      durationMinutes: 180,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  await prisma.activity.create({
    data: {
      name: 'Mt. Batur Sunrise Hike',
      description: 'Trek to the summit of an active volcano in the dark and watch the sunrise over Lake Batur and Mt. Agung.',
      type: 'ADVENTURE',
      defaultCost: 40.0,
      durationMinutes: 360,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      cityId: bali.id,
    },
  })

  // Create a Trip with stops
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

  // Add Activity to Day
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
