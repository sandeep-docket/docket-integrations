import { Toaster } from 'react-hot-toast'
import { IntegrationsPage } from './integrations/IntegrationsPage'

function App() {
  const maintenanceModeValue = import.meta.env.VITE_MAINTENANCE_MODE ?? 'false'
  const isMaintenanceMode = typeof maintenanceModeValue === 'string'
    ? maintenanceModeValue.toLowerCase() === 'true'
    : Boolean(maintenanceModeValue)

  if (isMaintenanceMode) {
    const message = import.meta.env.VITE_MAINTENANCE_MESSAGE || 'Update in progress. Please check back soon.'
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">!</div>
          <h1 className="text-2xl font-semibold mb-2">We’ll be right back</h1>
          <p className="text-base">{message}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-full">
      <Toaster position="top-right" />
      <IntegrationsPage />
    </div>
  )
}

export default App
