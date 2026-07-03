import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { FavoritesProvider } from './hooks/useFavorites'
import { LightboxProvider } from './hooks/useLightbox'
import NavBar from './components/common/NavBar'
import Footer from './components/common/Footer'
import Lightbox from './components/common/Lightbox'
import AiTravelAssistant from './components/common/AiTravelAssistant'
import Home from './routes/Home'
import Favorites from './routes/Favorites'
import Shopping from './routes/Shopping'

function AppShell() {
  const location = useLocation()
  const compactFooter = location.pathname === '/favorites'

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer compact={compactFooter} />
      <AiTravelAssistant />
      <Lightbox />
    </div>
  )
}

function App() {
  return (
    <FavoritesProvider>
      <LightboxProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </LightboxProvider>
    </FavoritesProvider>
  )
}

export default App
