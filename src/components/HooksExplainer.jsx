import React, { useState } from 'react'

export function HooksExplainer() {
  const [selectedHook, setSelectedHook] = useState('custom')

  const content = {
    custom: {
      role: 'Abstracción reutilizable',
      title: 'useOnlineStatus.js',
      description:
        'Encapsula la lógica de los eventos online/offline de la ventana en una sola llamada limpia. Cualquier componente del árbol puede consultar el estado sin duplicar suscripciones al navegador.',
      code: `export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    () => navigator.onLine
  )

  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return { isOnline }
}`,
    },
    state: {
      role: 'Hook nativo 1',
      title: 'useState(initialValue)',
      description:
        'Almacena el texto del borrador actual y la lista de mensajes en memoria reactiva. Cuando se invoca la función actualizadora, React sincroniza el DOM con el nuevo valor sin recargar la página.',
      code: `// En NotesSyncDemo.jsx
const [draft, setDraft] = useState('')
const [entries, setEntries] = useState([])

// Añade un nuevo elemento al inicio
const add = (item) => {
  setEntries((prev) => [item, ...prev])
  setDraft('')
}`,
    },
    effect: {
      role: 'Hook nativo 2',
      title: 'useEffect(setup, dependencies)',
      description:
        'Gestiona efectos secundarios: la suscripción a eventos de ventana en el custom hook, la actualización del título del documento y el vaciado automático de la cola cuando se restablece la conexión.',
      code: `// Reacciona al cambio de conexión
useEffect(() => {
  const pending = entries.filter(e => e.status === 'pending')

  if (isOnline && pending.length > 0) {
    // Sincroniza con el servidor
    flushQueue(pending)
  }
}, [isOnline, entries])`,
    },
  }

  const current = content[selectedHook]

  return (
    <div className="hook-inspector-pane">
      <div className="inspector-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedHook === 'custom'}
          onClick={() => setSelectedHook('custom')}
          className={`inspector-tab-btn ${selectedHook === 'custom' ? 'active' : ''}`}
        >
          Custom Hook
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedHook === 'state'}
          onClick={() => setSelectedHook('state')}
          className={`inspector-tab-btn ${selectedHook === 'state' ? 'active' : ''}`}
        >
          useState
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedHook === 'effect'}
          onClick={() => setSelectedHook('effect')}
          className={`inspector-tab-btn ${selectedHook === 'effect' ? 'active' : ''}`}
        >
          useEffect
        </button>
      </div>

      <div className="hook-explanation-body">
        <div>
          <div className="hook-role-label">{current.role}</div>
          <div className="hook-concept-title">{current.title}</div>
        </div>

        <p className="hook-description">{current.description}</p>

        <pre className="code-block">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  )
}
