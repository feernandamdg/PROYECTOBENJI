// 📄 src/pages/TuPrograma.jsx
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'

function TuPrograma() {
  const { usuario } = useUser()
  const [historial, setHistorial] = useState([])
  const [retiros, setRetiros] = useState([])
  const [ganancias, setGanancias] = useState(null)
  const [clabe, setClabe] = useState('')

  const cargarDatos = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/referidos/${usuario.id}`)
      const data = await res.json()
      if (res.ok) {
        setHistorial(data.historial)
        setGanancias(parseFloat(data.totalGanado))
      }

      const resRetiros = await fetch(`http://localhost:3001/api/users/retiros/${usuario.id}`)
      const dataRetiros = await resRetiros.json()
      if (resRetiros.ok) {
        setRetiros(dataRetiros.retiros)
      }
    } catch {
      alert('❌ Error al cargar información del programa')
    }
  }

  useEffect(() => {
    if (usuario?.id) cargarDatos()
  }, [usuario])

  const manejarRetiro = async () => {
    if (!clabe || clabe.length !== 18) {
      return alert('⚠️ Ingresa una CLABE válida de 18 dígitos')
    }

    const confirmacion = window.confirm('¿Deseas retirar tus ganancias? Esta acción eliminará el historial actual.')

    if (!confirmacion) return

    try {
      const res = await fetch(`http://localhost:3001/api/users/retirar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ afiliado_id: usuario.id, clabe })
      })

      const data = await res.json()
      if (res.ok) {
        alert(`✅ Retiro realizado por $${Number(data.monto).toFixed(2)} con éxito`)
        setClabe('')
        cargarDatos()
      } else {
        alert('❌ Error al retirar: ' + data.error)
      }
    } catch {
      alert('❌ No se pudo conectar con el servidor')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>💼 Tu programa de afiliados</h2>

      <h3>Ganancias por referidos: ${Number(ganancias || 0).toFixed(2)}</h3>

      <div style={{ marginTop: '20px' }}>
        <label>CLABE interbancaria:</label><br />
        <input
          type="text"
          value={clabe}
          onChange={(e) => setClabe(e.target.value)}
          placeholder="Ingresa tu CLABE"
          maxLength="18"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={manejarRetiro} style={{ padding: '8px 15px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>
          Retirar ganancias
        </button>
      </div>

      <h3 style={{ marginTop: '30px' }}>🛒 Productos que compraron con tu enlace:</h3>
      <ul>
        {historial.length === 0
          ? <li>No hay compras registradas aún</li>
          : historial.map((p, i) => (
              <li key={i}>
                Producto ID #{p.producto_id} - ${Number(p.monto).toFixed(2)} - {new Date(p.fecha).toLocaleString()}
              </li>
            ))}
      </ul>

      <h3 style={{ marginTop: '30px' }}>💳 Historial de movimientos</h3>
      <ul>
        {retiros.length === 0
          ? <li>Aún no has retirado ganancias</li>
          : retiros.map((r, i) => (
              <li key={i}>
                Retiro de ${Number(r.monto).toFixed(2)} a CLABE ****{r.clabe.slice(-4)} el {new Date(r.fecha).toLocaleString()}
              </li>
            ))}
      </ul>
    </div>
  )
}

export default TuPrograma