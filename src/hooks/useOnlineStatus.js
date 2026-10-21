import { useState, useEffect } from 'react'

/**
 * Custom Hook: useOnlineStatus
 * 
 * Permite a cualquier componente de React saber si el usuario
 * tiene conexión a internet activa, detectar cambios en tiempo real
 * y simular el estado offline para pruebas de interfaz.
 * 
 * @returns {Object} {
 *   isOnline: boolean,         // Estado efectivo (considera modo simulado)
 *   isRealOnline: boolean,     // Estado real del navegador (navigator.onLine)
 *   isSimulated: boolean,      // Si el modo simulación está activo
 *   lastChanged: Date | null,  // Momento del último cambio de conexión
 *   pingLatency: number | null,// Latencia estimada en milisegundos
 *   isChecking: boolean,       // Si se está realizando una prueba de ping
 *   networkType: string,       // Tipo de conexión (4g, wifi, etc.) si está soportado
 *   toggleSimulateOffline: fn, // Función para activar/desactivar simulación
 *   checkConnection: fn        // Función para forzar un ping a internet
 * }
 */
export function useOnlineStatus() {
  // Hook 1 dentro del custom hook: useState para almacenar los estados
  const [isRealOnline, setIsRealOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  })
  
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false)
  const [lastChanged, setLastChanged] = useState(() => new Date())
  const [pingLatency, setPingLatency] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [networkType, setNetworkType] = useState('Desconocido')

  // Hook 2 dentro del custom hook: useEffect para escuchar eventos del navegador
  useEffect(() => {
    // 1. Manejadores de eventos de la ventana
    const handleOnline = () => {
      setIsRealOnline(true)
      setLastChanged(new Date())
    }

    const handleOffline = () => {
      setIsRealOnline(false)
      setLastChanged(new Date())
    }

    // 2. Información de red adicional (Network Information API si está disponible)
    const updateNetworkInfo = () => {
      if ('connection' in navigator && navigator.connection) {
        const conn = navigator.connection
        setNetworkType(conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Banda ancha')
      } else {
        setNetworkType('Estándar')
      }
    }

    updateNetworkInfo()

    // 3. Suscripción a eventos globales del navegador
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('connection' in navigator && navigator.connection) {
      navigator.connection.addEventListener?.('change', updateNetworkInfo)
    }

    // 4. Limpieza (Cleanup): vital en useEffect para evitar fugas de memoria
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if ('connection' in navigator && navigator.connection) {
        navigator.connection.removeEventListener?.('change', updateNetworkInfo)
      }
    }
  }, []) // Arreglo vacío []: se ejecuta solo al montar el componente

  // Función para medir latencia real mediante un ping a un recurso público ligero
  const checkConnection = async () => {
    setIsChecking(true)
    const startTime = performance.now()
    try {
      // Usamos favicon con cache-busting para probar conexión HTTP real
      const response = await fetch(`https://httpbin.org/status/200?_t=${Date.now()}`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      })
      const latency = Math.round(performance.now() - startTime)
      setPingLatency(latency)
      setIsRealOnline(true)
      return { success: true, latency }
    } catch (err) {
      // Si falla la petición HTTP, no hay conexión real a internet
      const latency = Math.round(performance.now() - startTime)
      setPingLatency(null)
      setIsRealOnline(false)
      return { success: false, latency }
    } finally {
      setIsChecking(false)
    }
  }

  // Alternar modo de simulación offline
  const toggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev
      setLastChanged(new Date())
      return next
    })
  }

  // El estado online final: si la simulación está activa se fuerza offline, si no, el real
  const isOnline = isSimulatedOffline ? false : isRealOnline

  return {
    isOnline,
    isRealOnline,
    isSimulated: isSimulatedOffline,
    lastChanged,
    pingLatency,
    isChecking,
    networkType,
    toggleSimulateOffline,
    checkConnection,
  }
}
