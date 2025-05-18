import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🧠 DDD — Ce module expose le contexte "Event" : affichage + taux de remplissage
// ✅ SRP : cette route ne fait que retourner les données, sans modifier l’état
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' })
    }

    const events = await prisma.event.findMany({
        include: {
            bookings: true
        }
    })

    const result = events.map(event => ({
        id: event.id,
        name: event.name,
        capacity: event.capacity,
        booked: event.bookings.length,
        fillRate: `${Math.round((event.bookings.length / event.capacity) * 100)}%`
    }))

    res.status(200).json(result)
}
