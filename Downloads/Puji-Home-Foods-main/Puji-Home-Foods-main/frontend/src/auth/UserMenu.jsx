import { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const C = {
  gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A',
  darkRed: '#6B0F0F', cream: '#F5ECD7', brown: '#2A1005',
}

export default function UserMenu({ setPage }) {
  const { user, logout, openAuth } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // ── Not logged in — show Login + Signup, both open portal picker ──
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <button
          onClick={() => openAuth('picker')}   // always open at portal picker
          style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(201,168,76,.22)', color: C.cream, padding: window.innerWidth < 768 ? '4px 8px' : '6px 14px',
fontSize: window.innerWidth < 768 ? '.65rem' : '.76rem', borderRadius: 20, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .3s', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.goldL }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.22)'; e.currentTarget.style.color = C.cream }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          LOGIN
        </button>

        <button
  onClick={() => openAuth('picker-signup')}
          style={{ background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: '1px solid rgba(201,168,76,.28)', color: 'white',padding: window.innerWidth < 768 ? '4px 8px' : '6px 15px',
fontSize: window.innerWidth < 768 ? '.65rem' : '.76rem', borderRadius: 20,fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 14px rgba(107,15,15,.4)', transition: 'all .3s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 0 0 1px ${C.gold}, 0 8px 20px rgba(107,15,15,.5)` }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,15,15,.4)' }}
        >✨ Sign Up</button>
      </div>
    )
  }

  // ── Logged in — avatar + dropdown ──
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', border: `1px solid ${open ? C.gold : 'rgba(201,168,76,.22)'}`, borderRadius: 24, padding: '4px 12px 4px 4px', cursor: 'pointer', transition: 'all .3s', boxShadow: open ? '0 0 0 2px rgba(201,168,76,.2)' : 'none' }}
      >
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 800, color: 'white', border: `1.5px solid ${C.gold}`, flexShrink: 0 }}>
          {initials}
        </div>
        <span style={{ fontSize: '.78rem', fontWeight: 600, color: C.cream, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name.split(' ')[0]}
        </span>
        {user.role === 'admin' && (
          <span style={{ background: C.crimson, color: 'white', fontSize: '.58rem', fontWeight: 800, padding: '2px 6px', borderRadius: 20, letterSpacing: '.5px' }}>ADMIN</span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.goldL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform .3s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'rgba(26,4,0,.98)', border: '1px solid rgba(201,168,76,.22)', borderRadius: 14, padding: 8, minWidth: 210, backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,.6)', zIndex: 100, animation: 'fadeUp .2s ease both' }}>
          {/* User info */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(201,168,76,.15)', marginBottom: 6 }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: C.goldL }}>{user.name}</div>
            <div style={{ fontSize: '.7rem', color: 'rgba(240,230,208,.5)', marginTop: 2 }}>{user.email}</div>
            <div style={{ fontSize: '.65rem', color: C.gold, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4 }}>{user.role} account</div>
          </div>

          {/* My Account */}
          <a href="#" onClick={e => { e.preventDefault(); setPage(user.role === 'admin' ? 'admin' : 'portal'); setOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', color: C.cream, fontSize: '.8rem', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>👤</span> My Account
          </a>

          <div style={{ height: 1, background: 'rgba(201,168,76,.15)', margin: '6px 0' }} />

          <button
            onClick={() => { logout(); setOpen(false); setPage('home') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 8, background: 'none', border: 'none', color: '#e07070', fontSize: '.8rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .2s', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
