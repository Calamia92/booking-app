import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🧠 DDD — Event est enrichi ici avec un comportement métier : le taux de remplissage
// ✅ SRP : cette route ne fait qu’un seul calcul simple à partir des données existantes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    const event = await prisma.event.findUnique({
        where: { id: Number(id) },
        include: { bookings: true }
    })

    if (!event) {
        return res.status(404).json({ message: 'Événement introuvable' })
    }

    const fillRate = (event.bookings.length / event.capacity) * 100

    res.status(200).json({
        id: event.id,
        name: event.name,
        capacity: event.capacity,
        booked: event.bookings.length,
        fillRate: `${Math.round(fillRate)}%`
    })
}
