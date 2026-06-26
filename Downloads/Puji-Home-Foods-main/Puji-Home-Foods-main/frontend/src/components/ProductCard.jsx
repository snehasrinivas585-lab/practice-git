import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../auth/AuthContext'
import { calculatePrice } from '../utils/calculatePrice'
import WeightSelector from './WeightSelector'

const C = {
  gold:    '#C9A84C',
  goldL:   '#E8C97A',
  crimson: '#8B1A1A',
  darkRed: '#6B0F0F',
  cream:   '#F5ECD7',
  white:   '#FFFFFF',
}

export default function ProductCard({ p, onWishlistClick }) {
  const { addToCart } = useCart()
const { user, openAuth } = useAuth()
const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const [hov, setHov]     = useState(false)
  const [weight, setWeight] = useState(1000)
  const [qty, setQty]     = useState(1)
  const [flash, setFlash] = useState(false)

  const wished = isWishlisted(p._id || p.id)
  const price  = calculatePrice(Number(p.price), weight)

  const handleAdd = (e) => {
  e.stopPropagation()

  console.log("PRODUCT OBJECT:", p)

  if (!user) {
    openAuth('picker')
    return
  }

  addToCart(p, weight, qty)

  setFlash(true)
  setTimeout(() => setFlash(false), 1200)
}

  const handleWish = (e) => {
    e.stopPropagation()
    if (wished) removeFromWishlist(p._id || p.id)
    else addToWishlist(p)
  }

  return (
    <>
      <style>{`
        .pc-root {
          background: #fff;
          border: 1px solid rgba(201,168,76,.18);
          border-radius: 20px;
          overflow: hidden;
          transition: all .35s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,.07);
          height: 100%;
        }
        .pc-root:hover {
          border-color: #C9A84C;
          transform: translateY(-6px);
          box-shadow: 0 0 0 1.5px #C9A84C, 0 24px 55px rgba(201,168,76,.14), 0 8px 20px rgba(0,0,0,.08);
        }
        .pc-img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1;
        }
        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .5s ease;
        }
        .pc-root:hover .pc-img {
          transform: scale(1.08);
        }
        .pc-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(26,4,0,.75);
          backdrop-filter: blur(8px);
          color: #E8C97A;
          font-size: .65rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: .5px;
          border: 1px solid rgba(201,168,76,.3);
        }
        .pc-wish-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 17px;
          box-shadow: 0 2px 10px rgba(0,0,0,.12);
          transition: all .25s;
          touch-action: manipulation;
        }
        .pc-body {
          padding: 0.85rem 1rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a0400;
          margin-bottom: 1px;
          line-height: 1.3;
        }
        .pc-sub {
          font-size: .68rem;
          color: #9a6040;
        }
        .pc-stars {
          color: #C9A84C;
          font-size: .72rem;
          letter-spacing: 1px;
        }
        .pc-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 3px;
        }
        .pc-qty-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
          transition: all .2s;
          touch-action: manipulation;
        }
        .pc-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #8B1A1A;
        }
        .pc-add-btn {
          margin-top: 4px;
          width: 100%;
          padding: 11px 0;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: .85rem;
          cursor: pointer;
          transition: all .3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          touch-action: manipulation;
          min-height: 44px;
        }

        /* Mobile tweaks */
        @media (max-width: 480px) {
          .pc-body {
            padding: 0.75rem 0.85rem 0.9rem;
            gap: 6px;
          }
          .pc-name {
            font-size: 0.88rem;
          }
          .pc-add-btn {
            font-size: .8rem;
            padding: 10px 0;
          }
          .pc-price {
            font-size: 1rem;
          }
        }
      `}</style>

      <div
        className="pc-root"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Image */}
        <div className="pc-img-wrap">
          <img
            src={
              p.image?.startsWith('http')
                ? p.image
                : `https://puji-home-foods.onrender.com${p.image}`
            }
            alt={p.name}
            className="pc-img"
          />
          <div className="pc-badge">{p.category}</div>
          <button
            onClick={handleWish}
            title={wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className="pc-wish-btn"
            style={{
              background: wished ? 'rgba(231,76,60,.12)' : 'rgba(255,255,255,.9)',
              border: wished ? '1.5px solid #e74c3c' : 'none',
              color: wished ? '#e74c3c' : '#bbb',
            }}
          >
            {wished ? '♥' : '♡'}
          </button>
        </div>

        {/* Info */}
        <div className="pc-body">
          <div>
            <div className="pc-name">{p.name}</div>
            <div className="pc-sub">{p.grams} · Base ₹{p.price}</div>
          </div>
          <div className="pc-stars">★★★★★</div>
          <WeightSelector selected={weight} onChange={setWeight} />
          <div className="pc-qty-row">
            <div className="pc-qty-controls">
              <button
                onClick={e => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)) }}
                className="pc-qty-btn"
                style={{
                  border: `1.5px solid ${qty <= 1 ? 'rgba(201,168,76,.2)' : C.gold}`,
                  background: 'transparent',
                  color: qty <= 1 ? 'rgba(201,168,76,.3)' : C.gold,
                  cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                }}
              >−</button>
              <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontSize: '.9rem', color: '#1a0400' }}>{qty}</span>
              <button
                onClick={e => { e.stopPropagation(); setQty(q => q + 1) }}
                className="pc-qty-btn"
                style={{
                  border: `1.5px solid ${C.gold}`,
                  background: `linear-gradient(135deg,${C.crimson},${C.darkRed})`,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >+</button>
            </div>
            <span className="pc-price">₹{price * qty}</span>
          </div>
          <button
            onClick={handleAdd}
            className="pc-add-btn"
            style={{
              border: `1px solid ${flash ? '#2a7a2a' : C.gold}`,
              background: flash ? '#2a7a2a' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`,
              boxShadow: flash ? '0 0 0 2px #2a7a2a' : `0 4px 14px rgba(107,15,15,.3)`,
            }}
          >
            {flash ? <>✓ Added!</> : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
