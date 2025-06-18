// 📄 context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  useEffect(() => {
    const guardado = localStorage.getItem('carrito')
    if (guardado) {
      setCarrito(JSON.parse(guardado))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregarProducto = (producto) => {
    setCarrito(prev => {
      const yaExiste = prev.find(p => p.id === producto.id)
      if (yaExiste) {
        return prev.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      } else {
        return [...prev, { ...producto, cantidad: 1 }]
      }
    })
  }

  const agregarConReferido = (producto, referido_por) => {
    setCarrito(prev => {
      const yaExiste = prev.find(p => p.id === producto.id)
      if (yaExiste) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      } else {
        return [...prev, { ...producto, cantidad: 1, referido_por }]
      }
    })
  }

  const quitarProducto = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  return (
    <CartContext.Provider value={{ carrito, agregarProducto, agregarConReferido, quitarProducto, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}