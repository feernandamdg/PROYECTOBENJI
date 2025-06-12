import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Navbar() {
  const { usuario, logout } = useUser()

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🍺 <b>CheveMarket</b></div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/carrito" style={styles.link}>Carrito</Link>

        {usuario ? (
          <>
            {/* Mostrar Dashboard solo si el usuario es admin */}
            {usuario.rol === 'admin' && (
              <Link to="/admin" style={styles.link}>Dashboard</Link>
            )}
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
  logo: {
    fontSize: '1.4em'
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  nombre: {
    fontWeight: 'bold'
  },
  logout: {
    backgroundColor: '#fff',
    color: '#f57c00',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px'
  }
}

export default Navbar