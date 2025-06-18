import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'

function Navbar() {
  const { usuario, logout } = useUser()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const manejarBusqueda = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      navigate(`/?q=${encodeURIComponent(busqueda.trim())}`)
      setBusqueda('')
    }
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🍺 <b>CheveMarket</b></div>
      <form onSubmit={manejarBusqueda} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar cerveza, tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>🔍</button>
      </form>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/carrito" style={styles.link}>Carrito</Link>

        {/* Mostrar "Afiliate" solo si el usuario NO es afiliado o no está logeado */}
        {(!usuario || !usuario.afiliado) && (
          <Link to="/afiliate" style={styles.link}>Afiliate</Link>
        )}

        {/* Mostrar "Tu programa" solo si el usuario está afiliado */}
        {usuario?.afiliado && (
          <Link to="/tu-programa" style={styles.link}>Tu programa</Link>
        )}

        {usuario ? (
          <>
            {usuario.rol === 'admin' && <Link to="/admin" style={styles.link}>Dashboard</Link>}
            <span style={styles.nombre}>Hola, {usuario.nombre}</span>
            <button onClick={logout} style={styles.logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Iniciar Sesión</Link>
            <Link to="/register" style={styles.link}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#f57c00',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white'
  },
  logo: { fontSize: '1.4em' },
  links: { display: 'flex', gap: '15px', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' },
  nombre: { fontWeight: 'bold' },
  logout: {
    backgroundColor: '#fff', color: '#f57c00', border: 'none', padding: '5px 10px',
    cursor: 'pointer', borderRadius: '5px'
  },
  searchForm: { display: 'flex', alignItems: 'center', gap: '5px' },
  searchInput: { padding: '5px', borderRadius: '4px', border: 'none', fontSize: '1em' },
  searchButton: {
    padding: '5px 10px', borderRadius: '4px', border: 'none',
    backgroundColor: '#fff', color: '#f57c00', cursor: 'pointer', fontWeight: 'bold'
  }
}

export default Navbar