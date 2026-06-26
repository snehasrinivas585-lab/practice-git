import { useCart } from '../context/CartContext'
import QuantitySelector from './QuantitySelector'

const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F' }

export default function CartItem({ item }) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart()

  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      background: 'white', border: '1px solid rgba(201,168,76,.18)',
      borderRadius: 16, padding: '1rem', transition: 'all .3s',
      boxShadow: '0 2px 12px rgba(0,0,0,.05)',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1.5px #C9A84C, 0 8px 24px rgba(201,168,76,.1)'; e.currentTarget.style.borderColor = C.gold }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.05)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.18)' }}
    >
      {/* Image */}
      <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(201,168,76,.2)' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '.98rem', fontWeight: 700, color: '#1a0400', marginBottom: 2 }}>{item.name}</div>
        <div style={{ fontSize: '.72rem', color: '#9a6040', marginBottom: 8 }}>
          {item.category} · {item.weight >= 1000 ? `${item.weight / 1000} kg` : `${item.weight}g`} · ₹{item.finalPrice} each
        </div>
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => increaseQuantity(item.key)}
          onDecrease={() => decreaseQuantity(item.key)}
        />
      </div>

      {/* Subtotal + Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: C.crimson }}>
          ₹{item.subtotal}
        </span>
        <button
          onClick={() => removeFromCart(item.key)}
          style={{ background: 'none', border: '1px solid rgba(220,50,50,.25)', color: '#c0392b', padding: '4px 10px', borderRadius: 20, fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all .25s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,50,50,.08)'; e.currentTarget.style.borderColor = '#c0392b' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(220,50,50,.25)' }}
        >Remove</button>
      </div>
    </div>
  )
}
