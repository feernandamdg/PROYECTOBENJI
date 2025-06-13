import { useCart } from '../context/CartContext'

function ProductCard({ producto }) {
  const { agregarProducto } = useCart()

  return (
    <div style={styles.card}>
      <img src={producto.imagen} alt={producto.nombre} style={styles.imagen} />
      
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>

      {/* Nueva información agregada */}
      <p><strong>Tipo:</strong> {producto.tipo_cerveza}</p>
      <p><strong>Origen:</strong> {producto.origen}</p>
      <p><strong>País:</strong> {producto.pais}</p>

      <p><strong>${Number(producto.precio).toFixed(2)}</strong></p>

      <button style={styles.boton} onClick={() => agregarProducto(producto)}>
        Añadir al carrito
      </button>
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
  }
}

export default ProductCard