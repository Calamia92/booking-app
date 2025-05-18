import { describe, it, expect } from 'vitest'

describe('booking logic', () => {
    it('should calculate correct fill rate', () => {
        const bookings = 30
        const capacity = 100
        const fillRate = `${Math.round((bookings / capacity) * 100)}%`
        expect(fillRate).toBe('30%')
    })
})
