import { useState, useEffect, useRef } from 'react'
import { products as localProducts } from './data'
import { useCart } from './context/CartContext'
import { CartProvider } from './context/CartContext'
import { useAuth } from './auth/AuthContext'
import { AuthProvider } from './auth/AuthContext'
import { WishlistProvider, useWishlist } from './context/WishlistContext'
import AuthModal from './auth/AuthModal'
import UserMenu from './auth/UserMenu'
import ProductCard from './components/ProductCard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Failure from './pages/Failure'
import Products from './pages/Products'
import Wishlist from './pages/Wishlist'
import CustomerPortal from './pages/CustomerPortal'
import AdminDashboard from './admin/AdminDashboard'
import EditProfile from './pages/EditProfile'
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from './pages/Settings'

// ── Color tokens ─────────────────────────────────────────────────
const C = {
  maroon:  '#3D0000',
  darkRed: '#6B0F0F',
  crimson: '#8B1A1A',
  gold:    '#C9A84C',
  goldL:   '#E8C97A',
  cream:   '#F5ECD7',
  brown:   '#2A1005',
  offWhite:'#FAF7F2',
  white:   '#FFFFFF',
}

// ── Image paths (from public/images/) ────────────────────────────
const IMG = {
  logo:    '/images/logo.png',
  hero1:   '/images/hero1.jpeg',
  hero2:   '/images/hero2.jpeg',
  hero3:   '/images/hero3.jpeg',
  hero4:   '/images/hero4.jpeg',
  nonveg:  '/images/nonveg-pickle.png',
  chicken: '/images/chicken-pickle.webp',
  ginger:  '/images/ginger-pickle.jpg',
  ariselu: '/images/ariselu.jpg',
  atukula: '/images/atukula-mixture.webp',
  murukku: '/images/murukku.jpg',
  sweets2: '/images/sweets2.webp',
  combo:   '/images/combo.png',
  boneChicken: encodeURI('/images/bone chicken pickle.jpg'),
prawns:      '/images/prawnspickle.webp',
mutton:      '/images/MuttonPickle.jpg',
}

// ── Data ─────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { img: IMG.hero1, label: 'Traditional Pickles', pos: 'center 40%',  size: 'cover' },
  { img: IMG.hero2, label: 'Hot & Snacks',         pos: 'center 55%',  size: 'cover' },
  { img: IMG.hero3, label: 'Festival Sweets',      pos: 'center 35%',  size: '110% auto' },
  { img: IMG.hero4, label: 'Pickle Collection',    pos: 'center 45%',  size: 'cover' },
]

const NAV_LINKS = ['Home','Categories','Best Sellers','Products','About Us','Gallery','Reviews','Contact']

const CATEGORIES = [
  { name: 'Veg Pickles',     tag: 'Pure & Healthy',   img: IMG.ginger  },
  { name: 'Non-Veg Pickles', tag: 'Rich & Spicy',     img: IMG.nonveg  },
  { name: 'Sweets',          tag: 'Traditional Taste', img: IMG.ariselu },
  { name: 'Hot & Snacks',    tag: 'Crispy & Tasty',   img: IMG.atukula },
]

const WHY_ITEMS = [
  {
    title: 'Homemade Recipes',
    desc:  'Crafted in small batches using generations-old family recipes.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'No Preservatives',
    desc:  '100% natural — no artificial colors, additives, or preservatives.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    title: 'Fresh Ingredients',
    desc:  'Carefully sourced fresh produce and hand-picked spices.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12c0-2.76 1.12-5.26 2.93-7.07"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    title: 'Traditional Taste',
    desc:  'Authentic regional flavors just like grandmother\'s kitchen.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    title: 'Hygienic Preparation',
    desc:  'Prepared in a clean, safe environment with strict food-safety standards.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: 'Fast & Reliable Delivery',
    desc:  'Securely packed and dispatched swiftly to your doorstep across India.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
]

const TESTIMONIALS = [
  { name:'Priya Sharma',  loc:'Hyderabad, Telangana', stars:5, text:'The Boneless Chicken Pickle is absolutely divine! It tastes exactly like what my grandmother used to make. The aroma alone takes me back to childhood.' },
  { name:'Rajesh Kumar',  loc:'Bangalore, Karnataka', stars:5, text:"I've tried many pickle brands online, but PUJI HOME FOODS is something else. The Ginger Pickle is perfectly balanced — spicy, tangy, and incredibly fresh." },
  { name:'Lakshmi Devi',  loc:'Chennai, Tamil Nadu',  stars:5, text:'The Ariselu and Atukulu Mixture are festival favourites in our home now! Crispy, fresh, and packed with love. Delivery was super fast too!' },
]

const GALLERY_ITEMS = [
  { img: IMG.sweets2, name: 'Festival Sweets',    price: '₹600/kg',  pos: 'center 40%' },
  { img: IMG.murukku, name: 'Murukku',            price: '₹400/kg',  pos: 'center 50%' },
  { img: IMG.nonveg,  name: 'Non-Veg Pickle',     price: '₹1200/kg', pos: 'center 45%' },
  { img: IMG.combo,   name: 'Snacks & Sweets',    price: 'Assorted', pos: 'center 50%' },
]

// ── useReveal hook ────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, vis]
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────
function SectionHeader({ label, title, gold, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <p style={{ fontSize: '.85rem', letterSpacing: '5px', textTransform: 'uppercase', color: C.gold, fontWeight: 800, marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ flex: 1, maxWidth: 70, height: 1, background: C.gold, opacity: .5 }} />
        <span style={{ color: C.gold }}>✦</span>
        <div style={{ flex: 1, maxWidth: 70, height: 1, background: C.gold, opacity: .5 }} />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.1rem,3.8vw,3rem)', fontWeight: 800, marginBottom: 10 }}>
        <span style={{ color: '#111111' }}>{title} </span>
        <span style={{ color: C.maroon }}>{gold}</span>
      </h2>
      {sub && <p style={{ color: '#7a4020', fontSize: '1rem', maxWidth: 520, margin: '0 auto', fontWeight: 400 }}>{sub}</p>}
    </div>
  )
}

// ── Section Divider ───────────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, transparent, ${C.maroon}, transparent)` }} />
      <span style={{ color: C.maroon, fontSize: '1rem' }}>✦</span>
      <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, transparent, ${C.maroon}, transparent)` }} />
    </div>
  )
}
function MobileProfileMenu() {
  const [open, setOpen] = useState(false)
  const { openAuth } = useAuth()

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'rgba(255,255,255,.07)',
          border: '1px solid rgba(201,168,76,.22)',
          borderRadius: '50%',
          width: 38,
          height: 38,
          color: '#F5ECD7',
          cursor: 'pointer'
        }}
      >
          <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 45,
            right: 0,
            background: '#1A0400',
            border: '1px solid rgba(201,168,76,.22)',
            borderRadius: 12,
            width: 120,
            overflow: 'hidden'
          }}
        >
          <button
  onClick={() => {
    setOpen(false)
    openAuth('picker')
  }}
  style={{
    width: '100%',
    padding: '12px',
    background: 'none',
    border: 'none',
    color: '#F5ECD7',
    cursor: 'pointer'
  }}
>
  Login
</button>

         <button
  onClick={() => {
    setOpen(false)
    openAuth('picker-signup')
  }}
  style={{
    width: '100%',
    padding: '12px',
    background: 'none',
    border: 'none',
    color: '#F5ECD7',
    cursor: 'pointer'
  }}
>
  Sign Up
</button>
        </div>
      )}
    </div>
  )
}
// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ onCartClick, page, setPage }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: scrolled ? 64 : 72,
      background: scrolled ? 'rgba(26,4,0,.97)' : 'rgba(26,4,0,.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,168,76,.22)',
      boxShadow: '0 4px 30px rgba(0,0,0,.45)',
      transition: 'all .4s ease',
    }}>
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}
>
  {/* Hamburger */}
  <button
    className="mobile-menu-btn"
    onClick={() => setMenuOpen(o => !o)}
    style={{
      display: window.innerWidth < 768 ? 'block' : 'none',
      background: 'none',
      border: 'none',
      color: '#F5ECD7',
      fontSize: '1.8rem',
      cursor: 'pointer',
      padding: 0,
      marginRight: '4px'
    }}
  >
    {menuOpen ? '✕' : '☰'}
  </button>

  {/* Logo */}
  <a
    href="#home"
    onClick={() => setPage('home')}
    style={{
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none'
    }}
  >
    <img
      src={IMG.logo}
      alt="Puji Home Foods"
      style={{
        height: window.innerWidth < 768 ? 40 : 52,
        width: 'auto'
      }}
    />
  </a>
</div>
      {/* Nav links */}
     <ul
  className="desktop-menu"
  style={{
    display: 'flex',
    gap: 2,
    listStyle: 'none',
    margin: 0,
    padding: 0
  }}
>
        {NAV_LINKS.map(l => {
          const isProducts = l === 'Products'
          const isActive = isProducts && page === 'products'
          return (
            <li key={l}>
              {isProducts ? (
                <button
                  onClick={() => { setPage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{
                    display: 'block', padding: '.45rem .72rem', background: 'none', border: 'none',
                    fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', transition: 'color .3s',
                    color: isActive ? C.gold : C.cream,
                    borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.goldL}
                  onMouseLeave={e => e.currentTarget.style.color = isActive ? C.gold : C.cream}
                >{l}</button>
              ) : (
                <a
                  href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setPage('home')}
                  style={{ display: 'block', padding: '.45rem .72rem', textDecoration: 'none', fontSize: '.8rem', fontWeight: 500, color: C.cream, transition: 'color .3s' }}
                  onMouseEnter={e => e.target.style.color = C.goldL}
                  onMouseLeave={e => e.target.style.color = C.cream}
                >{l}</a>
              )}
            </li>
          )
        })}
      </ul>

      {/* Right */}
      <div
  className="navbar-right"
  style={{
    display: 'flex',
    alignItems: 'center',
   gap: window.innerWidth < 768 ? '.25rem' : '.5rem',
    flexShrink: 0
  }}
>
        <div
  className="search-box"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,.07)',
    border: '1px solid rgba(201,168,76,.22)',
    borderRadius: 24,
    padding: '5px 13px',
    backdropFilter: 'blur(10px)'
  }}
>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: C.cream, fontSize: '.76rem', width: 100, fontFamily: "'DM Sans', sans-serif" }} />
        </div>

        {/* Wishlist heart button */}
        <WishlistNavBtn setPage={setPage} />

        {/* Cart button */}
        <button
          onClick={onCartClick}
          style={{ position: 'relative', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(201,168,76,.22)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.cream, transition: 'all .3s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,.3)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.22)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {totalItems > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: C.crimson, color: 'white', borderRadius: '50%', width: 17, height: 17, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.brown}` }}>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>

        {window.innerWidth < 768 ? (
  <MobileProfileMenu />
) : (
  <UserMenu setPage={setPage} />
)}
        
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(26,4,0,.98)',
          borderBottom: '1px solid rgba(201,168,76,.22)',
          padding: '1rem',
          display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 999,
        }}>
          {NAV_LINKS.map(l => (
  <a
    key={l}
    href="#"
    onClick={(e) => {
      e.preventDefault()

      if (l === 'Products') {
        setPage('products')
      } else {
        setPage('home')

        setTimeout(() => {
          document
            .getElementById(
              l.toLowerCase().replace(/\s+/g, '-')
            )
            ?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }

      setMenuOpen(false)
    }}
    style={{
      color: '#F5ECD7',
      textDecoration: 'none',
      padding: '10px 12px',
      borderRadius: 8,
      fontSize: '.9rem',
      fontWeight: 500,
    }}
  >
    {l}
  </a>
))}
        </div>
      )}
      
    </nav>
  )
}

// ── Wishlist Nav Button ───────────────────────────────────────────
function WishlistNavBtn({ setPage }) {
  const { wishlist } = useWishlist()
  const count = wishlist.length
  return (
    <button
      onClick={() => setPage('wishlist')}
      title="My Wishlist"
      style={{ position: 'relative', background: count > 0 ? 'rgba(231,76,60,.15)' : 'rgba(255,255,255,.07)', border: `1px solid ${count > 0 ? 'rgba(231,76,60,.5)' : 'rgba(201,168,76,.22)'}`, borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: count > 0 ? '#e74c3c' : '#d4a0a0', fontSize: 18, transition: 'all .3s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,76,60,.22)'; e.currentTarget.style.borderColor = '#e74c3c'; e.currentTarget.style.transform = 'scale(1.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background = count > 0 ? 'rgba(231,76,60,.15)' : 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = count > 0 ? 'rgba(231,76,60,.5)' : 'rgba(201,168,76,.22)'; e.currentTarget.style.transform = '' }}
    >
      ♥
      {count > 0 && (
        <span style={{ position: 'absolute', top: -4, right: -4, background: '#e74c3c', color: 'white', borderRadius: '50%', width: 17, height: 17, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #2A1005' }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

// ── Hero ──────────────────────────────────────────────────────────
function Hero({ setPage }) {
  const [cur, setCur] = useState(0)
  const timer = useRef(null)

  const go = (n) => setCur(c => (c + n + HERO_SLIDES.length) % HERO_SLIDES.length)

  useEffect(() => {
    timer.current = setInterval(() => go(1), 5200)
    return () => clearInterval(timer.current)
  }, [cur])

  return (
    <section id="home" style={{ position: 'relative', height: '100vh', minHeight: 580, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {HERO_SLIDES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${s.img})`,
          backgroundSize: s.size || 'cover',
          backgroundPosition: s.pos || 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: i === cur ? 1 : 0,
          transform: i === cur ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 1s ease, transform 7s ease',
        }} />
      ))}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg,rgba(26,4,0,.93) 0%,rgba(61,0,0,.78) 42%,rgba(61,0,0,.22) 68%,rgba(0,0,0,.05) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(1.5rem, 5vw, 5rem)', maxWidth: 660, marginTop: 30 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontStyle: 'italic', fontWeight: 300, color: C.goldL, letterSpacing: 1, marginBottom: '.55rem', animation: 'fadeUp .8s ease both', textShadow: '0 0 20px rgba(201,168,76,.3)' }}>
          Authentic Homemade
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem,4.5vw,3.8rem)', fontWeight: 900, lineHeight: 1.05, color: 'white', textShadow: '0 4px 30px rgba(0,0,0,.5)', animation: 'fadeUp .8s .12s ease both', marginBottom: '.1rem' }}>
          Puji Home Foods
        </h1>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,2.8vw,2.3rem)', fontWeight: 700, lineHeight: 1.1, color: C.goldL, textShadow: '0 0 30px rgba(201,168,76,.4)', animation: 'fadeUp .8s .24s ease both', marginBottom: '1rem' }}>
          Pickles &amp; Sweets
        </h2>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.65, color: 'rgba(240,230,208,.85)', marginBottom: '2rem', animation: 'fadeUp .8s .36s ease both' }}>
          Prepared with Traditional Recipes, Fresh Ingredients and Delivered with Love.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeUp .8s .48s ease both' }}>
          <button
  onClick={() => setPage('products')}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`,
    color: 'white',
    padding: '13px 28px',
    borderRadius: 50,
    fontWeight: 600,
    fontSize: '.9rem',
    border: '1px solid rgba(255,255,255,.14)',
    boxShadow: '0 8px 28px rgba(107,15,15,.5)',
    cursor: 'pointer'
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-3px)'
    e.currentTarget.style.boxShadow =
      '0 0 0 1.5px #C9A84C, 0 14px 38px rgba(107,15,15,.6)'
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.boxShadow =
      '0 8px 28px rgba(107,15,15,.5)'
  }}
>
  Shop Now →
</button>
          <a href="#categories"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', color: C.goldL, padding: '13px 28px', borderRadius: 50, fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', border: '1px solid rgba(201,168,76,.42)', backdropFilter: 'blur(10px)', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(201,168,76,.15)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px #C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.boxShadow = 'none' }}
          >⊞ Explore Menu</a>
        </div>
      </div>

      {[['‹', 'left', () => go(-1)], ['›', 'right', () => go(1)]].map(([ch, side, fn]) => (
        <button key={side} onClick={fn} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: '1.8rem', zIndex: 10, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(201,168,76,.3)', color: C.goldL, width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, backdropFilter: 'blur(10px)', transition: 'all .3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.2)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px #C9A84C' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.boxShadow = 'none' }}
        >{ch}</button>
      ))}

      <div style={{ position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 28 : 8, height: 8, borderRadius: i === cur ? 4 : '50%', background: i === cur ? C.gold : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .35s', padding: 0 }} />
        ))}
      </div>
    </section>
  )
}

// ── About Us ──────────────────────────────────────────────────────
function AboutUs() {
  const [imgHov, setImgHov] = useState(false)

  const stats = [
    { icon: '🏠', label: '100% Homemade' },
    { icon: '📜', label: 'Traditional Recipes' },
    { icon: '🌿', label: 'Fresh Ingredients' },
    { icon: '⭐', label: 'Premium Quality' },
  ]

  return (
    <section id="about-us" style={{ padding: '90px 0', background: '#FAF7F2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>
          <Reveal style={{ position: 'relative' }}>
            <div
              onMouseEnter={() => setImgHov(true)}
              onMouseLeave={() => setImgHov(false)}
              style={{
                position: 'relative', borderRadius: 24, overflow: 'hidden',
                border: `2px solid ${imgHov ? C.gold : 'rgba(201,168,76,.25)'}`,
                boxShadow: imgHov ? '0 0 0 3px rgba(201,168,76,.2), 0 30px 70px rgba(0,0,0,.18)' : '0 16px 50px rgba(0,0,0,.12)',
                transition: 'all .4s ease', aspectRatio: '4/3',
              }}
            >
              <img
                src="/images/about-us.jpeg"
                alt="About Puji Home Foods"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
                  display: 'block', transition: 'transform .6s ease',
                  transform: imgHov ? 'scale(1.06)' : 'scale(1)',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,16,5,.45) 0%, transparent 55%)', pointerEvents: 'none' }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20,
                background: 'rgba(26,4,0,.82)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201,168,76,.35)', borderRadius: 14,
                padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: '1.3rem' }}>🫙</span>
                <div>
                  <div style={{ fontSize: '.7rem', color: C.gold, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Est. 2020</div>
                  <div style={{ fontSize: '.78rem', color: C.cream, fontWeight: 500 }}>Hyderabad, India</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: -20, right: -20, zIndex: -1, width: 120, height: 120, borderRadius: '50%', border: '2px dashed rgba(201,168,76,.3)', pointerEvents: 'none' }} />
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <p style={{ fontSize: '.72rem', letterSpacing: '5px', textTransform: 'uppercase', color: C.gold, fontWeight: 700, marginBottom: 10 }}>Our Story</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 50, height: 1, background: C.gold, opacity: .5 }} />
                <span style={{ color: C.gold, fontSize: '.9rem' }}>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 800, lineHeight: 1.2, color: '#1a0400', marginBottom: '1.4rem' }}>
                Crafting Authentic Homemade Flavours with{' '}
                <span style={{ color: C.crimson }}>Tradition</span> &{' '}
                <span style={{ color: C.gold }}>Love</span>
              </h2>
              {[
                'At PUJI HOME FOODS, we bring the rich taste of authentic homemade pickles, sweets, and traditional snacks crafted with love and tradition. Every recipe is carefully prepared using fresh ingredients, handpicked spices, and traditional methods passed down through generations.',
                'From spicy pickles to delicious homemade sweets, every product reflects the warmth of homemade cooking and the authentic flavors of our culture. We believe food is more than just taste — it is tradition, emotion, and memories shared with family.',
                'Our commitment is to deliver premium quality, hygienic preparation, and unforgettable homemade flavors straight to your doorstep.',
              ].map((para, i) => (
                <p key={i} style={{ fontSize: '.93rem', lineHeight: 1.8, color: '#5a2e10', marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif" }}>{para}</p>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.85rem', marginTop: '1.8rem' }}>
                {stats.map((s, i) => <StatCard key={i} stat={s} />)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(201,168,76,.07)' : 'rgba(250,247,242,1)',
        border: `1px solid ${hov ? C.gold : 'rgba(201,168,76,.22)'}`,
        borderRadius: 14, padding: '1rem 1.1rem',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all .3s ease',
        boxShadow: hov ? '0 0 0 1.5px #C9A84C, 0 8px 24px rgba(201,168,76,.14)' : '0 2px 10px rgba(0,0,0,.05)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 4px rgba(201,168,76,.3))', flexShrink: 0 }}>{stat.icon}</span>
      <span style={{ fontSize: '.82rem', fontWeight: 700, color: hov ? C.crimson : '#3a1a05', letterSpacing: '.2px', transition: 'color .3s', fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</span>
    </div>
  )
}

// ── Categories ────────────────────────────────────────────────────
function Categories({ setSelectedCategory }) {
  return (
    <section
      id="categories"
      style={{
        padding: '88px 0',
        background: '#FAF7F2',
        color: '#1a0400'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="Browse by Type" title="Our" gold="Categories" sub="Handcrafted with age-old recipes and the finest local ingredients" dark={false} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.2rem' }}>
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <CategoryCard cat={c} setSelectedCategory={setSelectedCategory} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ cat, setSelectedCategory }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => {
        setSelectedCategory(cat.name)
        document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' })
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'white',
        border: `1px solid ${hov ? C.gold : 'rgba(201,168,76,.2)'}`,
        borderRadius: 18,
        padding: '1.6rem 1.2rem 1.8rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: 'pointer',
        transition: 'all .35s ease',
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hov ? '0 0 0 1.5px #C9A84C, 0 20px 45px rgba(201,168,76,.14), 0 8px 20px rgba(0,0,0,.08)' : '0 4px 20px rgba(0,0,0,.06)',
      }}
    >
      <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${hov ? C.gold : 'rgba(201,168,76,.28)'}`, marginBottom: '1rem', boxShadow: hov ? `0 0 16px rgba(201,168,76,.35)` : '0 6px 18px rgba(0,0,0,.1)', transition: 'all .35s' }}>
        <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s', transform: hov ? 'scale(1.1)' : 'scale(1)' }} />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.07rem', fontWeight: 700, color: C.darkRed, marginBottom: 4, textAlign: 'center' }}>{cat.name}</div>
      <div style={{ fontSize: '.8rem', color: '#7a4020', textAlign: 'center' }}>{cat.tag}</div>
    </div>
  )
}

// ── Best Sellers ──────────────────────────────────────────────────
const BEST_SELLER_IDS = [1, 23, 9, 34] // Boneless Chicken Pickle, Ariselu, Gongura Pickle, Jantikalu

function BestSellers({ setPage, products }) {
  const bestSellers = products.slice(0, 4)

  return (
    <section id="best-sellers" style={{ padding: '88px 0', background: '#FAF7F2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader
          label="Top Picks"
          title="Our"
          gold="Best Sellers"
          sub="The most loved products from our kitchen — tried, trusted and adored"
          dark={false}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.6rem' }}>
          {bestSellers.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <ProductCard p={p} onWishlistClick={() => setPage('wishlist')} />
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => { setPage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            style={{ padding: '13px 36px', borderRadius: 50, background: `linear-gradient(135deg,#8B1A1A,#6B0F0F)`, color: 'white', border: '1px solid rgba(201,168,76,.35)', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(107,15,15,.3)', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 0 0 2px #C9A84C, 0 12px 28px rgba(107,15,15,.4)` }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,15,15,.3)' }}
          >View All Products →</button>
        </div>
      </div>
    </section>
  )
}

// ── Why Choose Us ─────────────────────────────────────────────────
function WhyChooseUs() {
  return (
    <section
      id="about-us"
      style={{
        padding: '88px 0',
        background: '#FAF7F2',
        color: '#1a0400'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="Our Promise" title="Why" gold="Choose Us?" sub="Every jar is a labor of love, tradition, and uncompromising quality" dark={false} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.4rem' }}>
          {WHY_ITEMS.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.1}>
              <WhyCard w={w} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyCard({ w }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1px solid ${hov ? C.gold : 'rgba(201,168,76,.15)'}`,
        borderRadius: 18, padding: '2rem 1.5rem',
        transition: 'all .35s ease', position: 'relative', overflow: 'hidden',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov ? '0 0 0 1.5px #C9A84C, 0 18px 45px rgba(201,168,76,.13), 0 6px 16px rgba(0,0,0,.07)' : '0 4px 20px rgba(0,0,0,.05)',
      }}
    >
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${C.gold},${C.crimson})`, transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform .4s ease' }} />
      <div style={{ marginBottom: '1.1rem', filter: 'drop-shadow(0 0 6px rgba(201,168,76,.2))' }}>
        {w.icon}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.06rem', fontWeight: 700, color: C.darkRed, marginBottom: 7 }}>{w.title}</div>
      <div style={{ fontSize: '.84rem', color: '#7a4020', lineHeight: 1.65 }}>{w.desc}</div>
    </div>
  )
}

// ── Gallery ───────────────────────────────────────────────────────
function Gallery() {
  const [lb, setLb] = useState(null)

  return (
    <section
      id="gallery"
      style={{
        padding: '88px 0',
        background: '#FAF7F2',
        color: '#1a0400'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="Visual Feast" title="Our" gold="Gallery" sub="A glimpse into the rich, vibrant world of our handcrafted specialties" dark={false} />
        <div
  style={{
    display: 'grid',
    gridTemplateColumns:
  window.innerWidth < 768
    ? 'repeat(2,1fr)'
    : 'repeat(4,1fr)',
    gap: window.innerWidth < 768 ? '.7rem' : '1rem'
  }}
>
          {GALLERY_ITEMS.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.1} style={{
  gridColumn:
  window.innerWidth < 768
    ? (
        i === 0
          ? 'span 2'
          : i === GALLERY_ITEMS.length - 1
          ? 'span 2'
          : 'auto'
      )
    : (i === 0 ? 'span 2' : 'auto'),
  gridRow:
    i === 0
      ? (window.innerWidth < 768 ? 'span 1' : 'span 2')
      : 'auto'
}}>
              <GalleryItem it={it} onClick={() => setLb(it.img)} tall={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>

      {lb && (
        <div onClick={() => setLb(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <button onClick={() => setLb(null)} style={{ position: 'absolute', top: 20, right: 24, background: 'rgba(255,255,255,.12)', border: 'none', color: 'white', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>✕</button>
          <img
  src={lb}
  style={{
    width: window.innerWidth < 768 ? '92vw' : '85vw',
    maxWidth: '700px',
    maxHeight: '80vh',
    borderRadius: 16,
    objectFit: 'contain'
  }}
alt="preview" />
        </div>
      )}
    </section>
  )
}

function GalleryItem({ it, onClick, tall }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, cursor: 'pointer', border: `1px solid ${hov ? C.gold : 'rgba(201,168,76,.15)'}`, height: '100%', minHeight:
  
  window.innerWidth < 768
    ? (tall ? 300 : 180)
    : (tall ? 320 : 155), transition: 'border-color .35s, box-shadow .35s', boxShadow: hov ? '0 0 0 1.5px #C9A84C, 0 12px 30px rgba(201,168,76,.14)' : 'none' }}
    >
      <img src={it.img} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: it.pos || 'center', display: 'block', transition: 'transform .5s ease, filter .4s', filter: hov ? 'brightness(1.05)' : 'brightness(.93)', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(26,4,0,.88) 0%,transparent 55%)', display: 'flex', alignItems: 'flex-end', padding: '1.1rem', opacity: hov ? 1 : 0, transition: 'opacity .4s' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'white' }}>{it.name}</div>
          <div style={{ color: C.gold, fontSize: '.83rem', fontWeight: 600 }}>{it.price}</div>
        </div>
      </div>
    </div>
  )
}

// ── Testimonials ──────────────────────────────────────────────────
function Testimonials() {
  return (
    <section
      id="reviews"
      style={{
        padding: '88px 0',
        background: '#FAF7F2',
        color: '#1a0400'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="Customer Love" title="What They" gold="Say" sub="Over 5,000 happy customers trust us for their homemade food cravings" dark={false} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.4rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <TestiCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestiCard({ t }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: C.white, border: `1px solid ${hov ? C.gold : 'rgba(201,168,76,.18)'}`, borderRadius: 20, padding: '2rem', position: 'relative', transition: 'all .35s ease', transform: hov ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hov ? '0 0 0 1.5px #C9A84C, 0 20px 45px rgba(201,168,76,.12), 0 6px 16px rgba(0,0,0,.07)' : '0 4px 20px rgba(0,0,0,.06)' }}
    >
      <div style={{ position: 'absolute', top: 14, left: 18, fontFamily: "'Playfair Display', serif", fontSize: '5rem', color: C.gold, opacity: .1, lineHeight: 1, pointerEvents: 'none' }}>"</div>
      <div style={{ color: C.gold, fontSize: '.9rem', marginBottom: '1rem', letterSpacing: 2 }}>{'★'.repeat(t.stars)}</div>
      <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#4a2010', marginBottom: '1.4rem', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>{t.text}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg,${C.crimson},${C.gold})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: 'white', border: '2px solid rgba(201,168,76,.35)', flexShrink: 0 }}>{t.name[0]}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '.89rem', color: '#1a0400' }}>{t.name}</div>
          <div style={{ fontSize: '.75rem', color: '#9a6040' }}>{t.loc}</div>
        </div>
      </div>
    </div>
  )
}

// ── Contact ───────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  // ── UPDATED: opens mailto with pre-filled form data ──
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return

    const subject = encodeURIComponent(`Message from ${form.name} - Puji Home Foods`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\n\nMessage:\n${form.message}`
    )

    window.open(`mailto:hello@pujihomefoods.com?subject=${subject}&body=${body}`, '_blank')

    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }, 3000)
  }

  return (
    <section id="contact" style={{ padding: '88px 0', background: '#FAF7F2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <SectionHeader label="Get In Touch" title="Contact" gold="Us" sub="We'd love to hear from you — reach out for orders, queries, or just to say hello!" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Left — contact info */}
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {/* Info cards */}
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                  label: 'Phone',
                  value: '+91 98765 43210',
                  href: 'tel:+919876543210',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  label: 'Email',
                  value: 'hello@pujihomefoods.com',
                  href: 'mailto:hello@pujihomefoods.com',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: 'Address',
                  value: 'Hyderabad, Telangana, India – 500 001',
                  href: null,
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg,${C.maroon},${C.darkRed})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 18px rgba(61,0,0,.2)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gold, marginBottom: 4 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: '.92rem', color: '#3a1a05', fontWeight: 500, textDecoration: 'none', transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = C.crimson}
                        onMouseLeave={e => e.currentTarget.style.color = '#3a1a05'}
                      >{item.value}</a>
                    ) : (
                      <span style={{ fontSize: '.92rem', color: '#3a1a05', fontWeight: 500 }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Business hours */}
              <div style={{ background: 'white', borderRadius: 16, padding: '1.4rem', border: '1px solid rgba(201,168,76,.2)', boxShadow: '0 4px 16px rgba(0,0,0,.05)' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: C.gold, marginBottom: '1rem' }}>Business Hours</div>
                {[
                  ['Monday – Saturday', '9:00 AM – 7:00 PM'],
                  ['Sunday',            '10:00 AM – 4:00 PM'],
                ].map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                    <span style={{ fontSize: '.83rem', color: '#7a4020', fontWeight: 500 }}>{day}</span>
                    <span style={{ fontSize: '.83rem', color: '#1a0400', fontWeight: 600 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — contact form */}
          <Reveal delay={0.15}>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid rgba(201,168,76,.2)', boxShadow: '0 8px 32px rgba(0,0,0,.07)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#1a0400', marginBottom: '1.5rem' }}>Send us a Message</h3>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: C.maroon, marginBottom: 6 }}>Message Sent!</div>
                  <p style={{ fontSize: '.88rem', color: '#9a6040' }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'name',    label: 'Your Name',       type: 'text',  placeholder: 'e.g. Priya Sharma',          required: true  },
                    { key: 'email',   label: 'Email Address',   type: 'email', placeholder: 'email@example.com',          required: true  },
                    { key: 'phone',   label: 'Phone (Optional)',type: 'tel',   placeholder: '10-digit mobile number',     required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: '#7a4020', marginBottom: 5, letterSpacing: '.3px' }}>
                        {f.label}{f.required && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
                      </label>
                      <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(201,168,76,.25)', outline: 'none', fontSize: '.88rem', color: '#1a0400', fontFamily: "'DM Sans', sans-serif", transition: 'border .2s' }}
                        onFocus={e => e.target.style.borderColor = C.gold}
                        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.25)'}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: '#7a4020', marginBottom: 5, letterSpacing: '.3px' }}>
                      Message <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <textarea value={form.message} placeholder="How can we help you?"
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={4}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(201,168,76,.25)', outline: 'none', fontSize: '.88rem', color: '#1a0400', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', transition: 'border .2s' }}
                      onFocus={e => e.target.style.borderColor = C.gold}
                      onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.25)'}
                    />
                  </div>

                  <button onClick={handleSubmit}
                    style={{ padding: '12px 0', borderRadius: 50, border: 'none', background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(107,15,15,.3)', transition: 'all .3s', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 10px 26px rgba(107,15,15,.4)` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,15,15,.3)' }}
                  >Send Message →</button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" style={{ background: `linear-gradient(180deg,${C.brown} 0%,#080100 100%)`, borderTop: '1px solid rgba(201,168,76,.2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},${C.crimson},${C.gold},transparent)`, animation: 'shimmerLine 3s ease-in-out infinite' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '68px 2rem 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>

        {/* Brand */}
        <div>
          <img src={IMG.logo} alt="Puji Home Foods" style={{ height: 70, width: 'auto', objectFit: 'contain', marginBottom: '1rem', filter: 'drop-shadow(0 0 8px rgba(201,168,76,.3))' }} />
          <p style={{ fontSize: '.84rem', color: 'rgba(240,230,208,.55)', lineHeight: 1.7, maxWidth: 260 }}>Authentic homemade pickles, sweets, and traditional snacks prepared with love and tradition. Every bite tells a story.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: '1.4rem' }}>
            {[
              <svg key="fb" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              <svg key="ig" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
              <svg key="yt" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
              <svg key="tw" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
            ].map((icon, idx) => (
              <a key={idx} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(201,168,76,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cream, textDecoration: 'none', transition: 'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 10px rgba(201,168,76,.25)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(201,168,76,.22)'; e.currentTarget.style.boxShadow = 'none' }}
              >{icon}</a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.02rem', color: C.gold, marginBottom: '1.4rem', fontWeight: 700 }}>Quick Links</div>
          {['Home','Categories','Best Sellers','Gallery','About Us','Contact'].map(l => (
            <a key={l} href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '.84rem', color: 'rgba(240,230,208,.6)', marginBottom: '.65rem', transition: 'color .3s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.goldL}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,230,208,.6)'}
            >› {l}</a>
          ))}
        </div>

        {/* Categories */}
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.02rem', color: C.gold, marginBottom: '1.4rem', fontWeight: 700 }}>Categories</div>
          {['Veg Pickles','Non-Veg Pickles','Sweets','Hot & Snacks','Gift Packs','Combo Offers'].map(l => (
            <a key={l} href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '.84rem', color: 'rgba(240,230,208,.6)', marginBottom: '.65rem', transition: 'color .3s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.goldL}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,230,208,.6)'}
            >› {l}</a>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.02rem', color: C.gold, marginBottom: '1.4rem', fontWeight: 700 }}>Contact Us</div>
          {[
            [<svg key="ph" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, '+91 98765 43210'],
            [<svg key="em" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 'hello@pujihomefoods.com'],
            [<svg key="loc" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, 'Hyderabad, Telangana, India – 500 001'],
          ].map(([icon, txt]) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '1rem', fontSize: '.84rem', color: 'rgba(240,230,208,.6)' }}>
              <span style={{ flexShrink: 0, marginTop: 2 }}>{icon}</span><span>{txt}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,.15)', padding: '18px 2rem', maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '.77rem', color: 'rgba(240,230,208,.4)' }}>© 2026 PUJI HOME FOODS. All Rights Reserved.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Terms & Conditions', 'Privacy Policy'].map(l => (
            <a key={l} href="#" style={{ fontSize: '.77rem', color: 'rgba(240,230,208,.4)', textDecoration: 'none', transition: 'color .3s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,230,208,.4)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ── Back to Top ───────────────────────────────────────────────────
function BackTop() {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const h = () => setVis(window.scrollY > 300)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 500, width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: '1px solid rgba(201,168,76,.28)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, boxShadow: '0 4px 18px rgba(107,15,15,.5)', transition: 'all .35s', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(10px)', pointerEvents: vis ? 'auto' : 'none' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px #C9A84C, 0 8px 24px rgba(107,15,15,.6)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(107,15,15,.5)' }}
    >↑</button>
  )
}
// ── Orders Page ───────────────────────────────────────────────────
function OrdersPage({ setPage, user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('USER OBJECT:', user)
    fetch('https://puji-home-foods.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => {
        console.log('LATEST ORDER:', data[data.length - 1])
        console.log('USER ID:', user?.id, user?._id)
        const userId = String(user?.id || user?._id || '')
const myOrders = data.filter(o => {
  if (!o.userId) return false
  return String(o.userId) === userId
})
        console.log('MATCHED ORDERS:', myOrders)
        setOrders(myOrders)
        setLoading(false)
      })
      .catch(err => { console.error(err); setLoading(false) })
  }, [user])

  return (
    <div style={{ minHeight: '100vh', padding: '120px 40px', background: '#F5ECD7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
          <h1 style={{ color: '#3D0000', margin: 0 }}>My Orders</h1>
          <button onClick={() => setPage('portal')}
            style={{ background: '#8B1A1A', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            ← Back to Portal
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9a6040', fontSize: '1.1rem' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', padding: 50, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
            <h2 style={{ color: '#3D0000' }}>No Orders Yet</h2>
            <p style={{ color: '#9a6040' }}>You haven't placed any orders yet.</p>
            <button onClick={() => setPage('products')}
              style={{ background: '#8B1A1A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', marginTop: 16, fontWeight: 600 }}>
              Shop Now
            </button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 4px 15px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
  <div>
    <p style={{ margin: 0, fontWeight: 700, color: '#3D0000' }}>
      Order #{order._id.slice(-6).toUpperCase()}
    </p>
  </div>

  <div style={{ textAlign: 'right' }}>
    <span style={{
      padding: '6px 14px',
      borderRadius: 20,
      fontWeight: 600,
      fontSize: '.82rem',
      background: order.orderStatus === 'Delivered'
        ? '#EAF7EC'
        : order.orderStatus === 'Shipped'
        ? '#FFF3DD'
        : '#E8F0FF',
      color: order.orderStatus === 'Delivered'
        ? '#2E8B57'
        : order.orderStatus === 'Shipped'
        ? '#C17A00'
        : '#2A62D5',
    }}>
      {order.orderStatus}
    </span>

    {order.orderStatus === 'Pending' && (
      <div>
        <button
          onClick={async () => {
  const confirmCancel = window.confirm(
    'Are you sure you want to cancel this order?'
  )

  if (!confirmCancel) return

  try {
    const response = await fetch(
  `https://puji-home-foods.onrender.com/api/orders/${order._id}/cancel`,
  {
    method: "PUT",
  }
)

    const data = await response.json()

    if (response.ok) {
      alert('Order cancelled successfully')
      window.location.reload()
    } else {
      alert(data.message || 'Failed to cancel order')
    }
  } catch (error) {
    console.error(error)
    alert('Server Error')
  }
}}
          style={{
            marginTop: '10px',
            background: '#dc2626',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Cancel Order
        </button>
      </div>
    )}
  </div>
</div>
              {order.products.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid #f0e6d3' }}>
                  <div style={{ flex: 1 }}>
                    
                    <p style={{ margin: 0, fontWeight: 600, color: '#1a0400' }}>{p.name}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '.82rem', color: '#9a6040' }}>
                      Weight: {p.weight}g · Qty: {p.quantity} · ₹{p.price}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0e6d3' }}>
                <span style={{ fontSize: '.85rem', color: '#9a6040' }}>📍 {order.address}</span>
                <span style={{ fontWeight: 700, color: '#3D0000' }}>Total: ₹{order.totalAmount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


// ── AppInner ──────────────────────────────────────────────────────
function AppInner({ page, setPage }) {
  const path = window.location.pathname;

if (path === "/forgot-password") {
  return <ForgotPassword />;
}

if (path.startsWith("/reset-password/")) {
  return <ResetPassword />;
}
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [lastOrder, setLastOrder] = useState({ name: '', amount: 0 })
  
useEffect(() => {
  fetch('https://puji-home-foods.onrender.com/api/products')
    .then(res => res.json())
    .then(data => {
  console.log(data[0])
  setProducts(data)
})
    .catch(err => console.log(err))
}, [])


const [profile, setProfile] = useState({
  name: 'Customer',
  email: 'customer@gmail.com',
  phone: '9876543210',
  location: 'Hyderabad',
})
  const { user, logout, openAuth } = useAuth()
  useEffect(() => {
  const handler = () => openAuth('customer')
  window.addEventListener('require-login', handler)
  return () => window.removeEventListener('require-login', handler)
}, [])
  const { clearCart, grandTotal } = useCart()

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLogout = () => { logout(); setPage('home') }
  
  // Guard checkout — must be logged in as customer
  const handleCheckout = () => {
    if (!user || user.role !== 'customer') {
      openAuth('customer', 'checkout')  // after login → go to checkout
      return
    }
    setPage('checkout')
  }

  const handleSuccess = (formData) => { clearCart(); setPage('success'); setLastOrder({ name: formData.name, amount: grandTotal }) }
  const handleFailure = () => { setPage('failure') }
const { wishlist } = useWishlist()
  // ── Cart page ──
  if (page === 'cart') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Cart
          onCheckout={handleCheckout}
          onContinue={() => { setPage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        />
        <BackTop />
      </>
    )
  }

  // ── Checkout page ──
  if (page === 'checkout') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Checkout
          onBack={() => setPage('cart')}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
        <BackTop />
      </>
    )
  }

  // ── Success page ──
  if (page === 'success') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Success
          customerName={lastOrder.name}
          totalAmount={lastOrder.amount}
          onContinue={() => { setPage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        />
        <BackTop />
      </>
    )
  }

  // ── Failure page ──
  if (page === 'failure') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Failure
          onRetry={() => setPage('checkout')}
          onBackToCart={() => setPage('cart')}
        />
        <BackTop />
      </>
    )
  }

  // ── Wishlist page ──
  if (page === 'wishlist') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Wishlist setPage={setPage} onCheckout={handleCheckout} />
        <Footer />
        <BackTop />
      </>
    )
  }

  // ── Admin Dashboard ──
  if (page === 'admin') {
    return (
      <AdminDashboard user={user} onLogout={handleLogout} />
    )
  }

  // ── Customer Portal ──
  if (page === 'portal') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
       <CustomerPortal
  setPage={setPage}
  profile={profile}
  wishlist={wishlist}
/>
        <BackTop />
      </>
    )
  }
  if (page === 'editProfile') {
  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        onCartClick={() => setPage('cart')}
      />

      <EditProfile
        setPage={setPage}
        profile={profile}
        setProfile={setProfile}
      />

      <BackTop />
    </>
  )
}

  // ── Products page ──
  if (page === 'products') {
    return (
      <>
        <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
        <Products
  products={filteredProducts}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  setPage={setPage}
/>
        <Footer />
        <BackTop />
      </>
    )
  }
 if (page === 'orders') {
  return (
    <>
      <Navbar onCartClick={() => setPage('cart')} setPage={setPage} />
      <OrdersPage setPage={setPage} user={user} />
    </>
  )
}
if (page === 'wishlist') {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <>
      <Navbar
        onCartClick={() => setPage('cart')}
        setPage={setPage}
      />

      <div
        style={{
          minHeight: '100vh',
          padding: '120px 40px',
          background: '#F5ECD7',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <h1
            style={{
              color: '#3D0000',
            }}
          >
            My Wishlist ❤️
          </h1>
          

          <button
            onClick={() => setPage('portal')}
            style={{
              background: '#8B1A1A',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ← Back to Portal
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div
            style={{
              background: '#fff',
              padding: '50px',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <h2>Your Wishlist is Empty 💔</h2>

            <p>
              Save your favorite pickles and snacks here.
            </p>

            <button
              onClick={() => setPage('products')}
              style={{
                background: '#8B1A1A',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill,minmax(280px,1fr))',
              gap: '20px',
            }}
          >
            {wishlist.map((product) => (
              <div
                key={product.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow:
                    '0 4px 15px rgba(0,0,0,.08)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                  }}
                />

                <div
                  style={{
                    padding: '18px',
                  }}
                >
                  <h3>{product.name}</h3>

                  <p
                    style={{
                      color: '#8B1A1A',
                      fontWeight: '700',
                    }}
                  >
                    ₹{product.basePrice}
                  </p>

                  <button
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    style={{
                      width: '100%',
                      background: '#8B1A1A',
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
if (page === 'addresses') {
  return (
    <>
      <Navbar onCartClick={() => setPage('cart')} />

      <div
        style={{
          minHeight: '100vh',
          padding: '120px 40px',
          background: '#F5ECD7',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}
        >
          <h1 style={{ color: '#3D0000' }}>
            Saved Addresses
          </h1>

          <button
            onClick={() => setPage('portal')}
            style={{
              background: '#8B1A1A',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ← Back to Portal
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))',
            gap: '20px',
          }}
        >
          {/* Home Address */}
          <div
            style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,.08)',
            }}
          >
            <h3>🏠 Home</h3>

            <p><strong>Sneha</strong></p>

            <p>
              H.No 1-23,
              Near Bus Stand,
              Siddipet,
              Telangana - 502103
            </p>

            <p>📞 +91 98765 43210</p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
              }}
            >
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>

          {/* Office Address */}
          <div
            style={{
              background: '#fff',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,.08)',
            }}
          >
            <h3>🏢 Office</h3>

            <p><strong>Sneha</strong></p>

            <p>
              HITEC City,
              Hyderabad,
              Telangana - 500081
            </p>

            <p>📞 +91 98765 43210</p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
              }}
            >
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        </div>

        <button
          style={{
            marginTop: '30px',
            background: '#8B1A1A',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          + Add New Address
        </button>
      </div>
    </>
  )
}
if (page === 'settings') {
  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        onCartClick={() => setPage('cart')}
      />

      <Settings setPage={setPage} />

      <BackTop />
    </>
  )
}
 
if (page === 'trackorder') {
  return (
    <>
      <Navbar onCartClick={() => setPage('cart')} />

      <div
        style={{
          minHeight: '100vh',
          padding: '120px 40px',
          background: '#F5ECD7',
        }}
      >
        <div
  style={{
    maxWidth: '900px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <h1
    style={{
      margin: 0,
      color: '#3D0000',
    }}
  >
    Track Order
  </h1>

  <button
    onClick={() => setPage('portal')}
    style={{
      background: '#8B1A1A',
      color: '#fff',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
    }}
  >
    ← Back to Portal
  </button>
</div>
        

        <div
  style={{
    maxWidth: '900px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,.1)',
  }}
>
  {/* Header */}
  <div
    style={{
      background: 'linear-gradient(135deg,#8B1A1A,#3D0000)',
      color: '#fff',
      padding: '25px',
    }}
  >
    <h2 style={{ margin: 0 }}>
      Order #PHF1023
    </h2>

    <p style={{ marginTop: '10px' }}>
      Prawns Pickle 500g
    </p>

    <p>
      Expected Delivery: 7 June 2026
    </p>
  </div>

  {/* Progress */}
  <div
    style={{
      padding: '40px',
    }}
  >
    <h3
      style={{
        color: '#3D0000',
        marginBottom: '30px',
      }}
    >
      Delivery Progress
    </h3>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '30px' }}>✅</div>
        <p>Placed</p>
      </div>

      <div style={{ flex: 1, height: '4px', background: 'green' }} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '30px' }}>✅</div>
        <p>Packed</p>
      </div>

      <div style={{ flex: 1, height: '4px', background: 'green' }} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '30px' }}>✅</div>
        <p>Shipped</p>
      </div>

      <div style={{ flex: 1, height: '4px', background: '#C9A84C' }} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '30px' }}>🚚</div>
        <p>Out for Delivery</p>
      </div>

      <div style={{ flex: 1, height: '4px', background: '#ddd' }} />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '30px' }}>📦</div>
        <p>Delivered</p>
      </div>
    </div>

    {/* Address */}
    <div
      style={{
        background: '#F8F8F8',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
      }}
    >
      <h4>Delivery Address</h4>

      <p>
        Sneha <br />
        Siddipet, Telangana <br />
        502103
      </p>
    </div>

    {/* Support */}
    <div
      style={{
        background: '#FFF8E8',
        padding: '20px',
        borderRadius: '12px',
      }}
    >
      <h4>Need Help?</h4>

      <p>
        Contact our support team regarding this order.
      </p>

      <button
        style={{
          background: '#8B1A1A',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Contact Support
      </button>
    </div>
  </div>
</div>

        <br />

        
      </div>
    </>
  )
}
if (page === 'support') {
  return (
    <>
      <Navbar onCartClick={() => setPage('cart')} />

      <div
        style={{
          minHeight: '100vh',
          padding: '120px 40px',
          background: '#F5ECD7',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <h1 style={{ color: '#3D0000' }}>
              Help & Support
            </h1>

            <button
              onClick={() => setPage('portal')}
              style={{
                background: '#8B1A1A',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ← Back to Portal
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,.08)',
              }}
            >
              <h2>📞 Call Us</h2>
              <p>+91 98765 43210</p>
            </div>

            <div
              style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,.08)',
              }}
            >
              <h2>📧 Email</h2>
              <p>support@pujihomefoods.com</p>
            </div>

            <div
              style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,.08)',
              }}
            >
              <h2>💬 Live Chat</h2>
              <p>Available 9 AM - 9 PM</p>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,.08)',
            }}
          >
            <h2>❓ Frequently Asked Questions</h2>

            <p><strong>Where is my order?</strong></p>
            <p>Track your order from the Track Order page.</p>

            <hr />

            <p><strong>How can I cancel my order?</strong></p>
            <p>Contact support before shipment.</p>

            <hr />

            <p><strong>Do you deliver across India?</strong></p>
            <p>Yes, we deliver nationwide.</p>
          </div>
        </div>
      </div>
    </>
  )
}

if (page === 'offers') {
  return (
    <>
      <Navbar onCartClick={() => setPage('cart')} />

      <div
        style={{
          minHeight: '100vh',
          padding: '120px 40px',
          background:
  'linear-gradient(135deg,#FFF8E8,#F5ECD7,#FFF3D6)',
        }}
      >
        <div
  style={{
    position: 'fixed',
    top: '120px',
    left: '50px',
    fontSize: '50px',
    opacity: '.08',
    pointerEvents: 'none',
  }}
>
  🎁
</div>

<div
  style={{
    position: 'fixed',
    top: '220px',
    right: '80px',
    fontSize: '60px',
    opacity: '.08',
    pointerEvents: 'none',
  }}
>
  🎉
</div>

<div
  style={{
    position: 'fixed',
    bottom: '100px',
    left: '100px',
    fontSize: '55px',
    opacity: '.08',
    pointerEvents: 'none',
  }}
>
  🎊
</div>
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <h1 style={{ color: '#3D0000' }}>
              Offers & Coupons
            </h1>
            <div
  style={{
    background:
      'linear-gradient(135deg,#8B1A1A,#3D0000)',
    color: '#fff',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,.15)',
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: '42px',
    }}
  >
    🎉 Exclusive Offers
  </h1>

  <p
    style={{
      marginTop: '15px',
      fontSize: '18px',
      color: '#F5ECD7',
    }}
  >
    Save More On Your Favorite Pickles
  </p>
</div>

            <button
              onClick={() => setPage('portal')}
              style={{
                background: '#8B1A1A',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ← Back to Portal
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: '20px',
            }}
          >
            {[
  {
    code: 'PUJI10',
    discount: '10% OFF',
    min: 'Minimum Order ₹999',
    image: IMG.boneChicken,
  },
  {

    code: 'FREESHIP',
    discount: 'FREE DELIVERY',
    min: 'Minimum Order ₹499',
    image: '/images/prawnspickle.webp',   
  },
  {
    code: 'WELCOME20',
    discount: '20% OFF',
    min: 'New Customers',
    image: '/images/MuttonPickle.jpg',
  },
].map((coupon) => (
              <div
                key={coupon.code}
                style={{
                  background: '#fff',
                  padding: '25px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 25px rgba(0,0,0,.12)',
transition: 'all .3s ease',
cursor: 'pointer',
                }}
              >
                <img
  src={coupon.image}
  alt={coupon.code}
  style={{
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '15px',
  }}
/>
                <h2 style={{ color: '#8B1A1A' }}>
                  {coupon.code}
                </h2>

                <h3>{coupon.discount}</h3>

                <p>{coupon.min}</p>

                <button
                  style={{
                    background: '#8B1A1A',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Apply Coupon
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

  // ── Homepage ──
  return (
    <>
      <Navbar page={page} setPage={setPage} onCartClick={() => setPage('cart')} />
      <Hero setPage={setPage} />
      <SectionDivider />
      <AboutUs />
      <SectionDivider />
      <Categories setSelectedCategory={setSelectedCategory} />
      <SectionDivider />
      <BestSellers
  setPage={setPage}
  products={products}
/>
      <SectionDivider />
      <WhyChooseUs />
      <SectionDivider />
      <Gallery />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <Contact />
      <Footer />
      <BackTop />
    </>
  )
}

// ── App (root) ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')

  return (
    <AuthProvider onLoginRedirect={setPage}>
      <CartProvider>
        <WishlistProvider>
          <AppInner page={page} setPage={setPage} />
          <AuthModal />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}