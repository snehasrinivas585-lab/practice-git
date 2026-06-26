import { useState } from 'react'
import { Sidebar, Topbar, AC } from './components/AdminShared'
import Dashboard   from './pages/ADashboard'
import AProducts   from './pages/AProducts'
import {
  ACategories, AOrders, ACustomers, APayments,
  ACoupons, AAnalytics, ADelivery, AReviews,
  ASettings, AAdmins,
} from './pages/APages'

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  products:   'Products',
  categories: 'Categories',
  orders:     'Orders',
  customers:  'Customers',
  payments:   'Payments',
  coupons:    'Coupons',
  analytics:  'Analytics',
  delivery:   'Delivery Tracking',
  reviews:    'Reviews',
  settings:   'Settings',
  admins:     'Admins',
}

export default function AdminDashboard({ user, onLogout }) {
  const [page, setPage]           = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard onNav={setPage} />
      case 'products':   return <AProducts />
      case 'categories': return <ACategories />
      case 'orders':     return <AOrders />
      case 'customers':  return <ACustomers />
      case 'payments':   return <APayments />
      case 'coupons':    return <ACoupons />
      case 'analytics':  return <AAnalytics />
      case 'delivery':   return <ADelivery />
      case 'reviews':    return <AReviews />
      case 'settings':   return <ASettings />
      case 'admins':     return <AAdmins />
      default:           return <Dashboard onNav={setPage} />
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: AC.beige,
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          title={PAGE_TITLES[page] || 'Dashboard'}
          onToggle={() => setCollapsed(c => !c)}
          user={user}
          onLogout={onLogout}
          onNav={setPage}
        />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
