import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductoCompartido() {
  const [params] = useSearchParams()
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const { agregarProducto } = useCart()

  const id = params.get('id')
  const ref = params.get('ref')

  useEffect(() => {
    const fetchProducto = async () => {
      setCargando(true)
      try {
        const res = await fetch(`http://localhost:3001/api/productos/${id}`)
        const data = await res.json()
        if (res.ok) {
          setProducto(data)
        } else {
          setError(data.error || 'No se pudo obtener el producto')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
      } finally {
        setCargando(false)
      }
    }

    if (id) fetchProducto()
    else setError('ID de producto no especificado')
  }, [id])

  const manejarAgregar = () => {
    if (!producto) return

    // Agregamos la propiedad referenciado
    const productoConRef = { ...producto, cantidad: 1, ref }

    // Guardar el ref en localStorage para que Cart.jsx lo use
    if (ref) localStorage.setItem('ref', ref)

    // ✅ Llamar correctamente al contexto
    agregarProducto(productoConRef)

    alert('🛒 Añadido al carrito correctamente')
  }

  if (cargando) return <p style={{ padding: 20 }}>Cargando producto...</p>
  if (error) return <p style={{ color: 'red', padding: 20 }}>{error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>{producto.nombre}</h1>
      <img src={producto.imagen} alt={producto.nombre} style={{ width: '300px', borderRadius: '10px' }} />
      <p><strong>Descripción:</strong> {producto.descripcion}</p>
      <p><strong>Tipo:</strong> {producto.tipo_cerveza}</p>
      <p><strong>Origen:</strong> {producto.origen}</p>
      <p><strong>País:</strong> {producto.pais}</p>
      <h3>💲${Number(producto.precio).toFixed(2)}</h3>
      <button onClick={manejarAgregar}>
        🛒 Añadir al carrito
      </button>
    </div>
  )
}

export default ProductoCompartido