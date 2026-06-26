import { useState } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { calculatePrice } from '../utils/calculatePrice'

const C = {
  gold: '#C9A84C', goldL: '#E8C97A',
  crimson: '#8B1A1A', darkRed: '#6B0F0F',
  cream: '#F5ECD7', maroon: '#3D0000', white: '#FFFFFF',
}

const WEIGHT_OPTIONS = [250, 500, 1000, 2000]

export default function Wishlist({ setPage, onCheckout }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState({})
  const [weights, setWeights]       = useState({})
  const [addedIds, setAddedIds]     = useState({})
  const [allAdded, setAllAdded]     = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderDone, setOrderDone]   = useState(false)

  const getQty    = id => quantities[id] || 1
  const getWeight = id => weights[id]    || 1000
  const setQty    = (id, v) => setQuantities(q => ({ ...q, [id]: Math.max(1, v) }))
  const setWeight = (id, v) => setWeights(w => ({ ...w, [id]: v }))

  const totalItems = wishlist.reduce((s, p) => s + getQty(p.id), 0)
  const totalPrice = wishlist.reduce((s, p) => s + calculatePrice(p.price, getWeight(p.id)) * getQty(p.id), 0)

  const handleAddOne = (p) => {
    addToCart(p, getWeight(p.id), getQty(p.id))
    setAddedIds(a => ({ ...a, [p.id]: true }))
    setTimeout(() => setAddedIds(a => ({ ...a, [p.id]: false })), 1400)
  }

  const handleAddAll = () => {
    wishlist.forEach(p => addToCart(p, getWeight(p.id), getQty(p.id)))
    setAllAdded(true)
    setTimeout(() => setAllAdded(false), 2000)
  }

  const handlePlaceOrder = () => {
    setOrderDone(true)
    clearWishlist()
    setTimeout(() => { setOrderDone(false); setShowCheckout(false); setPage('home') }, 2800)
  }

  // ── Empty state ──
  if (wishlist.length === 0 && !orderDone) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem 2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🤍</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: C.maroon, marginBottom: '1rem' }}>Your Wishlist is Empty</h2>
        <p style={{ color: '#9a6040', fontSize: '1rem', marginBottom: '2rem' }}>Click the ♥ heart on any product to save it here</p>
        <button onClick={() => setPage('products')}
          style={{ padding: '13px 32px', borderRadius: 50, background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(107,15,15,.35)' }}>
          Browse Products
        </button>
      </div>
    )
  }

  // ── Order success ──
  if (orderDone) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: C.maroon, marginBottom: '0.8rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: '#9a6040' }}>Redirecting you to home...</p>
      </div>
    )
  }

  // ── Checkout screen ──
  if (showCheckout) {
    const [form, setForm] = useState({ name: '', phone: '', address: '', pincode: '', payment: 'cod' })
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', paddingTop: 80 }}>
        <div style={{ background: `linear-gradient(135deg,${C.maroon},#5C0000)`, padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: 'white', fontWeight: 900 }}>
            <span style={{ color: C.gold }}>Checkout</span>
          </h1>
          <p style={{ color: 'rgba(240,230,208,.7)', fontSize: '.9rem', marginTop: 6 }}>{totalItems} item{totalItems !== 1 ? 's' : ''} · ₹{totalPrice}</p>
        </div>

        <div style={{ maxWidth: 960, margin: '2.5rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Left — form */}
          <div style={{ background: C.white, borderRadius: 20, border: '1px solid rgba(201,168,76,.2)', padding: '2rem', boxShadow: '0 6px 24px rgba(0,0,0,.07)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.maroon, fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 700 }}>Delivery Details</h3>
            {[
              { key: 'name',    label: 'Full Name',      placeholder: 'Your full name',          type: 'text' },
              { key: 'phone',   label: 'Phone Number',   placeholder: '10-digit mobile number',  type: 'tel' },
              { key: 'address', label: 'Delivery Address', placeholder: 'Street, Area, City',   type: 'text' },
              { key: 'pincode', label: 'PIN Code',       placeholder: '6-digit PIN code',        type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#7a4020', marginBottom: 5, letterSpacing: '.3px' }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid rgba(201,168,76,.3)', outline: 'none', fontSize: '.88rem', color: '#1a0400', background: '#FAFAFA', fontFamily: "'DM Sans', sans-serif", transition: 'border .2s' }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.3)'}
                />
              </div>
            ))}

            <div style={{ marginTop: '1.4rem' }}>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#7a4020', marginBottom: 10, letterSpacing: '.3px' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[{ val: 'cod', label: '💵 Cash on Delivery' }, { val: 'upi', label: '📱 UPI / QR' }, { val: 'card', label: '💳 Card' }].map(opt => (
                  <button key={opt.val} onClick={() => setForm(prev => ({ ...prev, payment: opt.val }))}
                    style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `1.5px solid ${form.payment === opt.val ? C.gold : 'rgba(201,168,76,.25)'}`, background: form.payment === opt.val ? `linear-gradient(135deg,${C.crimson},${C.darkRed})` : 'transparent', color: form.payment === opt.val ? 'white' : '#7a4020', fontWeight: 600, fontSize: '.78rem', cursor: 'pointer', transition: 'all .2s' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div style={{ background: C.white, borderRadius: 20, border: '1px solid rgba(201,168,76,.2)', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,.07)', position: 'sticky', top: 96 }}>
            <div style={{ background: `linear-gradient(135deg,${C.maroon},#5C0000)`, padding: '1.1rem 1.4rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Order Summary</h3>
            </div>
            <div style={{ padding: '1.2rem 1.4rem' }}>
              {wishlist.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                  <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#1a0400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: '.7rem', color: '#9a6040' }}>{getWeight(p.id) >= 1000 ? `${getWeight(p.id)/1000}kg` : `${getWeight(p.id)}g`} × {getQty(p.id)}</div>
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: C.crimson, flexShrink: 0 }}>₹{calculatePrice(p.price, getWeight(p.id)) * getQty(p.id)}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `2px solid rgba(201,168,76,.2)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#7a4020', marginBottom: 6 }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600 }}>₹{totalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#2a7a2a', marginBottom: 12 }}>
                  <span>🚚 Delivery</span><span style={{ fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: C.maroon, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,.2)' }}>
                  <span>Total</span><span style={{ color: C.crimson }}>₹{totalPrice}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder}
                style={{ width: '100%', marginTop: '1.2rem', padding: '13px 0', borderRadius: 50, border: 'none', background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(107,15,15,.3)', transition: 'all .3s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 10px 26px rgba(107,15,15,.4)`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,15,15,.3)'}
              >Place Order ✓</button>
              <button onClick={() => setShowCheckout(false)}
                style={{ width: '100%', marginTop: '.7rem', padding: '11px 0', borderRadius: 50, border: `1.5px solid ${C.gold}`, background: 'transparent', color: C.crimson, fontWeight: 600, fontSize: '.88rem', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >← Back to Wishlist</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main wishlist page ──
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', paddingTop: 80 }}>
      
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.maroon},#5C0000)`, padding: '3rem 2rem 2.5rem', textAlign: 'center', position: 'relative' }}>
        <button
  onClick={() => setPage('portal')}
  style={{
    position: 'absolute',
    left: '30px',
    top: '30px',
    background: '#fff',
    color: C.maroon,
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  }}
>
  ← Back to Portal
</button>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        <p style={{ fontSize: '.72rem', letterSpacing: '5px', textTransform: 'uppercase', color: C.gold, fontWeight: 800, marginBottom: 8 }}>My Collection</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, marginBottom: 6 }}>
          <span style={{ color: 'white' }}>My </span>
          <span style={{ color: C.gold }}>Wish List</span>
        </h1>
        <p style={{ color: 'rgba(240,230,208,.75)', fontSize: '.92rem', marginBottom: 0 }}>
          Add your items to cart &amp; checkout when ready
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* LEFT — product list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Actions bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.9rem', color: '#7a4020', fontWeight: 600 }}>{wishlist.length} Product{wishlist.length !== 1 ? 's' : ''} saved</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleAddAll}
                  style={{ background: allAdded ? '#2a7a2a' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`, border: 'none', color: 'white', padding: '8px 18px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all .3s' }}>
                  {allAdded ? '✓ All Added!' : '🛒 Add All to Cart'}
                </button>
                <button onClick={clearWishlist}
                  style={{ background: 'none', border: '1px solid rgba(139,26,26,.3)', color: C.crimson, padding: '8px 16px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all .3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,26,26,.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >Clear All</button>
              </div>
            </div>

            {wishlist.map(p => {
              const w  = getWeight(p.id)
              const q  = getQty(p.id)
              const pr = calculatePrice(p.price, w)
              return (
                <div key={p.id} style={{ background: C.white, borderRadius: 18, border: '1px solid rgba(201,168,76,.18)', boxShadow: '0 4px 20px rgba(0,0,0,.06)', padding: '1.2rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 100, height: 100, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(201,168,76,.22)' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.02rem', color: '#1a0400' }}>{p.name}</div>
                        <div style={{ fontSize: '.72rem', color: '#9a6040', marginTop: 2 }}>{p.category} · Base ₹{p.price}</div>
                      </div>
                      <button onClick={() => removeFromWishlist(p.id)}
                        style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '1.1rem', cursor: 'pointer', padding: '2px 6px', borderRadius: 6, transition: 'color .2s', lineHeight: 1 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e74c3c'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                        title="Remove">✕</button>
                    </div>

                    {/* Weight selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {WEIGHT_OPTIONS.map(wt => (
                        <button key={wt} onClick={() => setWeight(p.id, wt)}
                          style={{ padding: '4px 11px', borderRadius: 20, border: `1.5px solid ${w === wt ? C.gold : 'rgba(201,168,76,.25)'}`, background: w === wt ? `linear-gradient(135deg,${C.crimson},${C.darkRed})` : 'transparent', color: w === wt ? 'white' : '#7a4020', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
                          {wt >= 1000 ? `${wt/1000}kg` : `${wt}g`}
                        </button>
                      ))}
                    </div>

                    {/* Qty + price + cart */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => setQty(p.id, q - 1)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${q <= 1 ? 'rgba(201,168,76,.2)' : C.gold}`, background: 'transparent', color: q <= 1 ? 'rgba(201,168,76,.3)' : C.gold, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: q <= 1 ? 'not-allowed' : 'pointer' }}>−</button>
                        <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 700, fontSize: '.9rem', color: '#1a0400' }}>{q}</span>
                        <button onClick={() => setQty(p.id, q + 1)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${C.gold}`, background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: C.crimson, marginLeft: 6 }}>₹{pr * q}</span>
                      </div>
                      <button onClick={() => handleAddOne(p)}
                        style={{ padding: '8px 20px', borderRadius: 50, border: 'none', background: addedIds[p.id] ? '#2a7a2a' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontWeight: 600, fontSize: '.82rem', cursor: 'pointer', transition: 'all .3s', boxShadow: '0 4px 12px rgba(107,15,15,.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {addedIds[p.id] ? '✓ Added!' : '🛒 Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT — order summary */}
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{ background: C.white, borderRadius: 20, border: '1px solid rgba(201,168,76,.22)', boxShadow: '0 8px 32px rgba(0,0,0,.08)', overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg,${C.maroon},#5C0000)`, padding: '1.2rem 1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Order Summary</h3>
              </div>
              <div style={{ padding: '1.4rem 1.5rem' }}>
                {wishlist.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,.1)', fontSize: '.83rem' }}>
                    <span style={{ color: '#5a2e10', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name} ×{getQty(p.id)}</span>
                    <span style={{ fontWeight: 700, color: C.crimson }}>₹{calculatePrice(p.price, getWeight(p.id)) * getQty(p.id)}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `2px solid rgba(201,168,76,.2)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#7a4020', marginBottom: 6 }}>
                    <span>Subtotal ({totalItems} items)</span>
                    <span style={{ fontWeight: 600 }}>₹{totalPrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#2a7a2a', marginBottom: 12 }}>
                    <span>🚚 Delivery</span>
                    <span style={{ fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: C.maroon, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,.2)' }}>
                    <span>Total</span>
                    <span style={{ color: C.crimson }}>₹{totalPrice}</span>
                  </div>
                </div>
                <button onClick={() => { if (onCheckout) onCheckout(); else setShowCheckout(true) }}
                  style={{ width: '100%', marginTop: '1.2rem', padding: '13px 0', borderRadius: 50, border: 'none', background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer', transition: 'all .3s', boxShadow: '0 6px 20px rgba(107,15,15,.3)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 10px 26px rgba(107,15,15,.4)`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,15,15,.3)'}
                >Proceed to Checkout →</button>
                <button onClick={() => setPage('products')}
                  style={{ width: '100%', marginTop: '.75rem', padding: '11px 0', borderRadius: 50, border: `1.5px solid ${C.gold}`, background: 'transparent', color: C.crimson, fontWeight: 600, fontSize: '.88rem', cursor: 'pointer', transition: 'all .3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >← Continue Shopping</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
