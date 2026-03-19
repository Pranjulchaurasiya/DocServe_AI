import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Payment from './pages/Payment'
import OrderStatus from './pages/OrderStatus'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { AdminAuthProvider } from './context/AdminAuthContext'

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/order-status" element={<OrderStatus />} />
              <Route path="/profile/:orderId" element={<Profile />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AdminAuthProvider>
  )
}
