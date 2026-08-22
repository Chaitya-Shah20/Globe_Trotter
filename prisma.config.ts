import { defineConfig } from '@prisma/config'
import 'dotenv/config'

export default defineConfig({
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://globetrotter:password@localhost:5433/globetrotter_db?schema=public",
  },
})
