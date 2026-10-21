import React, { useState, useEffect } from 'react'

export function NotesSyncDemo({ isOnline }) {
  // useState: mantiene el borrador y la colección de registros
  const [draft, setDraft] = useState('')
  const [isFlushing, setIsFlushing] = useState(false)
  const [entries, setEntries] = useState([
    {
      id: 1,
      text: 'Nota inicial cargada en la sesión',
      status: 'synced',
      time: '10:14:02',
    },
    {
      id: 2,
      text: 'Cambia el interruptor a "Offline" para probar el guardado local',
      status: 'synced',
      time: '10:15:20',
    },
  ])

  // useEffect: sincroniza las notas pendientes cuando isOnline pasa a true
  useEffect(() => {
    const pendingEntries = entries.filter((e) => e.status === 'pending')

    if (isOnline && pendingEntries.length > 0) {
      setIsFlushing(true)

      const flushTimer = setTimeout(() => {
        setEntries((prev) =>
          prev.map((item) =>
            item.status === 'pending' ? { ...item, status: 'synced' } : item
          )
        )
        setIsFlushing(false)
      }, 700)

      return () => clearTimeout(flushTimer)
    }
  }, [isOnline, entries])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return

    const now = new Date()
    const time = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const newEntry = {
      id: Date.now(),
      text: draft.trim(),
      status: isOnline ? 'synced' : 'pending',
      time,
    }

    setEntries((prev) => [newEntry, ...prev])
    setDraft('')
  }

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id))
  }

  const pendingCount = entries.filter((item) => item.status === 'pending').length

  return (
    <div className="buffer-pane">
      <div className="pane-header">
        <div>
          <h2 className="pane-title">Búfer local de mensajes</h2>
          <p className="pane-desc">
            Prueba de guardado diferido: escribe sin conexión y observa cómo <code>useEffect</code> vacía la cola al reconectar.
          </p>
        </div>

        <div className={`queue-badge ${pendingCount > 0 ? 'has-pending' : ''}`}>
          {isFlushing
            ? 'Sincronizando...'
            : pendingCount > 0
              ? `${pendingCount} en cola`
              : 'Cola al día'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="composer-row">
        <input
          type="text"
          className="composer-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            isOnline
              ? 'Escribe un apunte para guardar en red...'
              : 'Escribe sin red (se guardará en el búfer local)...'
          }
          aria-label="Contenido del apunte"
        />
        <button
          type="submit"
          className="btn-dispatch"
          disabled={!draft.trim()}
        >
          {isOnline ? 'Guardar' : 'Encolar'}
        </button>
      </form>

      <div className="buffer-stream" role="log" aria-live="polite">
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-low)', fontSize: '0.86rem' }}>
            No hay apuntes en el búfer. Añade uno arriba.
          </div>
        ) : (
          entries.map((item) => (
            <div key={item.id} className="stream-item">
              <div className="item-left">
                <span
                  className={`item-indicator ${item.status}`}
                  aria-hidden="true"
                />
                <span className="item-text">{item.text}</span>
                <span className="item-time">{item.time}</span>
              </div>

              <div className="item-right">
                <span className={`tag-status ${item.status}`}>
                  {item.status === 'synced' ? 'guardado' : 'en espera'}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="btn-remove-item"
                  title="Eliminar registro"
                  aria-label={`Eliminar apunte: ${item.text}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
