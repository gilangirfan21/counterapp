import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const init = useAuthStore((state) => state.init)
  const initialized = useAuthStore((state) => state.initialized)

  useEffect(() => {
    init()
  }, [init])

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <p className="text-sm text-neutral-500">Memuat...</p>
      </div>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}
