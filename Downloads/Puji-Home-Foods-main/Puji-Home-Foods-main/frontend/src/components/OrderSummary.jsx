import { useCart } from '../context/CartContext'

const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F', brown: '#2A1005' }

export default function OrderSummary({ showItems = true, onCheckout, checkoutLabel = 'Proceed to Payment' }) {
  const { cart, subtotal, deliveryCharge, grandTotal } = useCart()

  return (
    <div style={{
      background: 'white', border: '1px solid rgba(201,168,76,.2)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,.08)',
      position: 'sticky', top: 90,
    }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.brown},${C.darkRed})`, padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(201,168,76,.3)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: C.goldL }}>Order Summary</div>
        <div style={{ fontSize: '.75rem', color: 'rgba(240,230,208,.6)', marginTop: 2 }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ padding: '1.2rem 1.4rem' }}>
        {/* Items list */}
        {showItems && cart.length > 0 && (
          <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.key} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(201,168,76,.2)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#1a0400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: '.68rem', color: '#9a6040' }}>
                    {item.weight >= 1000 ? `${item.weight/1000}kg` : `${item.weight}g`} × {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '.85rem', color: C.crimson, flexShrink: 0 }}>₹{item.subtotal}</div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(201,168,76,.15)', marginBottom: '1rem' }} />

        {/* Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row label="Subtotal" value={`₹${subtotal}`} />
          <Row
            label="Delivery"
            value={deliveryCharge === 0 ? (subtotal > 0 ? 'FREE 🎉' : '—') : `₹${deliveryCharge}`}
            valueColor={deliveryCharge === 0 && subtotal > 0 ? '#2a7a2a' : undefined}
          />
          {deliveryCharge > 0 && (
            <div style={{ fontSize: '.7rem', color: '#9a6040', marginTop: -4 }}>Free delivery on orders above ₹999</div>
          )}
          <div style={{ height: 1, background: 'rgba(201,168,76,.15)', margin: '4px 0' }} />
          <Row label="Grand Total" value={`₹${grandTotal}`} bold />
        </div>

        {/* CTA */}
        {onCheckout && (
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            style={{
              marginTop: '1.2rem', width: '100%', padding: '13px 0', borderRadius: 50,
              background: cart.length === 0 ? '#ccc' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`,
              border: `1px solid ${cart.length === 0 ? '#bbb' : 'rgba(201,168,76,.35)'}`,
              color: 'white', fontWeight: 700, fontSize: '.9rem', cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all .3s',
              boxShadow: cart.length > 0 ? '0 4px 16px rgba(107,15,15,.3)' : 'none',
            }}
            onMouseEnter={e => { if (cart.length > 0) e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 8px 24px rgba(107,15,15,.4)` }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = cart.length > 0 ? '0 4px 16px rgba(107,15,15,.3)' : 'none' }}
          >
            {checkoutLabel} →
          </button>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: bold ? '.9rem' : '.82rem', fontWeight: bold ? 700 : 400, color: bold ? '#1a0400' : '#7a4020' }}>{label}</span>
      <span style={{ fontSize: bold ? '1rem' : '.85rem', fontWeight: bold ? 800 : 600, color: valueColor || (bold ? '#8B1A1A' : '#1a0400'), fontFamily: bold ? "'Playfair Display', serif" : 'inherit' }}>{value}</span>
    </div>
  )
}
