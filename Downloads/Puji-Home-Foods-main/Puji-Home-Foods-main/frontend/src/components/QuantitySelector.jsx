const C = { gold: '#C9A84C', crimson: '#8B1A1A', darkRed: '#6B0F0F' }

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={(e) => { e.stopPropagation(); onDecrease() }}
        disabled={quantity <= 1}
        style={{
          width: 30, height: 30, borderRadius: '50%',
          border: `1.5px solid ${quantity <= 1 ? 'rgba(201,168,76,.2)' : C.gold}`,
          background: 'transparent',
          color: quantity <= 1 ? 'rgba(201,168,76,.3)' : C.gold,
          fontSize: '1.1rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          transition: 'all .2s',
        }}
        onMouseEnter={e => { if (quantity > 1) e.currentTarget.style.background = 'rgba(201,168,76,.12)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >−</button>

      <span style={{
        minWidth: 24, textAlign: 'center',
        fontWeight: 700, fontSize: '.95rem', color: '#1a0400',
        transition: 'transform .15s',
      }}>
        {quantity}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); onIncrease() }}
        style={{
          width: 30, height: 30, borderRadius: '50%',
          border: `1.5px solid ${C.gold}`,
          background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`,
          color: 'white', fontSize: '1.1rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}` }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
      >+</button>
    </div>
  )
}
