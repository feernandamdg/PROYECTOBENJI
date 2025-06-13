import { useState } from 'react'

function SidebarFiltros({ onFiltro }) {
  const [filtros, setFiltros] = useState({
    tipo_cerveza: [],
    origen: []
  })

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target
    const valoresActuales = filtros[name]

    const nuevosValores = valoresActuales.includes(value)
      ? valoresActuales.filter(v => v !== value)
      : [...valoresActuales, value]

    const nuevosFiltros = {
      ...filtros,
      [name]: nuevosValores
    }

    setFiltros(nuevosFiltros)
    onFiltro(nuevosFiltros)
  }

  return (
    <div style={styles.sidebar}>
      <h4>Filtrar por tipo</h4>
      <label>
        <input
          type="checkbox"
          name="tipo_cerveza"
          value="clara"
          onChange={handleCheckboxChange}
          checked={filtros.tipo_cerveza.includes('clara')}
        /> Clara
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          name="tipo_cerveza"
          value="obscura"
          onChange={handleCheckboxChange}
          checked={filtros.tipo_cerveza.includes('obscura')}
        /> Obscura
      </label>

      <h4 style={{ marginTop: '15px' }}>Filtrar por origen</h4>
      <label>
        <input
          type="checkbox"
          name="origen"
          value="nacional"
          onChange={handleCheckboxChange}
          checked={filtros.origen.includes('nacional')}
        /> Nacional
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          name="origen"
          value="internacional"
          onChange={handleCheckboxChange}
          checked={filtros.origen.includes('internacional')}
        /> Internacional
      </label>
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