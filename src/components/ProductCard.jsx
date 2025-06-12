import { useCart } from '../context/CartContext'

function ProductCard({ producto }) {
  const { agregarProducto } = useCart()

  const imagenMostrada = producto.imagen || 'https://via.placeholder.com/250x200?text=Sin+imagen'

  return (
    <div style={styles.card}>
      <img src={imagenMostrada} alt={producto.nombre} style={styles.imagen} />
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p><strong>${parseFloat(producto.precio).toFixed(2)}</strong></p>
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