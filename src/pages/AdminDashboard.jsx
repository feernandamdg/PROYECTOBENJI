import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser()
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
  const [entregados, setEntregados] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    tipo_cerveza: '',
    origen: '',
    pais: ''
  })

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        navigate('/')
      } else if (usuario.rol !== 'admin') {
        navigate('/')
      }
    }
  }, [cargando, usuario, navigate])

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/ordenes', {
          headers: { rol: usuario.rol }
        })
        const data = await res.json()
        if (res.ok) {
          setOrdenes(data)
        } else {
          console.error('❌ Error en servidor:', data)
        }
      } catch (err) {
        console.error('❌ Error al obtener pedidos:', err)
      }
    }

    const fetchEntregados = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/ordenes/entregadas', {
          headers: { rol: usuario.rol }
        })
        const data = await res.json()
        if (res.ok) {
          setEntregados(data)
        } else {
          console.error('Error cargando entregados:', data)
        }
      } catch (err) {
        console.error('Error al obtener entregados:', err)
      }
    }

    if (esAdmin) {
      fetchOrdenes()
      fetchEntregados()
    }
  }, [esAdmin, usuario])

  const entregarPedido = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/ordenes/entregar/${id}`, {
        method: 'POST',
        headers: { rol: usuario.rol }
      })

      if (!res.ok) throw new Error('Error al entregar el pedido')

      // Actualizar listas
      const nuevaOrdenes = ordenes.filter(o => o.id !== id)
      setOrdenes(nuevaOrdenes)

      const nuevosEntregados = await fetch('http://localhost:3001/api/admin/ordenes/entregadas', {
        headers: { rol: usuario.rol }
      })
      const data = await nuevosEntregados.json()
      if (nuevosEntregados.ok) {
        setEntregados(data)
      }

      alert('✅ Pedido entregado correctamente')
    } catch (err) {
      console.error(err)
      alert('❌ No se pudo entregar el pedido')
    }
  }

  const eliminarCompra = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/ordenes/entregadas/${id}`, {
        method: 'DELETE',
        headers: { rol: usuario.rol }
      })

      if (!res.ok) throw new Error('Error al eliminar compra')

      setEntregados(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      console.error(err)
      alert('❌ Error al eliminar compra')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMensaje('')
    try {
      const res = await fetch('http://localhost:3001/api/admin/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          rol: usuario.rol
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('✅ Producto agregado con ID ' + data.id)
        setForm({
          nombre: '',
          descripcion: '',
          precio: '',
          imagen: '',
          tipo_cerveza: '',
          origen: '',
          pais: ''
        })
      } else {
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  if (cargando) return <div style={{ padding: '20px' }}>Cargando...</div>

  if (!cargando && usuario?.rol !== 'admin') {
    return <div style={{ padding: '20px' }}>No tienes permisos de administrador</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🛠️ Panel de Administrador</h1>
      <p>Bienvenido, {usuario?.nombre}</p>

      <h2>📦 Pedidos recientes</h2>
      {ordenes.length === 0 ? (
        <p>No hay pedidos recientes</p>
      ) : (
        ordenes.map(o => (
          <div key={o.id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <h4>🧾 Orden #{o.id}</h4>
            <p><strong>Cliente:</strong> {o.cliente}</p>
            <p><strong>Fecha:</strong> {new Date(o.fecha).toLocaleString()}</p>
            <p><strong>Total:</strong> ${Number(o.total).toFixed(2)}</p>
            <ul>
              {o.productos.map((p, i) => (
                <li key={i}>{p.producto} x{p.cantidad} → ${p.precio.toFixed(2)}</li>
              ))}
            </ul>
            <button onClick={() => entregarPedido(o.id)} style={{ marginTop: '10px' }}>
              ✅ Entregar pedido
            </button>
          </div>
        ))
      )}

      <h2>📬 Pedidos entregados</h2>
      {entregados.length === 0 ? (
        <p>No hay pedidos entregados aún</p>
      ) : (
        entregados.map(o => (
          <div key={o.id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <h4>📦 Pedido #{o.orden_id}</h4>
            <p><strong>Cliente:</strong> {o.cliente}</p>
            <p><strong>Fecha:</strong> {new Date(o.fecha).toLocaleString()}</p>
            <p><strong>Total:</strong> ${Number(o.total).toFixed(2)}</p>
            <ul>
              {Array.isArray(o.productos)
                ? o.productos.map((p, i) => (
                  <li key={i}>{p.producto} x{p.cantidad} → ${p.precio.toFixed(2)}</li>
                ))
                : JSON.parse(o.productos).map((p, i) => (
                  <li key={i}>{p.producto} x{p.cantidad} → ${p.precio.toFixed(2)}</li>
                ))
              }
            </ul>
            <button onClick={() => eliminarCompra(o.id)} style={{ marginTop: '10px', background: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px' }}>
              🗑️ Eliminar compra
            </button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: '40px' }}>➕ Agregar nuevo producto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
        <input type="text" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
        <input type="text" placeholder="URL de imagen" value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} />
        <select value={form.tipo_cerveza} onChange={e => setForm({ ...form, tipo_cerveza: e.target.value })} required>
          <option value="">Tipo de cerveza</option>
          <option value="clara">Clara</option>
          <option value="obscura">Obscura</option>
        </select>
        <select value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })} required>
          <option value="">Origen</option>
          <option value="nacional">Nacional</option>
          <option value="internacional">Internacional</option>
        </select>
        <input type="text" placeholder="País" value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })} required />
        <button type="submit">Guardar producto</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  )
}

export default AdminDashboard
