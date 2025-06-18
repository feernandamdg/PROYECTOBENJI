// 📄 context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  async function login({ email, password }) {
    try {
      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      setUsuario(data.usuario)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  async function register(nombre, email, password) {
    const nuevoUsuario = { nombre, email, rol: 'cliente', afiliado: false }
    setUsuario(nuevoUsuario)
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
  }

  async function afiliarUsuario(id) {
    try {
      const res = await fetch('http://localhost:3001/api/users/afiliar', {
        method: 'POST',
        headers: { id }
      })
      if (!res.ok) throw new Error()
      const actualizado = { ...usuario, afiliado: true }
      setUsuario(actualizado)
      localStorage.setItem('usuario', JSON.stringify(actualizado))
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  const esAdmin = usuario?.rol === 'admin'
  const esAfiliado = usuario?.afiliado === true

  return (
    <UserContext.Provider value={{ usuario, login, logout, register, esAdmin, esAfiliado, cargando, afiliarUsuario }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}