import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser()
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
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

    if (esAdmin) {
      fetchOrdenes()
    }
  }, [esAdmin, usuario])

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

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando...</div>
  }

  if (!cargando && usuario && usuario.rol !== 'admin') {
    return <div style={{ padding: '20px' }}>No tienes permisos de administrador</div>
  }

  const th = {
    borderBottom: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left'
  }

  const td = {
    borderBottom: '1px solid #eee',
    padding: '8px'
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
          <div
            key={o.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 5px rgba(132, 69, 232, 0.1)'
            }}
          >
            <h3>🧾 Orden #{o.id}</h3>
            <p><strong>Cliente:</strong> {o.cliente}</p>
            <p><strong>Fecha:</strong> {new Date(o.fecha).toLocaleString()}</p>
            <p><strong>Total:</strong> ${Number(o.total || 0).toFixed(2)}</p>

            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Producto</th>
                  <th style={th}>Cantidad</th>
                  <th style={th}>Precio</th>
                </tr>
              </thead>
              <tbody>
                {o.productos.map((p, i) => (
                  <tr key={i}>
                    <td style={td}>{p.producto}</td>
                    <td style={td}>{p.cantidad}</td>
                    <td style={td}>${Number(p.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
