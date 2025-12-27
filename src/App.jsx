import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Dashboard from './components/Dashboard'
import Analytics from './pages/Analytics'
import Habits from './pages/Habits'
import HabitForm from './pages/HabitForm'
import { NotificationService } from './services/notifications'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Request notification permission on mount
    NotificationService.requestPermission()

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <Auth />}
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/habits"
          element={user ? <Habits /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/habits/new"
          element={user ? <HabitForm /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/habits/:id/edit"
          element={user ? <HabitForm /> : <Navigate to="/auth" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
