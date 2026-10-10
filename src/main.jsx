import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WeatherProvider } from './context/WeatherContext.jsx'
import { StageProvider } from './context/StageContext.jsx'
import './styles.css'

// HashRouter keeps page refreshes working on GitHub Pages (URLs look like /#/predict).
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <WeatherProvider>
          <StageProvider>
            <App />
          </StageProvider>
        </WeatherProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
)
