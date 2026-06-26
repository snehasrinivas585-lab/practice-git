import { useAuth } from '../auth/AuthContext'
import { useState, useEffect } from 'react'
import {
  FaShoppingBag,
  FaHeart,
  FaHome,
  FaShieldAlt,
  FaTachometerAlt,
  FaBox,
  FaCog,
  FaUser,
} from 'react-icons/fa'

const C = {
  gold: '#C9A84C',
  cream: '#F5ECD7',
  maroon: '#3D0000',
  crimson: '#8B1A1A',
  white: '#FFFFFF',
}

export default function CustomerPortal({ setPage, wishlist }) {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
const [cancelOrderId, setCancelOrderId] = useState(null)
const [rating, setRating] = useState(5)
const [reviewText, setReviewText] = useState('')
const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const userId = user?.id || user?._id
    if (!userId) return

    fetch(`https://puji-home-foods.onrender.com/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.log(err))
  }, [user])

  const handleCancelOrder = async (orderId) => {
  try {
      const res = await fetch(
        `https://puji-home-foods.onrender.com/api/orders/${orderId}/cancel`,
        { method: 'PUT' }
      )
      if (!res.ok) throw new Error('Failed')
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
        )
      )
      setShowCancelModal(false)
    } catch {
      console.log('Failed To Cancel Order')
    }
  }
  const confirmCancelOrder = async () => {
  await handleCancelOrder(cancelOrderId)

  setShowCancelModal(false)
  setCancelOrderId(null)
}
const submitReview = async (product) => {
  try {
    const res = await fetch(
      'https://puji-home-foods.onrender.com/api/reviews',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.productId,
          productName: product.name,
          userId: user?._id || user?.id,
          customerName: user?.name,
          rating,
          review: reviewText,
        }),
      }
    )

    if (!res.ok) throw new Error()

    alert('Review submitted successfully')

    setRating(5)
    setReviewText('')
  } catch (err) {
    alert('Failed to submit review')
  }
}

  // Use real user data from auth
  const displayName  = user?.name  || 'Customer'
  const displayEmail = user?.email || ''
  const displayPhone = user?.phone || ''
  const initial      = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#F5ECD7', padding: '80px 0 0' }}>
      <div style={{ maxWidth: '1250px', margin: '0 auto', background: '#fff', borderRadius: '0', boxShadow: '0 8px 30px rgba(0,0,0,.08)', overflow: 'hidden' }}>

        <div
  className="portal-layout"
  style={{
    display: 'grid',
    gap: '0',
    alignItems: 'stretch',
    minHeight: 'calc(100vh - 80px)'
  }}
>

          {/* ── Sidebar ── */}
          <div
  className={`portal-sidebar ${showSidebar ? "open" : ""}`}
  style={{
    background:'linear-gradient(180deg,#220000,#4d0000)',
    color:'#fff',
    padding:'20px',
    borderRight:'1px solid rgba(255,255,255,.08)',
    display:'flex',
    flexDirection:'column',
    minHeight:'100%'
  }}
>
            <button className="active-menu">
              <FaUser size={16} style={{ marginRight: '10px' }} /> My Account
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Profile avatar */}
              <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,.12)', marginBottom: '20px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#A61B1B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', margin: '0 auto 12px' }}>
                  {initial}
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>{displayName}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>{displayEmail}</p>
              </div>

              <button className="menu-btn"><FaTachometerAlt size={16} /> Dashboard</button>
              <button className="menu-btn" onClick={() => setPage('orders')}><FaBox size={16} /> My Orders</button>
              <button className="menu-btn" onClick={() => setPage('wishlist')}><FaHeart size={16} /> Wishlist</button>
              <button className="menu-btn" onClick={() => setPage('addresses')}><FaHome size={16} /> Addresses</button>
              <button className="menu-btn" onClick={() => setPage('settings')}><FaCog size={16} /> Settings</button>

              <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: '12px', padding: '14px', marginBottom: '20px', marginTop: '10px' }}>
                <div style={{ fontSize: '13px', color: '#E8C97A', marginBottom: '6px' }}>⭐ Reward Points</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>250</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>Available Points</div>
              </div>

              <button className="menu-btn" onClick={() => setPage('offers')}>🔔 Notifications</button>
              <button className="menu-btn" onClick={() => setPage('support')}>🎧 Help & Support</button>

              <div style={{ marginTop: 'auto' }}>
                <button className="menu-btn" onClick={() => { logout(); setPage('home') }}>🚪 Logout</button>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
         <div className="portal-content">
           <div
  style={{
    marginBottom: '20px',
    width: '100%',
  }}
>
              <h1 style={{ color: C.maroon, fontSize: '1.7rem', marginBottom: '10px' }}>
                Hello, {displayName} 👋
              </h1>
              <div className="mobile-account-menu">

  <button onClick={() => setPage("orders")}>
    📦 My Orders
  </button>

  <button onClick={() => setPage("wishlist")}>
    ❤️ Wishlist
  </button>

  <button onClick={() => setPage("addresses")}>
    📍 Addresses
  </button>

  <button onClick={() => setPage("settings")}>
    ⚙️ Settings
  </button>

</div>
              <p style={{ color: '#666' }}>Welcome back to Puji Home Foods</p>

             <div
  className="stats-grid"
  style={{
    gap: '12px',
    marginTop: '16px',
    marginBottom: '18px',
    width: '100%',
  }}
>
                <DashboardCard icon={<FaShoppingBag size={22} color="#C9A84C" />} title="Total Orders" value={orders.length} subtitle="View all orders" onClick={() => setPage('orders')} />
                <DashboardCard icon={<FaHeart size={22} color="#ff4f81" />} title="Wishlist Items" value={wishlist.length} subtitle="View wishlist" onClick={() => setPage('wishlist')} />
                <DashboardCard icon={<FaHome size={22} color="#16a34a" />} title="Addresses" value="2" subtitle="Manage addresses" onClick={() => setPage('addresses')} />
                <DashboardCard icon={<FaShieldAlt size={22} color="#15803d" />} title="Account Status" value="Active" subtitle="Verified Account" />
              </div>
            </div>

           <div
  className="content-grid"
  style={{
    gap: '18px',
    marginTop: '16px',
    width: '100%',
    alignItems: 'start',
  }}
>
              {/* Recent Orders */}
              <div
className="recent-orders"
style={{
borderRadius:'18px',
padding:'20px',
border:'1px solid #ececec'
}}
>
                <div
className="recent-orders-header"
style={{
display:'flex',
justifyContent:'space-between',
alignItems:'center',
marginBottom:'20px'
}}
>
                  <h2 style={{ color: '#2B0000', margin: 0 }}>Recent Orders</h2>
                  <button onClick={() => setPage('orders')} style={{ background: 'none', border: 'none', color: '#8B1A1A', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div
className="empty-orders"
style={{
textAlign:'center',
padding:'40px 0',
color:'#9a6040'
}}
>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📦</div>
                    <p>No orders yet. <span style={{ color: C.crimson, cursor: 'pointer', fontWeight: 600 }} onClick={() => setPage('products')}>Shop Now →</span></p>
                  </div>
                ) : (
                  orders.slice(0, 5).map(order => (
  <div
    key={order._id}
    onClick={() => setSelectedOrder(order)}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 0',
      borderBottom: '1px solid #eee',
      cursor: 'pointer'
    }}
  > 
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <OrderProductImage productId={order.products?.[0]?.productId} name={order.products?.[0]?.name} />
                        <div>
                          <h3 style={{ margin: '0 0 8px' }}>Order #{order._id?.slice(-6).toUpperCase()}</h3>
                          <p style={{ margin: '0 0 6px' }}>{order.products?.[0]?.name}</p>
                          <div>
  <span style={{ color: '#666' }}>
    Qty: {order.products?.[0]?.quantity} • ₹{order.totalAmount}
  </span>

  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
    Payment: {order.paymentMethod}
  </div>

  <div
  style={{
    fontSize: '13px',
    fontWeight: '600',
    color:
      order.paymentStatus === 'Paid'
        ? 'green'
        : '#d97706',
  }}
>
  {order.paymentStatus}
</div>

<div
  style={{
    marginTop: '8px',
    fontSize: '12px',
    color: '#666',
    fontWeight: '600'
  }}
>
  {order.orderStatus === 'Pending' &&
    '🟢 Order Placed'}

  {order.orderStatus === 'Preparing' &&
    '🟢 Order Placed → 🟡 Preparing'}

  {order.orderStatus === 'Out for Delivery' &&
    '🟢 Order Placed → 🟡 Preparing → 🚚 Out for Delivery'}

  {order.orderStatus === 'Delivered' &&
    '🟢 Order Placed → 🟡 Preparing → 🚚 Out for Delivery → ✅ Delivered'}

  {order.orderStatus === 'Cancelled' &&
    '❌ Order Cancelled'}
</div>
</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <span style={{ color: '#777', fontSize: '14px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '.82rem', fontWeight: 600, background:
  order.orderStatus === 'Delivered'
    ? '#EAF7EC'
    : order.orderStatus === 'Preparing'
    ? '#FFF3DD'
    : order.orderStatus === 'Out for Delivery'
    ? '#F3E8FF'
    : order.orderStatus === 'Cancelled'
    ? '#FEE2E2'
    : '#E8F0FF',

color:
  order.orderStatus === 'Delivered'
    ? '#16A34A'
    : order.orderStatus === 'Preparing'
    ? '#D97706'
    : order.orderStatus === 'Out for Delivery'
    ? '#7C3AED'
    : order.orderStatus === 'Cancelled'
    ? '#DC2626'
    : '#2563EB' }}>
                          {order.orderStatus}
                        </span>
                        {(order.orderStatus === 'Pending' ||
  order.orderStatus === 'Preparing') && (
                          <button
  onClick={() => {
    setCancelOrderId(order._id)
    setShowCancelModal(true)
  }}
  style={{
    padding: '8px 14px',
    border: 'none',
    borderRadius: '10px',
    background: '#8B1A1A',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600
  }}
>
  Cancel Order
</button>

                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right side */}
              <div>
                {/* Profile card */}
                <div
className="profile-card"
style={{
background:'white',
borderRadius:'16px',
padding:'25px', boxShadow: '0 5px 20px rgba(0,0,0,.08)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ color: C.maroon, margin: 0 }}>Profile Information</h2>
                    <span onClick={() => setPage('editProfile')} style={{ color: '#8B1A1A', cursor: 'pointer', fontWeight: '600' }}>Edit Profile</span>
                  </div>
                 <div
className="profile-avatar"
style={{
width:'55px',
height:'55px', fontSize: '22px', borderRadius: '50%', background: C.crimson, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    {initial}
                  </div>
                  <h3 style={{ margin: '0 0 6px' }}>{displayName}</h3>
                  <p style={{ margin: '0 0 4px', color: '#666' }}>{displayEmail}</p>
                  {displayPhone && <p style={{ margin: 0, color: '#666' }}>{displayPhone}</p>}
                </div>

                {/* Quick Actions */}
                <div
className="quick-actions"
style={{
background:'white',
borderRadius:'16px',
padding:'25px', boxShadow: '0 5px 20px rgba(0,0,0,.08)' }}>
                  <h2 style={{ color: C.maroon, marginBottom: '20px' }}>Quick Actions</h2>
                  {[
                    { icon: '🛒', label: 'Browse Products', page: 'products' },
                    { icon: '🚚', label: 'Track Order',     page: 'trackorder' },
                    { icon: '🎧', label: 'Help & Support',  page: 'support' },
                    { icon: '🎁', label: 'Offers & Coupons',page: 'offers' },
                  ].map((a, i) => (
                    <div key={i}>
                      <div
className="quick-actions-item"
onClick={() => setPage(a.page)} style={{ padding: '12px 0', cursor: 'pointer', color: '#333', fontWeight: 500 }}>
                        {a.icon} {a.label}
                      </div>
                      {i < 3 && <hr style={{ margin: 0, borderColor: '#f0e6d3' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedOrder && (
  <div
  
    onClick={() => setSelectedOrder(null)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        width: '700px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '25px',
        borderRadius: '16px'
      }}
    >
      <h2>
        Order #{selectedOrder._id.slice(-6).toUpperCase()}
      </h2>

      <p><b>Name:</b> {selectedOrder.customerName}</p>
      <p><b>Phone:</b> {selectedOrder.phone}</p>
      <p><b>Address:</b> {selectedOrder.address}</p>

      <p><b>Payment Method:</b> {selectedOrder.paymentMethod}</p>
      <p><b>Payment Status:</b> {selectedOrder.paymentStatus}</p>
      <p><b>Order Status:</b> {selectedOrder.orderStatus}</p>

      <hr />

      {selectedOrder.products?.map((product, index) => (
        
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '15px'
          }}
        >
         
          <img
  src={
    product.image?.startsWith('http')
      ? product.image
      : `https://puji-home-foods.onrender.com${product.image}`
  }
            alt={product.name}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
          />

          <div>
            <h4>{product.name}</h4>
            <p>Weight: {product.weight}</p>
            <p>Quantity: {product.quantity}</p>
            <p>₹{product.price}</p>
          </div>
        </div>
      ))}

      <h3>Total Amount: ₹{selectedOrder.totalAmount}</h3>
      {selectedOrder.orderStatus === 'Delivered' && (
  <div
    style={{
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #eee',
      borderRadius: '12px',
    }}
  >
    <h3>Write a Review</h3>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      style={{
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      <option value={5}>★★★★★</option>
      <option value={4}>★★★★</option>
      <option value={3}>★★★</option>
      <option value={2}>★★</option>
      <option value={1}>★</option>
    </select>

    <textarea
      placeholder="Write your review..."
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      rows={4}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}
    />

    <button
      onClick={() =>
        submitReview(selectedOrder.products[0])
      }
      style={{
        marginTop: '10px',
        background: '#8B1A1A',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      Submit Review
    </button>
  </div>
)}

      <button
        onClick={() => setSelectedOrder(null)}
        style={{
          background: '#8B1A1A',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  </div>
  )}
  {showCancelModal && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}
  >
    <div
      style={{
        background: '#fff',
        width: '420px',
        padding: '30px',
        borderRadius: '18px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '50px',
          marginBottom: '10px'
        }}
      >
        ⚠️
      </div>

      <h2
        style={{
          color: '#3D0000'
        }}
      >
        Cancel Order?
      </h2>

      <p
        style={{
          color: '#666',
          marginTop: '10px',
          marginBottom: '25px'
        }}
      >
        Are you sure you want to cancel this order?
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <button
          onClick={() => setShowCancelModal(false)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          Keep Order
        </button>

        <button
          onClick={confirmCancelOrder}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: '#8B1A1A',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel Order
        </button>
      </div>
    </div>
  </div>
)}
  


      <footer style={{ background: '#3D0000', color: 'white', marginTop: '40px', padding: '35px 20px' }}>
        <div className="portal-footer-grid"

style={{

display:'grid',

gridTemplateColumns:'repeat(4,1fr)',
 textAlign: 'center', gap: '12px' }}>
          {[['🎁','100% Homemade','Premium Quality'],['🌿','No Preservatives','Pure & Natural'],['📦','Secure Packaging','Safe Delivery'],['🚚','Pan India Delivery','Fast & Reliable']].map(([icon,title,sub]) => (
            <div key={title}><div style={{ fontSize: '18px' }}>{icon}</div><h3>{title}</h3><p>{sub}</p></div>
          ))}
        </div>
      </footer>

      <style>{`
        .menu-btn { width:100%; background:transparent; border:none; color:white; text-align:left; padding:12px 14px; border-radius:10px; cursor:pointer; font-size:15px; margin-bottom:4px; transition:.3s; display:flex; align-items:center; gap:10px; }
        .menu-btn:hover { background:#8B1A1A; }
        .active-menu { width:100%; background:#8B0000; color:white; border:none; padding:14px 16px; border-radius:12px; font-size:16px; font-weight:600; text-align:left; margin-bottom:18px; display:flex; align-items:center; }
      `}</style>
    </div>
  )
}

function OrderProductImage({ productId, name }) {
  const [imgSrc, setImgSrc] = useState('/images/logo.png')

  useEffect(() => {
    if (!productId) return
    fetch(`https://puji-home-foods.onrender.com/api/products`)
      .then(res => res.json())
      .then(allProducts => {
        const found = allProducts.find(p => String(p._id) === String(productId))
  || allProducts.find(p => p.name === name)
        if (found?.image) {
  setImgSrc(
    found.image.startsWith('http')
      ? found.image
      : found.image.startsWith('/images/')
      ? found.image
      : `https://puji-home-foods.onrender.com${found.image}`
  )
}
      })
      .catch(() => {})
  }, [productId])

  return (
    <img
      src={imgSrc}
      alt={name || 'Product'}
      onError={e => { e.target.src = '/images/logo.png' }}
      style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: '#f5ece7' }}
    />
  )
}

function DashboardCard({ icon, title, value, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="dashboard-card"
    >
      <div className="dashboard-icon">
        {icon}
      </div>

      <div className="dashboard-content">
        <h4>{title}</h4>

        <h2>{value}</h2>

        <p>{subtitle}</p>
      </div>
    </div>
  )
}
