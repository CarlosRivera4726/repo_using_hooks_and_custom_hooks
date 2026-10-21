import React, { useEffect } from 'react'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { NetworkDashboard } from './components/NetworkDashboard'
import { NotesSyncDemo } from './components/NotesSyncDemo'
import { HooksExplainer } from './components/HooksExplainer'

function App() {
  // Custom Hook: gestiona la conexión a internet y el modo de simulación
  const {
    isOnline,
    isRealOnline,
    isSimulated,
    lastChanged,
    pingLatency,
    isChecking,
    networkType,
    toggleSimulateOffline,
    checkConnection,
  } = useOnlineStatus()

  // Hook nativo useEffect: actualiza el título del documento según el estado
  useEffect(() => {
    document.title = isOnline 
      ? 'En línea — Laboratorio de Hooks' 
      : 'Desconectado — Laboratorio de Hooks'
  }, [isOnline])

  return (
    <>
      {/* Barra de cabecera sobria y técnica */}
      <header className="top-nav">
        <div className="workbench-container top-nav-inner">
          <div className="project-brand">
            <span className="brand-name">React Hooks Workbench</span>
            <span className="brand-version">v1.0 &bull; Vite</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span 
              className={`hardware-led ${isOnline ? 'online' : 'offline'}`} 
              aria-hidden="true" 
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-mid)', fontWeight: 500 }}>
              {isOnline ? 'Enlace activo' : 'Enlace interrumpido'}
            </span>
          </div>
        </div>
      </header>

      {/* Cuerpo principal */}
      <main className="workbench-container workspace-main">
        {/* Cabecera editorial */}
        <section className="editorial-header">
          <h1>Laboratorio de estado y tolerancia a fallos de red</h1>
          <p>
            Demostración práctica de cómo combinar dos hooks nativos (<code>useState</code> y <code>useEffect</code>) con un hook personalizado (<code>useOnlineStatus</code>) para crear una interfaz reactiva que preserva datos y se sincroniza al restablecer la red.
          </p>
        </section>

        {/* Tira de telemetría de red */}
        <NetworkDashboard
          isOnline={isOnline}
          isRealOnline={isRealOnline}
          isSimulated={isSimulated}
          lastChanged={lastChanged}
          pingLatency={pingLatency}
          isChecking={isChecking}
          networkType={networkType}
          toggleSimulateOffline={toggleSimulateOffline}
          checkConnection={checkConnection}
        />

        {/* Cuadrícula de trabajo: Buffer Interactivo a la izquierda, Inspector de Hooks a la derecha */}
        <div className="workbench-grid">
          <NotesSyncDemo isOnline={isOnline} />
          <HooksExplainer />
        </div>

        {/* Pie técnico */}
        <footer className="footer-note">
          <div>
            Construido con React 19 y Vite &bull; Sin dependencias pesadas de estilos
          </div>
          <div>
            Código fuente modular en <code>src/hooks/</code> y <code>src/components/</code>
          </div>
        </footer>
      </main>
    </>
  )
}

export default App
