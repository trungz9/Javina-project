import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './styles/global.css'
import './styles/components.css'  
import './styles/pages.css'  
import './index.css'
import './styles/theme.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)