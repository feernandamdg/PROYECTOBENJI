import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import SidebarFiltros from '../components/SidebarFiltros'

function Home() {
  const { carrito } = useCart()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const obtenerProductos = async (filtros = {}) => {
    setCargando(true)
    setError('')
    try {
      const query = new URLSearchParams()
      if (filtros.tipo_cerveza) query.append('tipo_cerveza', filtros.tipo_cerveza)
      if (filtros.origen) query.append('origen', filtros.origen)

      const res = await fetch(`http://localhost:3001/api/productos?${query.toString()}`)
      const data = await res.json()
      setProductos(data)
    } catch (err) {
      console.error('Error al obtener productos:', err)
      setError('No se pudieron cargar los productos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerProductos()
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <SidebarFiltros onFiltro={obtenerProductos} />

      <div style={styles.contenedor}>
        <h1>Bienvenido a CheveMarket 🍻</h1>
        {cargando ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={styles.galeria}>
            {productos.map(p => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  contenedor: {
    padding: '20px',
    flexGrow: 1
  },
  galeria: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px'
  }
}

export default Home