import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import AuthModal from './auth/AuthModal.jsx'
import './index.css'

function Root() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <AuthModal />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)