import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🧠 DDD — Bounded Context : ici le "Booking" est géré dans son propre contexte
// 🧠 Ubiquitous Language : on utilise les termes métier exacts ("event", "capacity", "booking")
// ✅ SRP (Single Responsibility Principle) : cette fonction ne fait qu'une seule chose : réserver une place
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Méthode non autorisée' })
        }

        const { eventId } = req.body
        if (!eventId) {
            return res.status(400).json({ message: 'eventId manquant' })
        }

        const event = await prisma.event.findUnique({
            where: { id: Number(eventId) },
            include: { bookings: true }
        })

        if (!event) {
            return res.status(404).json({ message: 'Événement introuvable' })
        }

        if (event.bookings.length >= event.capacity) {
            console.warn(`⚠️ Tentative de réservation sur un événement complet : ${event.name}`)
            return res.status(400).json({ message: 'Événement complet' })
        }

        const booking = await prisma.booking.create({
            data: { eventId: event.id }
        })

        res.status(201).json({ message: 'Réservation confirmée', booking })

    } catch (error) {
        console.error('❌ Erreur lors de la réservation :', error)
        res.status(500).json({ message: 'Erreur serveur inattendue' })
    }
}

