import { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext(null)

// Simple hardcoded admin credentials — replace with Firebase Auth in production
const ADMIN_EMAIL = 'admin@docserve.ai'
const ADMIN_PASSWORD = 'admin123'

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true')

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      sessionStorage.setItem('isAdmin', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('isAdmin')
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
