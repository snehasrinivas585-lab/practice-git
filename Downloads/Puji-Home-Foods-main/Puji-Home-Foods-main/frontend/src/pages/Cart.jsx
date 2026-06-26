import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'

const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F', brown: '#2A1005', offWhite: '#FAF7F2' }

export default function Cart({ onCheckout, onContinue }) {
  const { cart, clearCart } = useCart()

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite, paddingTop: 90 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.brown},${C.darkRed})`, padding: '2.5rem 2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Your Order</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, color: 'white', margin: 0 }}>
            Shopping <span style={{ color: C.goldL }}>Cart</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 4rem', display: 'grid', gridTemplateColumns: cart.length === 0 ? '1fr' : '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {cart.length === 0 ? (
          <EmptyCart onContinue={onContinue} />
        ) : (
          <>
            {/* Left – items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1a0400' }}>
                  {cart.length} Item{cart.length !== 1 ? 's' : ''} in Cart
                </div>
                <button onClick={clearCart}
                  style={{ background: 'none', border: '1px solid rgba(220,50,50,.3)', color: '#c0392b', padding: '5px 14px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all .25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,50,50,.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >Clear All</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map(item => <CartItem key={item.key} item={item} />)}
              </div>

              <button onClick={onContinue}
                style={{ marginTop: '1.5rem', background: 'none', border: `1px solid ${C.gold}`, color: C.crimson, padding: '10px 24px', borderRadius: 50, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', transition: 'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.1)'; e.currentTarget.style.boxShadow = `0 0 0 1.5px ${C.gold}` }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >← Continue Shopping</button>
            </div>

            {/* Right – summary */}
            <OrderSummary onCheckout={onCheckout} checkoutLabel="Proceed to Checkout" />
          </>
        )}
      </div>
    </div>
  )
}

function EmptyCart({ onContinue }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 20, border: '1px solid rgba(201,168,76,.15)', boxShadow: '0 4px 20px rgba(0,0,0,.06)', maxWidth: 540, margin: '0 auto' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1a0400', marginBottom: '.5rem' }}>Your cart is empty</h2>
      <p style={{ color: '#9a6040', fontSize: '.9rem', marginBottom: '1.8rem' }}>
        Looks like you haven't added anything yet. Explore our delicious homemade range!
      </p>
      <button onClick={onContinue}
        style={{ background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: `1px solid rgba(201,168,76,.35)`, color: 'white', padding: '13px 32px', borderRadius: 50, fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(107,15,15,.3)', transition: 'all .3s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 8px 24px rgba(107,15,15,.4)`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,15,15,.3)'}
      >Browse Products →</button>
    </div>
  )
}
