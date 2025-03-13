import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { WindowContextProvider } from '@/lib/window/components/WindowContext'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <WindowContextProvider>
      <App />
    </WindowContextProvider>
  </React.StrictMode>
)
