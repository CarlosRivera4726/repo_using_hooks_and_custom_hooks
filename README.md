# ⚡ React Hooks & Custom Hook Explorer (Vite + React)

Proyecto práctico y moderno que demuestra el uso de **dos hooks fundamentales de React** (`useState` y `useEffect`) y **un custom hook** (`useOnlineStatus`) para monitorear el estado de la conexión a internet en tiempo real.

---

## 🎯 ¿Qué incluye este proyecto?

### 1. Custom Hook: `useOnlineStatus`
Ubicación: [`src/hooks/useOnlineStatus.js`](file:///c:/Users/Carlos/Documents/GitHub/repo_using_hooks_and_custom_hooks/src/hooks/useOnlineStatus.js)
- Escucha los eventos globales `online` y `offline` de la ventana (`window.addEventListener`).
- Provee una función de limpieza (`cleanup`) en el return del `useEffect` para evitar fugas de memoria.
- Ofrece soporte para **simulación de corte de red** con un solo clic, permitiendo probar la interfaz sin apagar el Wi-Fi físico.
- Permite medir la latencia real mediante un test de ping.

### 2. Hook Estándar 1: `useState`
- Mantiene el estado de las notas/tareas en memoria reactiva.
- Controla el texto del formulario de notas y los estados de carga.
- Maneja la navegación por pestañas en la aplicación.

### 3. Hook Estándar 2: `useEffect`
- **Sincronización automática:** Detecta cuando el estado `isOnline` pasa de `false` a `true`, vacía la cola de notas pendientes y las sincroniza automáticamente.
- **Actualización reactiva del DOM:** Actualiza el `document.title` dinámicamente con un indicador visual (`🟢 En Línea` o `🔴 Modo Desconectado`).
- **Limpieza de timers:** Cancela temporizadores si el componente se desmonta.

---

## 🚀 Ejecución local

1. Instalar dependencias (si aún no lo has hecho):
```bash
npm install
```

2. Iniciar el servidor de desarrollo Vite:
```bash
npm run dev
```

3. Abrir en tu navegador:
```
http://localhost:5173/
```

4. Construir para producción:
```bash
npm run build
```

---

## 📂 Estructura de Archivos

```
repo_using_hooks_and_custom_hooks/
├── index.html                      # HTML con fuentes Google Fonts (Plus Jakarta Sans)
├── package.json                    # Dependencias: React 19, Lucide Icons, Vite
├── src/
│   ├── App.jsx                     # Componente principal que orquesta los hooks
│   ├── index.css                   # Sistema de diseño moderno oscuro con glassmorphism
│   ├── main.jsx                    # Punto de entrada de React
│   ├── hooks/
│   │   └── useOnlineStatus.js      # Custom Hook de detección de conexión
│   └── components/
│       ├── NetworkDashboard.jsx    # Tablero de métricas de red y ping
│       ├── NotesSyncDemo.jsx       # Demostración interactiva de sincronización offline/online
│       └── HooksExplainer.jsx      # Explicador pedagógico con visor de código
└── README.md
```
