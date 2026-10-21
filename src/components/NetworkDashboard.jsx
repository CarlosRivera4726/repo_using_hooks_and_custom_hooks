import React from 'react'

export function NetworkDashboard({ 
  isOnline, 
  isRealOnline, 
  isSimulated, 
  lastChanged, 
  pingLatency, 
  isChecking, 
  networkType, 
  toggleSimulateOffline, 
  checkConnection 
}) {
  const timeFormatted = lastChanged
    ? new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastChanged)
    : '--:--:--'

  return (
    <section className="instrument-strip" aria-label="Telemetría de conexión">
      {/* Barra de estado principal */}
      <div className="instrument-status-bar">
        <div className="status-indicator-cluster">
          <span 
            className={`hardware-led ${isOnline ? 'online' : 'offline'}`}
            aria-hidden="true"
          />
          <div>
            <span className="status-headline">
              {isOnline ? 'Conexión activa al navegador' : 'Sin conexión a internet'}
            </span>
            <span className="status-subtext">
              {isSimulated 
                ? '(modo de simulación forzada)' 
                : isRealOnline 
                  ? '(enlace real operativo)' 
                  : '(el navegador no detecta enlace)'}
            </span>
          </div>
        </div>

        {/* Conmutador táctil de simulación */}
        <div className="telemetry-switch-group">
          <span className="switch-label-meta">Simular desconexión:</span>
          <div 
            className="mechanical-switch" 
            onClick={toggleSimulateOffline}
            role="switch"
            aria-checked={isSimulated}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleSimulateOffline()
              }
            }}
            title="Alterna el estado simulado de offline sin desconectar tu red local"
          >
            <div className="switch-track">
              <span className={`switch-option ${!isSimulated ? 'active-online' : ''}`}>
                Normal
              </span>
              <span className={`switch-option ${isSimulated ? 'active-offline' : ''}`}>
                Offline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Celdas de lectura de instrumentos */}
      <div className="instrument-readouts">
        <div className="readout-cell">
          <div className="readout-label">Estado de la interfaz</div>
          <div className="readout-val">
            <span style={{ color: isOnline ? 'var(--signal-online)' : 'var(--signal-offline)' }}>
              {isOnline ? 'En línea' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="readout-cell">
          <div className="readout-label">Latencia estimada</div>
          <div className="readout-val">
            {isChecking ? (
              <span style={{ fontSize: '0.95rem', color: 'var(--text-mid)' }}>Midiendo...</span>
            ) : pingLatency !== null ? (
              <>
                <span>{pingLatency}</span>
                <span className="readout-unit">ms</span>
              </>
            ) : (
              <span style={{ fontSize: '0.95rem', color: 'var(--text-low)' }}>Sin medir</span>
            )}
            
            <button
              onClick={checkConnection}
              disabled={isChecking || !isOnline}
              className="btn-ping-action"
              title="Envía una petición liviana para medir el tiempo de respuesta"
            >
              {isChecking ? '...' : 'Probar'}
            </button>
          </div>
        </div>

        <div className="readout-cell">
          <div className="readout-label">Tipo de red</div>
          <div className="readout-val">
            <span>{networkType}</span>
            <span className="readout-unit">api</span>
          </div>
        </div>

        <div className="readout-cell">
          <div className="readout-label">Último cambio de estado</div>
          <div className="readout-val">
            <span>{timeFormatted}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
