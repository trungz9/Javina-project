import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import CreateProduct from './pages/CreateProduct'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import OrderSuccess  from './pages/OrderSuccess'
import MyOrders      from './pages/MyOrders'
import Dashboard     from './pages/Dashboard'
import ManageProducts from './pages/ManageProducts'
import ManageOrders  from './pages/ManageOrders'
import ShopProfile   from './pages/ShopProfile'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/products/:id"      element={<ProductDetail />} />
        <Route path="/products/create"   element={<CreateProduct />} />
        <Route path="/cart"              element={<Cart />} />
        <Route path="/checkout"          element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/my-orders"         element={<MyOrders />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/manage-products"   element={<ManageProducts />} />
        <Route path="/manage-orders"     element={<ManageOrders />} />
        <Route path="/shop-profile"      element={<ShopProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App