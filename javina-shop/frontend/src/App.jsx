import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import CreateProduct from './pages/CreateProduct'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/products/:id"    element={<ProductDetail />} />
        <Route path="/products/create" element={<CreateProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App