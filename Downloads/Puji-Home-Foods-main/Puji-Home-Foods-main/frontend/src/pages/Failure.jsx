const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F', brown: '#2A1005' }

export default function Failure({ onRetry, onBackToCart }) {
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg,${C.brown},#0d0200)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: 90 }}>
      <div style={{ maxWidth: 520, width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 24, padding: '3rem 2.5rem', backdropFilter: 'blur(20px)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,#c0392b,transparent)` }} />

        {/* Failure icon */}
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(192,57,43,.15)', border: '3px solid #c0392b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(192,57,43,.25)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <div style={{ fontSize: '.72rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#c0392b', marginBottom: 8 }}>Payment Failed</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '.5rem' }}>
          Oops! Something went wrong
        </h1>
        <p style={{ color: 'rgba(240,230,208,.65)', fontSize: '.9rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Your payment could not be processed. Don't worry — no amount was charged. Please try again or contact our support team.
        </p>

        {/* Support note */}
        <div style={{ background: 'rgba(201,168,76,.07)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '2rem', fontSize: '.82rem', color: 'rgba(240,230,208,.6)', lineHeight: 1.6 }}>
          Need help? Write to us at{' '}
          <a href="mailto:hello@pujihomefoods.com" style={{ color: C.goldL, textDecoration: 'none' }}>hello@pujihomefoods.com</a>
          {' '}or call{' '}
          <a href="tel:+919876543210" style={{ color: C.goldL, textDecoration: 'none' }}>+91 98765 43210</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onBackToCart}
            style={{ flex: 1, padding: '12px 0', borderRadius: 50, border: `1px solid ${C.gold}`, background: 'none', color: C.goldL, fontWeight: 600, fontSize: '.88rem', cursor: 'pointer', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.1)'; e.currentTarget.style.boxShadow = `0 0 0 1.5px ${C.gold}` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >← Back to Cart</button>

          <button
            onClick={onRetry}
            style={{ flex: 1, padding: '12px 0', borderRadius: 50, background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: `1px solid rgba(201,168,76,.3)`, color: 'white', fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(107,15,15,.35)', transition: 'all .3s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 8px 24px rgba(107,15,15,.45)`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,15,15,.35)'}
          >Retry Payment →</button>
        </div>
      </div>
    </div>
  )
}
