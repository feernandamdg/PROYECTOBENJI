// 📄 App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'
import Afiliate from './pages/Afiliate'
import TuPrograma from './pages/TuPrograma'
import ProductoCompartido from './pages/ProductoCompartido'
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/afiliate" element={<Afiliate />} />
        <Route path="/tu-programa" element={<TuPrograma />} />
        <Route path="/producto-compartido" element={<ProductoCompartido />} />
        <Route
          path="/admin"
          element={
            <RutaProtegidaAdmin>
              <AdminDashboard />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </div>
  )
}

export default App
