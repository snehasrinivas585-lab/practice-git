import { useState, useEffect, useRef } from 'react'
import { notifications } from '../data/adminData'

export const AC = {
  maroon:  '#3D0000',
  darkRed: '#6B0F0F',
  crimson: '#8B1A1A',
  gold:    '#C9A84C',
  goldL:   '#E8C97A',
  cream:   '#F5ECD7',
  beige:   '#FAF7F2',
  brown:   '#2A1005',
  white:   '#FFFFFF',
  sidebar: '#1a0400',
  sidebarW: 240,
}

// ── SVG Icon Library ──────────────────────────────────────────────
export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  const s = { width: size, height: size, style: { flexShrink: 0 } }
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    dashboard:  <svg {...s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    products:   <svg {...s} viewBox="0 0 24 24" {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    categories: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    orders:     <svg {...s} viewBox="0 0 24 24" {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    customers:  <svg {...s} viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    payments:   <svg {...s} viewBox="0 0 24 24" {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    coupons:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    analytics:  <svg {...s} viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    delivery:   <svg {...s} viewBox="0 0 24 24" {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    reviews:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    settings:   <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    admins:     <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    logout:     <svg {...s} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bell:       <svg {...s} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    menu:       <svg {...s} viewBox="0 0 24 24" {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    chevronDown:<svg {...s} viewBox="0 0 24 24" {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    box:        <svg {...s} viewBox="0 0 24 24" {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    money:      <svg {...s} viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    users:      <svg {...s} viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    clock:      <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    star:       <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    warning:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    profile:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    key:        <svg {...s} viewBox="0 0 24 24" {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  }
  return icons[name] || null
}

// ── Status Badge ──────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    Active:'#166534,#dcfce7', Inactive:'#6b7280,#f3f4f6',
    Pending:'#92400e,#fef3c7', Processing:'#1e40af,#dbeafe',
    Shipped:'#5b21b6,#ede9fe', Delivered:'#166534,#dcfce7',
    Cancelled:'#991b1b,#fee2e2', Paid:'#166534,#dcfce7',
    Failed:'#991b1b,#fee2e2', Refunded:'#92400e,#fef3c7',
    'On the Way':'#1e40af,#dbeafe', Approved:'#166534,#dcfce7',
    Expired:'#6b7280,#f3f4f6', 'Super Admin':'#5b21b6,#ede9fe',
    Admin:'#1e40af,#dbeafe',
  }
  const [text, bg] = (map[status] || '#6b7280,#f3f4f6').split(',')
  return (
    <span style={{ background: bg, color: text, padding:'3px 10px', borderRadius:20, fontSize:'.7rem', fontWeight:700, letterSpacing:'.3px', whiteSpace:'nowrap' }}>
      {status}
    </span>
  )
}

// ── Toast ─────────────────────────────────────────────────────────
export function Toast({ msg, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
  const bg = type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#92400e'
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:99999, background:bg, color:'white', padding:'12px 20px', borderRadius:12, fontSize:'.85rem', fontWeight:600, boxShadow:'0 8px 30px rgba(0,0,0,.3)', display:'flex', alignItems:'center', gap:10, animation:'slideInRight .3s ease', border:'1px solid rgba(255,255,255,.15)' }}>
      <span>{type==='success'?'✓':type==='error'?'✕':'!'}</span>
      {msg}
      <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,.7)', cursor:'pointer', fontSize:14, marginLeft:4 }}>✕</button>
      <style>{`@keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  )
}

// ── Confirm Modal ─────────────────────────────────────────────────
export function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:400, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)', textAlign:'center' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
          <Icon name="warning" size={28} color="#991b1b" />
        </div>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#1a0400', marginBottom:8 }}>Confirm Action</h3>
        <p style={{ fontSize:'.85rem', color:'#7a4020', marginBottom:'1.5rem', lineHeight:1.6 }}>{msg}</p>
        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={onCancel} style={{ flex:1, padding:'10px 0', borderRadius:50, border:'1px solid rgba(201,168,76,.3)', background:'none', color:AC.crimson, fontWeight:600, fontSize:'.84rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'10px 0', borderRadius:50, border:'none', background:'linear-gradient(135deg,#991b1b,#7f1d1d)', color:'white', fontWeight:700, fontSize:'.84rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Search Bar ────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position:'relative', flex:1, maxWidth:320 }}>
      <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9a6040', lineHeight:0 }}>
        <Icon name="dashboard" size={14} color="#9a6040" />
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', padding:'9px 14px 9px 36px', borderRadius:50, border:'1.5px solid rgba(201,168,76,.25)', outline:'none', fontSize:'.83rem', color:'#1a0400', fontFamily:"'DM Sans',sans-serif", background:'white', transition:'border-color .2s' }}
        onFocus={e => e.target.style.borderColor = AC.gold}
        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.25)'}
      />
    </div>
  )
}

// ── Admin Button ──────────────────────────────────────────────────
export function ABtn({ children, onClick, variant='primary', size='md', icon, disabled }) {
  const [hov, setHov] = useState(false)
  const pad = size === 'sm' ? '6px 14px' : '9px 20px'
  const fs  = size === 'sm' ? '.76rem' : '.84rem'
  const bg  = variant==='primary'
    ? (disabled ? '#ccc' : hov ? `linear-gradient(135deg,${AC.darkRed},${AC.maroon})` : `linear-gradient(135deg,${AC.crimson},${AC.darkRed})`)
    : variant==='gold'
    ? (hov ? `linear-gradient(135deg,#b8962a,${AC.gold})` : `linear-gradient(135deg,${AC.gold},${AC.goldL})`)
    : (hov ? 'rgba(201,168,76,.12)' : 'transparent')
  const cl = variant==='primary' ? 'white' : variant==='gold' ? AC.brown : AC.crimson
  const bd = variant==='outline' ? `1.5px solid ${hov ? AC.gold : 'rgba(201,168,76,.3)'}` : 'none'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:6, padding:pad, borderRadius:50, border:bd, background:bg, color:cl, fontWeight:600, fontSize:fs, cursor:disabled?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .25s', boxShadow: variant!=='outline'&&hov&&!disabled ? '0 0 0 2px rgba(201,168,76,.3), 0 6px 16px rgba(0,0,0,.15)' : 'none', transform: hov&&!disabled ? 'translateY(-1px)' : 'translateY(0)', whiteSpace:'nowrap' }}>
      {icon && <span style={{ lineHeight:0 }}>{icon}</span>}
      {children}
    </button>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────
export function Skeleton({ w='100%', h=20, radius=6 }) {
  return (
    <div style={{ width:w, height:h, borderRadius:radius, background:'linear-gradient(90deg,#f0e8d8 25%,#e8dcc8 50%,#f0e8d8 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

// ── Data Table ────────────────────────────────────────────────────
export function DataTable({ columns, data, loading }) {
  if (loading) return (
    <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:12 }}>
      {[...Array(5)].map((_,i) => <Skeleton key={i} h={48} radius={10} />)}
    </div>
  )
  if (!data.length) return (
    <div style={{ padding:'3rem', textAlign:'center', color:'#9a6040' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:'1rem', opacity:.4 }}><Icon name="box" size={48} color="#9a6040" /></div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:600 }}>No records found</div>
    </div>
  )
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
        <thead>
          <tr style={{ background:'rgba(201,168,76,.08)', borderBottom:'1px solid rgba(201,168,76,.2)' }}>
            {columns.map(c => (
              <th key={c.key} style={{ padding:'11px 14px', textAlign:'left', fontWeight:700, color:'#5a2e10', fontSize:'.75rem', letterSpacing:'.5px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} style={{ borderBottom:'1px solid rgba(201,168,76,.1)', transition:'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,.04)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {columns.map(c => (
                <td key={c.key} style={{ padding:'11px 14px', color:'#1a0400', verticalAlign:'middle', whiteSpace: c.wrap ? 'normal' : 'nowrap' }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(201,168,76,.15)', boxShadow:'0 2px 12px rgba(0,0,0,.06)', overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, trend, trendUp }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:'white', borderRadius:16, padding:'1.3rem 1.4rem', border:`1px solid ${hov ? AC.gold : 'rgba(201,168,76,.15)'}`, boxShadow: hov ? `0 0 0 1.5px ${AC.gold},0 8px 24px rgba(201,168,76,.12)` : '0 2px 12px rgba(0,0,0,.06)', transition:'all .3s', transform: hov ? 'translateY(-3px)' : 'translateY(0)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
        <div style={{ width:46, height:46, borderRadius:12, background: color || `linear-gradient(135deg,${AC.crimson},${AC.darkRed})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>
          {icon}
        </div>
        {trend && <span style={{ fontSize:'.72rem', fontWeight:700, color: trendUp ? '#166534' : '#991b1b', background: trendUp ? '#dcfce7' : '#fee2e2', padding:'3px 8px', borderRadius:20 }}>{trendUp ? '↑' : '↓'} {trend}</span>}
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:800, color:'#1a0400', marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:'.78rem', color:'#9a6040', fontWeight:500 }}>{label}</div>
    </div>
  )
}

// ── Sidebar menu items with SVG icons ─────────────────────────────
const menuItems = [
  { key:'dashboard',  label:'Dashboard',        icon:'dashboard'  },
  { key:'products',   label:'Products',          icon:'products'   },
  { key:'categories', label:'Categories',        icon:'categories' },
  { key:'orders',     label:'Orders',            icon:'orders'     },
  { key:'customers',  label:'Customers',         icon:'customers'  },
  { key:'payments',   label:'Payments',          icon:'payments'   },
  { key:'coupons',    label:'Coupons',           icon:'coupons'    },
  { key:'analytics',  label:'Analytics',         icon:'analytics'  },
  { key:'delivery',   label:'Delivery Tracking', icon:'delivery'   },
  { key:'reviews',    label:'Reviews',           icon:'reviews'    },
  { key:'settings',   label:'Settings',          icon:'settings'   },
  { key:'admins',     label:'Admins',            icon:'admins'     },
]

export function Sidebar({ active, onNav, collapsed, onLogout }) {
  return (
    <div style={{ width: collapsed ? 64 : AC.sidebarW, flexShrink:0, background: AC.sidebar, borderRight:'1px solid rgba(201,168,76,.15)', display:'flex', flexDirection:'column', height:'100vh', position:'sticky', top:0, transition:'width .3s ease', overflow:'hidden' }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '1.2rem .8rem' : '1.2rem 1.2rem', borderBottom:'1px solid rgba(201,168,76,.15)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <img src="/images/logo.png" alt="Puji" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:`1.5px solid ${AC.gold}`, flexShrink:0 }} />
        {!collapsed && (
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'.85rem', fontWeight:900, color:AC.goldL, letterSpacing:.5 }}>PUJI ADMIN</div>
            <div style={{ fontSize:'.55rem', color:'rgba(240,230,208,.5)', letterSpacing:'2px', textTransform:'uppercase' }}>Dashboard</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {menuItems.map(item => {
          const isActive = active === item.key
          const iconColor = isActive ? AC.goldL : 'rgba(240,230,208,.65)'
          return (
            <button key={item.key} onClick={() => onNav(item.key)}
              title={collapsed ? item.label : ''}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding: collapsed ? '12px 0' : '10px 14px', paddingLeft: collapsed ? 0 : 14, justifyContent: collapsed ? 'center' : 'flex-start', background: isActive ? 'linear-gradient(90deg,rgba(139,26,26,.6),rgba(107,15,15,.4))' : 'transparent', border:'none', borderLeft: isActive ? `3px solid ${AC.gold}` : '3px solid transparent', color: iconColor, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'.82rem', fontWeight: isActive ? 700 : 400, transition:'all .2s', textAlign:'left' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(201,168,76,.08)'; e.currentTarget.style.color=AC.cream } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(240,230,208,.65)' } }}
            >
              <Icon name={item.icon} size={17} color={iconColor} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding:'12px', borderTop:'1px solid rgba(201,168,76,.15)', flexShrink:0 }}>
        <button onClick={onLogout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding: collapsed ? '10px 0' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', background:'none', border:'1px solid rgba(220,50,50,.2)', borderRadius:10, color:'#e07070', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'.8rem', fontWeight:600, transition:'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(220,50,50,.1)'; e.currentTarget.style.borderColor='rgba(220,50,50,.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='rgba(220,50,50,.2)' }}
        >
          <Icon name="logout" size={17} color="#e07070" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  )
}

// ── Topbar ────────────────────────────────────────────────────────
export function Topbar({ title, onToggle, user, onLogout, onNav }) {
  const [notifOpen, setNotifOpen]       = useState(false)
  const [profileOpen, setProfileOpen]   = useState(false)
  const [dateRange, setDateRange]       = useState('Last 7 Days')
  const [showProfile, setShowProfile]   = useState(false)
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [pwdForm, setPwdForm]           = useState({ current:'', newPwd:'', confirm:'' })
  const [pwdError, setPwdError]         = useState('')
  const [pwdSuccess, setPwdSuccess]     = useState(false)
  const [toast, setToast]               = useState(null)
  const unread = notifications.filter(n => !n.read).length

  const handleChangePwd = () => {
    setPwdError('')
    if (!pwdForm.current)               return setPwdError('Current password is required')
    if (pwdForm.newPwd.length < 6)      return setPwdError('New password must be at least 6 characters')
    if (pwdForm.newPwd !== pwdForm.confirm) return setPwdError('Passwords do not match')
    setPwdSuccess(true)
    setTimeout(() => {
      setPwdSuccess(false)
      setShowChangePwd(false)
      setPwdForm({ current:'', newPwd:'', confirm:'' })
      setToast({ msg:'Password changed successfully!', type:'success' })
    }, 1500)
  }

  const PwdInput = ({ label, k, placeholder }) => (
    <div style={{ marginBottom:'1rem' }}>
      <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#7a4020', marginBottom:5 }}>{label}</label>
      <input type="password" value={pwdForm[k]} placeholder={placeholder}
        onChange={e => setPwdForm(p => ({ ...p, [k]: e.target.value }))}
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid rgba(201,168,76,.25)', outline:'none', fontSize:'.86rem', fontFamily:"'DM Sans',sans-serif", color:'#1a0400', transition:'border .2s' }}
        onFocus={e => e.target.style.borderColor = AC.gold}
        onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.25)'}
      />
    </div>
  )

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* View Profile Modal */}
      {showProfile && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:400, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:800, color:'#1a0400', margin:0 }}>Admin Profile</h2>
              <button onClick={() => setShowProfile(false)} style={{ background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14, color:'#7a4020' }}>✕</button>
            </div>
            {/* Avatar */}
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${AC.crimson},${AC.darkRed})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:800, color:'white', margin:'0 auto 1rem', border:`3px solid ${AC.gold}` }}>
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#1a0400' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize:'.75rem', color:AC.gold, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginTop:4 }}>Administrator</div>
            </div>
            {[
              ['Name',  user?.name  || '—'],
              ['Email', user?.email || '—'],
              ['Role',  'Admin'],
              ['Status','Active'],
            ].map(([l, v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(201,168,76,.08)' }}>
                <span style={{ fontSize:'.82rem', color:'#9a6040' }}>{l}</span>
                <span style={{ fontSize:'.82rem', fontWeight:600, color:'#1a0400' }}>{v}</span>
              </div>
            ))}
            <button onClick={() => { setShowProfile(false); if (onNav) onNav('settings') }}
              style={{ marginTop:'1.5rem', width:'100%', padding:'10px 0', borderRadius:50, border:`1.5px solid ${AC.gold}`, background:'transparent', color:AC.crimson, fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Edit in Settings →</button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePwd && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:400, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:800, color:'#1a0400', margin:0 }}>Change Password</h2>
              <button onClick={() => { setShowChangePwd(false); setPwdError(''); setPwdForm({ current:'', newPwd:'', confirm:'' }) }} style={{ background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14, color:'#7a4020' }}>✕</button>
            </div>
            {pwdSuccess ? (
              <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#166534' }}>Password Changed!</div>
              </div>
            ) : (
              <>
                <PwdInput label="Current Password" k="current" placeholder="Enter current password" />
                <PwdInput label="New Password"     k="newPwd"  placeholder="At least 6 characters" />
                <PwdInput label="Confirm Password" k="confirm" placeholder="Re-enter new password" />
                {pwdError && (
                  <div style={{ display:'flex', alignItems:'center', gap:6, color:'#c0392b', fontSize:'.8rem', marginBottom:'1rem', background:'#fee2e2', padding:'8px 12px', borderRadius:8 }}>
                    <Icon name="warning" size={14} color="#c0392b" /> {pwdError}
                  </div>
                )}
                <div style={{ display:'flex', gap:'1rem', marginTop:'.5rem' }}>
                  <button onClick={() => { setShowChangePwd(false); setPwdError(''); setPwdForm({ current:'', newPwd:'', confirm:'' }) }}
                    style={{ flex:1, padding:'10px 0', borderRadius:50, border:'1.5px solid rgba(201,168,76,.3)', background:'none', color:AC.crimson, fontWeight:600, fontSize:'.84rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                    Cancel
                  </button>
                  <button onClick={handleChangePwd}
                    style={{ flex:1, padding:'10px 0', borderRadius:50, border:'none', background:`linear-gradient(135deg,${AC.crimson},${AC.darkRed})`, color:'white', fontWeight:700, fontSize:'.84rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 14px rgba(107,15,15,.3)' }}>
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ height:64, background:'white', borderBottom:'1px solid rgba(201,168,76,.15)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,.05)', position:'sticky', top:0, zIndex:100 }}>
        {/* Left */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={onToggle} style={{ background:'none', border:'none', cursor:'pointer', padding:6, lineHeight:0 }}>
            <Icon name="menu" size={22} color={AC.crimson} />
          </button>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:800, color:'#1a0400', margin:0 }}>{title}</h1>
        </div>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          {/* Date Range */}
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            style={{ padding:'6px 12px', borderRadius:20, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.76rem', color:'#5a2e10', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'white', cursor:'pointer' }}>
            {['Today','Last 7 Days','This Month','This Year'].map(d => <option key={d}>{d}</option>)}
          </select>

          {/* Notifications */}
          <div style={{ position:'relative' }}>
            <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
              style={{ position:'relative', background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .2s', lineHeight:0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = AC.gold; e.currentTarget.style.background='rgba(201,168,76,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.2)'; e.currentTarget.style.background='none' }}
            >
              <Icon name="bell" size={17} color={AC.crimson} />
              {unread > 0 && <span style={{ position:'absolute', top:-3, right:-3, background:AC.crimson, color:'white', borderRadius:'50%', width:16, height:16, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</span>}
            </button>
            {notifOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'white', border:'1px solid rgba(201,168,76,.2)', borderRadius:14, width:300, boxShadow:'0 20px 50px rgba(0,0,0,.15)', zIndex:200 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(201,168,76,.1)', fontFamily:"'Playfair Display',serif", fontSize:'.9rem', fontWeight:700, color:'#1a0400' }}>Notifications</div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding:'10px 16px', borderBottom:'1px solid rgba(201,168,76,.08)', background: n.read ? 'transparent' : 'rgba(201,168,76,.04)', display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background: n.read ? '#ddd' : AC.gold, marginTop:5, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:'.78rem', color:'#1a0400', lineHeight:1.5 }}>{n.msg}</div>
                      <div style={{ fontSize:'.68rem', color:'#9a6040', marginTop:2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div style={{ position:'relative' }}>
            <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:`1px solid ${profileOpen ? AC.gold : 'rgba(201,168,76,.2)'}`, borderRadius:24, padding:'4px 12px 4px 4px', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = AC.gold; e.currentTarget.style.background='rgba(201,168,76,.05)' }}
              onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.borderColor = 'rgba(201,168,76,.2)'; e.currentTarget.style.background='none' } }}
            >
              <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,${AC.crimson},${AC.darkRed})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:800, color:'white', border:`1.5px solid ${AC.gold}` }}>
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:'.78rem', fontWeight:600, color:'#1a0400' }}>{user?.name?.split(' ')[0] || 'Admin'}</span>
              <Icon name="chevronDown" size={12} color="#9a6040" />
            </button>

            {profileOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'white', border:'1px solid rgba(201,168,76,.2)', borderRadius:12, minWidth:190, boxShadow:'0 20px 50px rgba(0,0,0,.15)', zIndex:200, padding:8 }}>
                {/* User info header */}
                <div style={{ padding:'8px 12px 10px', borderBottom:'1px solid rgba(201,168,76,.1)', marginBottom:6 }}>
                  <div style={{ fontSize:'.82rem', fontWeight:700, color:'#1a0400' }}>{user?.name || 'Admin'}</div>
                  <div style={{ fontSize:'.7rem', color:'#9a6040', marginTop:2 }}>{user?.email || 'admin@pujihomefoods.com'}</div>
                  <div style={{ fontSize:'.65rem', color:AC.gold, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginTop:3 }}>Administrator</div>
                </div>

                {/* View Profile */}
                <button
                  onClick={() => { setProfileOpen(false); setShowProfile(true) }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, background:'none', border:'none', color:'#1a0400', fontSize:'.8rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background .2s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name="profile" size={15} color={AC.crimson} /> View Profile
                </button>

                {/* Change Password */}
                <button
                  onClick={() => { setProfileOpen(false); setShowChangePwd(true) }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, background:'none', border:'none', color:'#1a0400', fontSize:'.8rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background .2s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name="key" size={15} color={AC.crimson} /> Change Password
                </button>

                <div style={{ height:1, background:'rgba(201,168,76,.15)', margin:'6px 0' }} />

                {/* Logout */}
                <button
                  onClick={() => { setProfileOpen(false); if (onLogout) onLogout() }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, background:'none', border:'none', color:'#c0392b', fontSize:'.8rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background .2s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name="logout" size={15} color="#c0392b" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
