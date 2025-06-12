// 📄 Cart.jsx (actualizado con Finalizar compra)
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const { carrito, quitarProducto, vaciarCarrito } = useCart()
  const { usuario } = useUser()
  const navigate = useNavigate()

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const finalizarCompra = async () => {
    if (!usuario) {
      alert('Debes iniciar sesión para finalizar la compra.')
      return navigate('/login')
    }

    try {
      const res = await fetch('http://localhost:3001/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario.id,
          carrito: carrito
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(`✅ Compra realizada con éxito. Orden #${data.orden_id}`)
        vaciarCarrito()
        navigate('/')
      } else {
        alert('❌ Error al finalizar la compra: ' + data.error)
      }
    } catch (err) {
      alert('❌ No se pudo conectar con el servidor')
    }
  }

  if (carrito.length === 0) {
    return <h2 style={{ padding: '20px' }}>Tu carrito está vacío 🛒</h2>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Carrito de compras</h2>
      {carrito.map(item => (
        <div key={item.id} style={styles.item}>
          <img src={item.imagen} alt={item.nombre} style={styles.img} />
          <div>
            <h4>{item.nombre}</h4>
            <p>Cantidad: {item.cantidad}</p>
            <p>Precio unitario: ${item.precio}</p>
            <p><strong>Total: ${(item.precio * item.cantidad).toFixed(2)}</strong></p>
            <button onClick={() => quitarProducto(item.id)} style={styles.btn}>Quitar</button>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: '20px' }}>Total a pagar: <span style={{ color: '#f57c00' }}>${total.toFixed(2)}</span></h3>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={vaciarCarrito} style={styles.vaciar}>Vaciar carrito</button>
        <button onClick={finalizarCompra} style={styles.finalizar}>Finalizar compra</button>
      </div>
    </div>
  )
}

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px'
  },
  img: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginRight: '20px',
    borderRadius: '10px'
  },
  btn: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  vaciar: {
    backgroundColor: '#888',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  finalizar: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default Cart