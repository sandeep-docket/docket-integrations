import { Toaster } from 'react-hot-toast'
import { IntegrationsPage } from './integrations/IntegrationsPage'

function App() {
  return (
    <div className="min-h-full">
      <Toaster position="top-right" />
      <IntegrationsPage />
    </div>
  )
}

export default App
