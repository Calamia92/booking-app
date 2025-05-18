import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.event.createMany({
        data: [
            { name: 'Concert Orelsan', capacity: 100 },
            { name: 'Salon Tech & IA', capacity: 200 },
            { name: 'Expo Monet', capacity: 150 },
        ],
    })

    console.log('✅ Seed terminé !')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
