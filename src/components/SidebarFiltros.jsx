import { useState } from 'react'

function SidebarFiltros({ onFiltro }) {
  const [filtros, setFiltros] = useState({
    tipo_cerveza: '',
    origen: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const nuevoFiltro = { ...filtros, [name]: filtros[name] === value ? '' : value }
    setFiltros(nuevoFiltro)
    onFiltro(nuevoFiltro)
  }

  return (
    <div style={styles.sidebar}>
      <h4>Filtrar por tipo</h4>
      <label><input type="checkbox" name="tipo_cerveza" value="clara" onChange={handleChange} checked={filtros.tipo_cerveza === 'clara'} /> Clara</label>
      <br />
      <label><input type="checkbox" name="tipo_cerveza" value="obscura" onChange={handleChange} checked={filtros.tipo_cerveza === 'obscura'} /> Obscura</label>

      <h4 style={{ marginTop: '15px' }}>Filtrar por origen</h4>
      <label><input type="checkbox" name="origen" value="nacional" onChange={handleChange} checked={filtros.origen === 'nacional'} /> Nacional</label>
      <br />
      <label><input type="checkbox" name="origen" value="internacional" onChange={handleChange} checked={filtros.origen === 'internacional'} /> Internacional</label>
    </div>
  )
}

const styles = {
  sidebar: {
    padding: '20px',
    backgroundColor: '#f3f3f3',
    borderRight: '1px solid #ccc',
    minWidth: '200px'
  }
}

export default SidebarFiltros