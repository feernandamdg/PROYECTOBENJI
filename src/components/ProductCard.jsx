import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'

function ProductCard({ producto }) {
  const { agregarProducto } = useCart()
  const { usuario, esAfiliado } = useUser()

  const handleCompartir = () => {
    if (!usuario?.codigo_afiliado) return

    const url = `${window.location.origin}/producto-compartido?ref=${usuario.codigo_afiliado}&id=${producto.id}`
    navigator.clipboard.writeText(url)
    .then(() => alert('📎 Enlace copiado: ' + url))
    .catch(() => alert('❌ No se pudo copiar el enlace'))

  }

  return (
    <div style={styles.card}>
      <img src={producto.imagen} alt={producto.nombre} style={styles.imagen} />
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p><strong>Tipo:</strong> {producto.tipo_cerveza}</p>
      <p><strong>Origen:</strong> {producto.origen}</p>
      <p><strong>País:</strong> {producto.pais}</p>
      <p><strong>${Number(producto.precio).toFixed(2)}</strong></p>

      <button style={styles.boton} onClick={() => agregarProducto(producto)}>
        Añadir al carrito
      </button>

      {esAfiliado && (
        <button style={styles.compartir} onClick={handleCompartir}>
          🔗 Compartir
        </button>
      )}
    </div>
  )
}

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    width: '250px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
  },
  imagen: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  boton: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#f57c00',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  compartir: {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#2196f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default ProductCard