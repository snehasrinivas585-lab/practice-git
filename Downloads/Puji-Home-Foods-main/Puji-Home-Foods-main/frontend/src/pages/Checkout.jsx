import { useState } from 'react'
import OrderSummary from '../components/OrderSummary'
import { useCart } from '../context/CartContext'
import { useAuth } from '../auth/AuthContext'

const C = { gold: '#C9A84C', goldL: '#E8C97A', crimson: '#8B1A1A', darkRed: '#6B0F0F', brown: '#2A1005', offWhite: '#FAF7F2' }

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli & Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
]

const FIELDS = [
  { key: 'name',    label: 'Full Name',    type: 'text', placeholder: 'e.g. Priya Sharma',       half: false },
  { key: 'phone',   label: 'Phone Number', type: 'tel',  placeholder: 'e.g. 9876543210',         half: true  },
  { key: 'pincode', label: 'Pincode',      type: 'text', placeholder: 'e.g. 500001',              half: true  },
  { key: 'address', label: 'Full Address', type: 'text', placeholder: 'House No., Street, Area', half: false },
  { key: 'city',    label: 'City',         type: 'text', placeholder: 'e.g. Hyderabad',          half: true  },
]

function validate(form) {
  const errors = {}
  if (!form.name.trim())                 errors.name    = 'Full name is required'
  if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone   = 'Enter a valid 10-digit phone number'
  if (!/^\d{6}$/.test(form.pincode))    errors.pincode = 'Enter a valid 6-digit pincode'
  if (!form.address.trim())             errors.address = 'Address is required'
  if (!form.city.trim())                errors.city    = 'City is required'
  if (!form.state)                      errors.state   = 'Please select a state'
  return errors
}

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem('puji_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || null
  } catch {
    return null
  }
}

export default function Checkout({ onBack, onSuccess, onFailure }) {
  const { cart, grandTotal } = useCart()
  const { user } = useAuth()
  const [form, setForm]             = useState({ name:'', phone:'', pincode:'', address:'', city:'', state:'' })
  const [errors, setErrors]         = useState({})
  const [focused, setFocused]       = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [payError, setPayError]     = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    if (payError) setPayError('')
  }

  const handleSubmit = async () => {

  if (cart.length === 0) {
    alert("Your cart is empty")
    return
  }

  if (paymentMethod === 'ONLINE') {
    alert('Online Payment Coming Soon')
    return
  }
    if (paymentMethod === 'ONLINE') {
  alert('Online Payment Coming Soon');
  return;
}
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    setPayError('')

    try {
      const userId = user?._id || user?.id || getUserIdFromToken()
      console.log('SAVING ORDER WITH USERID:', userId)
      console.log("AUTH USER:", user)
      console.log("USER ID:", userId)
      console.log("CART ITEMS:", cart)

      const orderData = {
        customerName: form.name,
        email: user?.email || "",
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        products: cart.map(item => ({
  productId: String(item.id),
  name: item.name,
  image: item.image,
  weight: String(item.weight),
  quantity: item.quantity,
  price: item.finalPrice,
})),
        totalAmount: grandTotal,
       paymentMethod: paymentMethod,
paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
orderStatus: 'Pending',
        userId: userId,
      }

      const res = await fetch('https://puji-home-foods.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) throw new Error('Order failed')

      setSubmitting(false)
      onSuccess(form)

    } catch (err) {
      setSubmitting(false)
      setPayError('Something went wrong. Please try again.')
      onFailure()
    }
  }

  const inputStyle = (key) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${errors[key] ? '#c0392b' : focused === key ? C.gold : 'rgba(201,168,76,.25)'}`,
    outline: 'none', fontSize: '.88rem', color: '#1a0400',
    background: focused === key ? 'rgba(201,168,76,.04)' : 'white',
    transition: 'all .25s',
    boxShadow: focused === key ? '0 0 0 3px rgba(201,168,76,.12)' : 'none',
    fontFamily: "'DM Sans', sans-serif",
  })

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite, paddingTop: 90 }}>
      <div style={{ background: `linear-gradient(135deg,${C.brown},${C.darkRed})`, padding: '2.5rem 2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Almost There</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, color: 'white', margin: 0 }}>
            Delivery <span style={{ color: C.goldL }}>Details</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem 4rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid rgba(201,168,76,.15)', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1a0400', marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
            Shipping Information
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {FIELDS.map(f => (
              <div key={f.key} style={{ gridColumn: f.half ? 'auto' : 'span 2' }}>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: focused === f.key ? C.crimson : '#7a4020', marginBottom: 6, transition: 'color .2s', letterSpacing: '.3px' }}>
                  {f.label} <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <input
                  type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)}
                  style={inputStyle(f.key)}
                />
                {errors[f.key] && (
                  <div style={{ fontSize: '.72rem', color: '#c0392b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⚠ {errors[f.key]}
                  </div>
                )}
              </div>
            ))}

            <div style={{ gridColumn: 'auto' }}>
              <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: focused === 'state' ? C.crimson : '#7a4020', marginBottom: 6, transition: 'color .2s', letterSpacing: '.3px' }}>
                State <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <select
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
                onFocus={() => setFocused('state')} onBlur={() => setFocused(null)}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: `1.5px solid ${errors.state ? '#c0392b' : focused === 'state' ? C.gold : 'rgba(201,168,76,.25)'}`,
                  outline: 'none', fontSize: '.88rem', color: form.state ? '#1a0400' : '#9a9a9a',
                  background: 'white', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  boxShadow: focused === 'state' ? '0 0 0 3px rgba(201,168,76,.12)' : 'none',
                  transition: 'all .25s',
                }}
              >
                <option value="" disabled>Select your state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && (
                <div style={{ fontSize: '.72rem', color: '#c0392b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ⚠ {errors.state}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
  <h3 style={{ marginBottom: '10px' }}>Payment Method</h3>

  <label style={{ display: 'block', marginBottom: '10px' }}>
    <input
      type="radio"
      value="COD"
      checked={paymentMethod === 'COD'}
      onChange={() => setPaymentMethod('COD')}
    />
    {' '}Cash on Delivery
  </label>

  <label style={{ display: 'block' }}>
    <input
      type="radio"
      value="ONLINE"
      checked={paymentMethod === 'ONLINE'}
      onChange={() => setPaymentMethod('ONLINE')}
    />
    {' '}Online Payment (Coming Soon)
  </label>
</div>

          {payError && (
            <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fee2e2', border: '1px solid rgba(192,57,43,.3)', borderRadius: 10, padding: '10px 14px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '.82rem', color: '#c0392b', fontWeight: 600 }}>{payError}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button onClick={onBack}
              style={{ flex: '0 0 auto', padding: '11px 24px', borderRadius: 50, border: `1px solid ${C.gold}`, background: 'none', color: C.crimson, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.1)'; e.currentTarget.style.boxShadow = `0 0 0 1.5px ${C.gold}` }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >← Back to Cart</button>

            <button onClick={handleSubmit} disabled={submitting}
              style={{ flex: 1, padding: '12px 24px', borderRadius: 50, border: '1px solid rgba(201,168,76,.35)', background: submitting ? '#bbb' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`, color: 'white', fontWeight: 700, fontSize: '.9rem', cursor: submitting ? 'wait' : 'pointer', transition: 'all .3s', boxShadow: submitting ? 'none' : '0 4px 16px rgba(107,15,15,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.boxShadow = `0 0 0 2px ${C.gold}, 0 8px 24px rgba(107,15,15,.4)` }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,15,15,.3)' }}
            >
              {submitting ? (
                <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2.5px solid rgba(255,255,255,.3)', borderTop: '2.5px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Processing…</>
              ) : 'Proceed to Payment →'}
            </button>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>

        <OrderSummary showItems checkoutLabel={null} />
      </div>
    </div>
  )
}