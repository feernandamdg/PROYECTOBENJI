import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function Afiliate() {
  const { usuario } = useUser()
  const navigate = useNavigate()

  const afiliarse = async () => {
    if (!usuario) {
      return navigate('/register')
    }

    try {
      const res = await fetch('http://localhost:3001/api/users/afiliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuario.id })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error en afiliación')
      }

      alert('✅ Gracias por afiliarte. Bienvenido al programa.')
      window.location.href = '/'
    } catch (err) {
      console.error(err)
      alert('❌ Error al conectar con el servidor')
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Bienvenido a nuestro programa de afiliados</h1>
      <ol>
        <li>Comparte los productos con tus amigos</li>
        <li>Genera ingresos compartiendo productos</li>
        <li>Recibe parte de las ganancias cuando compren con tu enlace</li>
        <li>Gana dinero extra sin esfuerzo</li>
      </ol>
      <button
        onClick={afiliarse}
        style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Afíliate ahora
      </button>
    </div>
  )
}

export default Afiliate