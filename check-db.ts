import prisma from './src/lib/db'

async function main() {
  const count = await prisma.activity.count()
  console.log('Total activities:', count)
  
  const cities = await prisma.city.findMany({
    include: { _count: { select: { activities: true } } }
  })
  console.log('Cities:', cities.map(c => `${c.name}: ${c._count.activities}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
