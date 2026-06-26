import { useState, useEffect } from 'react'
import { StatCard, Card, Badge, ABtn, AC, Icon } from '../components/AdminShared'
import { orders, adminProducts, revenueData, ordersData, topProducts, categoryData } from '../data/adminData'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PIE_COLORS = [AC.crimson, AC.gold, '#5b21b6', '#1e40af']

export default function Dashboard({ onNav }) {
  const [orders, setOrders]     = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://puji-home-foods.onrender.com/api/orders')
      .then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
    fetch('https://puji-home-foods.onrender.com/api/products')
      .then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(() => {})
      const token = localStorage.getItem('puji_token')
fetch('https://puji-home-foods.onrender.com/api/users', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => setUsers(Array.isArray(d) ? d : []))
  .catch(() => {})
  }, [])

  const totalRevenue = orders.filter(o => o.orderStatus === 'Delivered').reduce((s, o) => s + (o.totalAmount||0), 0)
  const pendingCount = orders.filter(o => o.orderStatus === 'Pending').length
  const lowStock     = products.filter(p => (p.stock||0) <= 10)
  const recentOrders = orders.slice(0, 6)

  return (
    <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem' }}>
        <StatCard label="Total Orders"    value={orders.length}                         icon={<Icon name="orders"    size={22} color="white" />} trend="12%" trendUp />
        <StatCard label="Total Revenue"   value={`₹${(totalRevenue/1000).toFixed(1)}k`} icon={<Icon name="money"     size={22} color="white" />} color={`linear-gradient(135deg,${AC.gold},#b8962a)`} trend="8%" trendUp />
        <StatCard label="Total Products"  value={products.length}                  icon={<Icon name="products"  size={22} color="white" />} color="linear-gradient(135deg,#5b21b6,#4c1d95)" trend="3%" trendUp />
        <StatCard label="Total Customers" value={users.length}                                    icon={<Icon name="users"     size={22} color="white" />} color="linear-gradient(135deg,#1e40af,#1e3a8a)" trend="5%" trendUp />
        <StatCard label="Pending Orders"  value={pendingCount}                          icon={<Icon name="clock"     size={22} color="white" />} color="linear-gradient(135deg,#92400e,#78350f)" trend="2%" />
        <StatCard label="Best Seller"     value="Chicken Pickle"                        icon={<Icon name="star"      size={22} color="white" />} color="linear-gradient(135deg,#166534,#14532d)" />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }}>
        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Revenue Overview</div>
            <span style={{ fontSize:'.72rem', color:'#9a6040' }}>2026</span>
          </div>
          <div style={{ padding:'1rem', height:240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={AC.crimson} stopOpacity={0.3}/><stop offset="95%" stopColor={AC.crimson} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9a6040' }} />
                <YAxis tick={{ fontSize:11, fill:'#9a6040' }} />
                <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} />
                <Area type="monotone" dataKey="revenue" stroke={AC.crimson} fill="url(#revGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Sales by Category</div>
          </div>
          <div style={{ padding:'1rem', height:240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} />
                <Legend wrapperStyle={{ fontSize:11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Orders + Top Products */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'1.5rem' }}>
        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Orders Overview</div>
          </div>
          <div style={{ padding:'1rem', height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9a6040' }} />
                <YAxis tick={{ fontSize:11, fill:'#9a6040' }} />
                <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} />
                <Line type="monotone" dataKey="orders" stroke={AC.gold} strokeWidth={2.5} dot={{ fill:AC.gold, r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Top Selling Products</div>
          </div>
          <div style={{ padding:'1rem', height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize:10, fill:'#9a6040' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize:10, fill:'#9a6040' }} width={90} />
                <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} />
                <Bar dataKey="sales" fill={AC.crimson} radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent orders + Low stock */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'1.5rem' }}>
        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Recent Orders</div>
            <ABtn size="sm" variant="outline" onClick={() => onNav('orders')}>View All</ABtn>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.8rem' }}>
              <thead>
                <tr style={{ background:'rgba(201,168,76,.06)', borderBottom:'1px solid rgba(201,168,76,.1)' }}>
                  {['Order ID','Customer','Amount','Status','Date'].map(h => (
                    <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontWeight:700, color:'#5a2e10', fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
  <tr key={o._id} style={{ borderBottom:'1px solid rgba(201,168,76,.07)' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'9px 14px', color:AC.crimson, fontWeight:700 }}>{o._id?.slice(-6).toUpperCase()}</td>
<td style={{ padding:'9px 14px', color:'#1a0400' }}>{o.customerName}</td>
<td style={{ padding:'9px 14px', color:'#1a0400', fontWeight:600 }}>₹{o.totalAmount}</td>
<td style={{ padding:'9px 14px' }}><Badge status={o.orderStatus} /></td>
<td style={{ padding:'9px 14px', color:'#9a6040' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>
              <Icon name="warning" size={16} color="#991b1b" /> Low Stock Alerts
            </div>
            <span style={{ background:'#fee2e2', color:'#991b1b', padding:'3px 9px', borderRadius:20, fontSize:'.7rem', fontWeight:700 }}>{lowStock.length}</span>
          </div>
          <div style={{ padding:'1rem', display:'flex', flexDirection:'column', gap:10 }}>
            {lowStock.map(p => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'rgba(254,242,242,.7)', border:'1px solid rgba(254,202,202,.6)' }}>
                <img src={p.image} alt={p.name} style={{ width:38, height:38, borderRadius:8, objectFit:'cover', border:'1px solid rgba(201,168,76,.2)' }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'.8rem', fontWeight:700, color:'#1a0400', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:'.7rem', color:'#9a6040' }}>{p.category}</div>
                </div>
                <span style={{ background:'#fee2e2', color:'#991b1b', padding:'2px 8px', borderRadius:20, fontSize:'.7rem', fontWeight:700, flexShrink:0 }}>{p.stock} left</span>
              </div>
            ))}
            {lowStock.length === 0 && <p style={{ fontSize:'.82rem', color:'#9a6040', textAlign:'center', padding:'1rem' }}>All products well stocked ✓</p>}
          </div>
          <div style={{ padding:'1rem', borderTop:'1px solid rgba(201,168,76,.1)', display:'flex', flexWrap:'wrap', gap:8 }}>
            {[{label:'+ Add Product',nav:'products'},{label:'+ Add Category',nav:'categories'},{label:'+ New Coupon',nav:'coupons'},{label:'View Orders',nav:'orders'}].map(a => (
              <ABtn key={a.label} size="sm" variant="outline" onClick={() => onNav(a.nav)}>{a.label}</ABtn>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
