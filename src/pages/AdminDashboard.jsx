import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser() // ✅ Agregar cargando
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '' })
  const [mensaje, setMensaje] = useState('')

  // 🔍 DEBUG
  console.log('🔍 AdminDashboard - cargando:', cargando)
  console.log('🔍 AdminDashboard - usuario:', usuario)
  console.log('🔍 AdminDashboard - usuario?.rol:', usuario?.rol)
  console.log('🔍 AdminDashboard - esAdmin:', esAdmin)

  // ✅ Solo redirigir después de cargar Y verificar que el usuario existe
  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        console.log('❌ No hay usuario, redirigiendo...')
        navigate('/')
      } else if (usuario.rol !== 'admin') {
        console.log('❌ No es admin, rol:', usuario.rol)
        navigate('/')
      }
    }
  }, [cargando, usuario, navigate])

  useEffect(() => {
    // ✅ Solo hacer fetch si es admin
    if (esAdmin) {
      fetch('http://localhost:3001/api/admin/ordenes', {
        headers: {
          'rol': usuario.rol // ✅ Enviar rol en headers
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error('Error del servidor')
          }
        })
        .then(data => {
          if (res.ok) {
            setOrdenes(data)
          } else {
            console.error('Error del servidor:', data)
          }
        })
        .catch(err => console.error('Error al obtener pedidos:', err))
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
          'rol': usuario.rol // ✅ Enviar rol en headers
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('✅ Producto agregado con ID ' + data.id)
        setForm({ nombre: '', descripcion: '', precio: '', imagen: '' })
      } else {
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  // ✅ Mostrar loading mientras carga
  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando...</div>
  }

  // ✅ Mostrar mensaje si no es admin (antes de redirigir)
  if (!cargando && usuario && usuario.rol !== 'admin') {
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
          <div key={o.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <p><strong>Orden #{o.id}</strong> - {o.cliente} ({new Date(o.fecha).toLocaleString()})</p>
            <ul>
              {o.productos.map((prod, i) => (
                <li key={i}>{prod.producto} x{prod.cantidad} - ${prod.precio}</li>
              ))}
            </ul>
          </div>
        ))
      )}

      <h2 style={{ marginTop: '40px' }}>➕ Agregar nuevo producto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
        <input type="text" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
        <input type="text" placeholder="URL de imagen" value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })} />
        <button type="submit">Guardar producto</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  )
}

export default AdminDashboard