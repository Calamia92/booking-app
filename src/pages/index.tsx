import { useEffect, useState } from 'react'

type Event = {
  id: number
  name: string
  capacity: number
  booked: number
  fillRate: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    const res = await fetch('/api/events')
    const data = await res.json()
    setEvents(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleBook = async (eventId: number) => {
    setLoadingId(eventId)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Erreur')
      } else {
        setMessage(data.message)
        await fetchEvents()
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoadingId(null)
    }
  }

  return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎟️ Réserver un événement</h1>

        {message && <p style={{ color: 'green' }}>✅ {message}</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {events.map(event => {
            const full = event.booked >= event.capacity
            return (
                <div key={event.id} style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: full ? '#fcebea' : '#f8f9fa'
                }}>
                  <h2 style={{ margin: 0 }}>{event.name}</h2>
                  <p style={{ margin: '0.5rem 0' }}>
                    Remplissage : <strong>{event.fillRate}</strong> ({event.booked}/{event.capacity})
                  </p>
                  <button
                      onClick={() => handleBook(event.id)}
                      disabled={loadingId === event.id || full}
                      style={{
                        backgroundColor: full ? '#ccc' : '#0070f3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: full ? 'not-allowed' : 'pointer'
                      }}
                  >
                    {full ? 'Complet' : loadingId === event.id ? 'Réservation...' : 'Réserver'}
                  </button>
                </div>
            )
          })}
        </div>
      </main>
  )
}
