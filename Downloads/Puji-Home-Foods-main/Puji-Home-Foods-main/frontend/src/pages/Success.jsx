import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F', brown: '#2A1005' }

// Simple CSS confetti
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: ['#C9A84C','#E8C97A','#8B1A1A','#F5ECD7','#D4A017'][Math.floor(Math.random() * 5)],
    size: 6 + Math.random() * 8,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998, overflow: 'hidden' }}>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: 0, left: p.left,
          width: p.size, height: p.size,
          background: p.color, borderRadius: Math.random() > 0.5 ? '50%' : 2,
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

export default function Success({ customerName, totalAmount, onContinue }) {
  const { clearCart } = useCart()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    clearCart()
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const orderId = `PUJI${Date.now().toString().slice(-6)}`
  const delivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      {showConfetti && <Confetti />}
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg,${C.brown},#0d0200)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: 90 }}>
        <div style={{ maxWidth: 560, width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 24, padding: '3rem 2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

          {/* Top glow line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />

          {/* Success icon */}
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(42,122,42,.2)', border: '3px solid #2a7a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(42,122,42,.3)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2a7a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <div style={{ fontSize: '.72rem', letterSpacing: '5px', textTransform: 'uppercase', color: C.gold, marginBottom: 8 }}>Order Confirmed</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '.5rem' }}>
            Thank You, {customerName?.split(' ')[0] || 'Friend'}! 🎉
          </h1>
          <p style={{ color: 'rgba(240,230,208,.7)', fontSize: '.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your order has been placed successfully. We'll prepare it with love and deliver it fresh to your door.
          </p>

          {/* Details card */}
          <div style={{ background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.22)', borderRadius: 16, padding: '1.2rem 1.5rem', marginBottom: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Order ID',           orderId],
              ['Amount Paid',        `₹${totalAmount}`],
              ['Estimated Delivery', delivery],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'rgba(240,230,208,.55)' }}>{label}</span>
                <span style={{ fontSize: '.88rem', fontWeight: 700, color: C.goldL }}>{val}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onContinue}
            style={{ width: '100%', padding: '13px 0', borderRadius: 50, background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: `1px solid rgba(201,168,76,.35)`, color: 'white', fontWeight: 700, fontSize: '.92rem', cursor: 'pointer', boxShadow: '0 4px 18px rgba(107,15,15,.4)', transition: 'all .3s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 10px 28px rgba(107,15,15,.5)`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(107,15,15,.4)'}
          >Continue Shopping →</button>
        </div>
      </div>
    </>
  )
}
