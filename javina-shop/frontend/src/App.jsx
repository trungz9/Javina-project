import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import CreateProduct from './pages/CreateProduct'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import OrderSuccess  from './pages/OrderSuccess'
import MyOrders      from './pages/MyOrders'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<Home />} />
        <Route path="/login"                 element={<Login />} />
        <Route path="/register"              element={<Register />} />
        <Route path="/products/:id"          element={<ProductDetail />} />
        <Route path="/products/create"       element={<CreateProduct />} />
        <Route path="/cart"                  element={<Cart />} />
        <Route path="/checkout"              element={<Checkout />} />
        <Route path="/order-success/:id"     element={<OrderSuccess />} />
        <Route path="/my-orders"             element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App