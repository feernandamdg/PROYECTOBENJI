import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  // Restaurar usuario desde localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  async function login({ email, password }) {
    try {
      if (!email || !password) {
        throw new Error('Correo y contraseña son requeridos')
      }

      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      setUsuario(data.usuario)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  async function register(nombre, email, password) {
    const nuevoUsuario = { nombre, email, rol: 'cliente' }
    setUsuario(nuevoUsuario)
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
  }

  return (
    <UserContext.Provider value={{ usuario, login, logout, register }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}