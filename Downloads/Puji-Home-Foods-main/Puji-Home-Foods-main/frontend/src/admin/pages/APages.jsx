import { useState, useEffect } from 'react'
import { adminCategories, orders, customers, coupons, deliveries, reviews, admins, revenueData, ordersData, topProducts, categoryData } from '../data/adminData'
import { getAdminCode, setAdminCode } from '../data/adminCode'
import { Card, Badge, ABtn, SearchBar, DataTable, Toast, ConfirmModal, AC, Icon } from '../components/AdminShared'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function FInput({ label, value, onChange, type='text', options, half, error }) {
  return (
    <div style={{ gridColumn: half ? 'auto' : 'span 2' }}>
      <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#7a4020', marginBottom:4 }}>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.84rem', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'white', color:'#1a0400' }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={label}
          style={{ width:'100%', padding:'9px 12px', borderRadius:10, border:`1.5px solid ${error?'#c0392b':'rgba(201,168,76,.25)'}`, fontSize:'.84rem', fontFamily:"'DM Sans',sans-serif", outline:'none', color:'#1a0400' }}
          onFocus={e => e.target.style.borderColor='#C9A84C'}
          onBlur={e => e.target.style.borderColor=error?'#c0392b':'rgba(201,168,76,.25)'}
        />
      )}
      {error && <div style={{ fontSize:'.7rem', color:'#c0392b', marginTop:3 }}>⚠ {error}</div>}
    </div>
  )
}

function Modal({ title, children, onClose, onSave, saveLabel='Save', loading }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:520, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:800, color:'#1a0400', margin:0 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14, color:'#7a4020' }}>✕</button>
        </div>
        {children}
        <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
          <ABtn variant="outline" onClick={onClose}>Cancel</ABtn>
          <ABtn variant="gold" onClick={onSave} disabled={loading}>{loading ? 'Saving…' : saveLabel}</ABtn>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════════
export function ACategories() {
  const [data, setData] = useState([])

useEffect(() => {
  fetch("https://puji-home-foods.onrender.com/api/categories")
    .then(res => res.json())
    .then(data => {
      console.log("Categories:", data)
      setData(data)
    })
    .catch(err => console.error(err))
}, [])
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ name:'', description:'', status:'Active' })
  const [editId, setEditId]   = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast]     = useState(null)

  const open = (row) => {
    if (row) { setForm({ name:row.name, description:row.description, status:row.status }); setEditId(row._id) }
    else     { setForm({ name:'', description:'', status:'Active' }); setEditId(null) }
    setModal(true)
  }
  const save = async () => {
  if (!form.name.trim()) return

  try {
    if (editId) {
      const res = await fetch(
        `https://puji-home-foods.onrender.com/api/categories/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      )

      const updated = await res.json()

      setData(d =>
        d.map(r => (r._id === updated._id ? updated : r))
      )

      setToast({
        msg: "Category updated!",
        type: "success",
      })
    } else {
      const res = await fetch(
        "https://puji-home-foods.onrender.com/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      )

      const newCategory = await res.json()

      setData(d => [...d, newCategory])

      setToast({
        msg: "Category added!",
        type: "success",
      })
    }

    setModal(false)
  } catch (err) {
    console.error(err)

    setToast({
      msg: "Failed to save category",
      type: "error",
    })
  }
}

  const columns = [
    { key:'name',        label:'Name',        render:v => <span style={{ fontWeight:700, color:'#1a0400' }}>{v}</span> },
    { key:'description', label:'Description', wrap:true },
    { key:'products',    label:'Products',    render:v => <span style={{ fontWeight:700, color:AC.crimson }}>{v}</span> },
    { key:'status',      label:'Status',      render:v => <Badge status={v} /> },
    {
  key:'_id',
  label:'Actions',
  render:(_,r) => (
    <div style={{ display:'flex', gap:6 }}>
      <ABtn size="sm" variant="outline" onClick={() => open(r)}>Edit</ABtn>
      <ABtn size="sm" variant="primary" onClick={() => setConfirm(r._id)}>Delete</ABtn>
    </div>
  )
}
  ]

  return (
    <div style={{ padding:'1.5rem' }}>
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
  <ConfirmModal
    msg="Delete this category?"
    onConfirm={async () => {
      try {
        await fetch(
          `https://puji-home-foods.onrender.com/api/categories/${confirm}`,
          {
            method: "DELETE",
          }
        )

        setData(d =>
          d.filter(r => r._id !== confirm)
        )

        setToast({
          msg: "Category deleted",
          type: "success",
        })
      } catch (err) {
        console.error(err)

        setToast({
          msg: "Delete failed",
          type: "error",
        })
      }

      setConfirm(null)
    }}
    onCancel={() => setConfirm(null)}
  

  />
)}
      <Card>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'flex-end' }}>
          <ABtn variant="gold" onClick={() => open(null)}>+ Add Category</ABtn>
        </div>
        <DataTable columns={columns} data={data} />
      </Card>
      {modal && (
        <Modal title={editId?'Edit Category':'Add Category'} onClose={() => setModal(false)} onSave={save}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <FInput label="Category Name" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} />
            <FInput label="Description"   value={form.description} onChange={v => setForm(f=>({...f,description:v}))} />
            <FInput label="Status" value={form.status} onChange={v => setForm(f=>({...f,status:v}))} options={['Active','Inactive']} half />
          </div>
        </Modal>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════════
export function AOrders() {
  const [data, setData] = useState([])
  useEffect(() => {
  const token = localStorage.getItem("puji_token")

  fetch("https://puji-home-foods.onrender.com/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("ORDERS:", data)
      setData(Array.isArray(data) ? data : [])
    })
    .catch(err => {
      console.error(err)
      setData([])
    })
}, [])
    
    
  const [search, setSearch]     = useState('')
  const [statusF, setStatusF]   = useState('All')
  const [viewItem, setViewItem] = useState(null)
  const [toast, setToast]       = useState(null)

  const statuses = ['All','Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled']
  const filtered = data.filter(o =>
  (statusF === 'All' || o.orderStatus === statusF) &&
  (
    (o.customerName || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )
)

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `https://puji-home-foods.onrender.com/api/orders/${id}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderStatus: status }),
        }
      )
      setData(d => d.map(o => o._id === id ? { ...o, orderStatus: status } : o))
      setToast({ msg: `Order status updated to ${status}`, type: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ msg: 'Failed to update status', type: 'error' })
    }
  }

  const columns = [
  {
    key: 'customerName',
    label: 'Customer',
    render: v => (
      <span style={{ fontWeight: 600 }}>{v}</span>
    )
  },

  {
    key: 'totalAmount',
    label: 'Amount',
    render: v => (
      <span style={{ fontWeight: 700, color: AC.crimson }}>
        ₹{v}
      </span>
    )
  },

  {
    key: 'paymentMethod',
    label: 'Payment'
  },

  {
    key: 'orderStatus',
    label: 'Status',
    render: (v, r) => (
      <select
        value={v}
        onChange={e => updateStatus(r._id, e.target.value)}
        style={{
          padding: '4px 8px',
          borderRadius: 20,
          border: '1.5px solid rgba(201,168,76,.25)',
          fontSize: '.72rem',
          fontWeight: 700,
          background: 'white',
          cursor: 'pointer'
        }}
      >
        {statuses.slice(1).map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>
    )
  },

  {
    key: 'createdAt',
    label: 'Date',
    render: v => (
      <span style={{ color: '#9a6040' }}>
        {new Date(v).toLocaleDateString()}
      </span>
    )
  },

  {
    key: '_id',
    label: 'Actions',
    render: (_, r) => (
      <button
  onClick={() => setViewItem(r)}
  style={{
    padding: "8px 20px",
    borderRadius: "25px",
    border: "1px solid #d4b15a",
    background: "#fff",
    color: "#8B1A1A",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
  View
</button>
    )
  }
]

  return (
    <div style={{ padding:'1.5rem' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <Card>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', flexWrap:'wrap', gap:'1rem', alignItems:'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
          <select value={statusF} onChange={e => setStatusF(e.target.value)} style={{ padding:'8px 14px', borderRadius:20, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.8rem', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'white', color:'#5a2e10', cursor:'pointer' }}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filtered} />
      </Card>
      {viewItem && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:480, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:800, color:'#1a0400', margin:0 }}>Order {viewItem._id}</h2>
              <button onClick={() => setViewItem(null)} style={{ background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14, color:'#7a4020' }}>✕</button>
            </div>
            {[['Customer', viewItem.customerName],['Phone', viewItem.phone],['Amount', `₹${viewItem.totalAmount}`],['Payment', viewItem.paymentMethod],['Status', viewItem.orderStatus],['Date', new Date(viewItem.createdAt).toLocaleDateString()]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(201,168,76,.08)' }}>
                <span style={{ fontSize:'.82rem', color:'#9a6040' }}>{l}</span>
                <span style={{ fontSize:'.82rem', fontWeight:600, color:'#1a0400' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMERS
// ══════════════════════════════════════════════════════════════════
export function ACustomers() {
  const [data, setData]         = useState([])
  const [search, setSearch]     = useState('')
  const [viewItem, setViewItem] = useState(null)

 useEffect(() => {
  const token = localStorage.getItem("puji_token")

  fetch("https://puji-home-foods.onrender.com/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("CUSTOMERS:", data)
      setData(Array.isArray(data) ? data : [])
    })
    .catch(err => {
      console.error(err)
      setData([])
    })
}, [])

  const filtered = data.filter(c =>
    (c.name||'').toLowerCase().includes(search.toLowerCase()) ||
    (c.email||'').toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key:'name',      label:'Name',        render:v => <span style={{ fontWeight:700, color:'#1a0400' }}>{v}</span> },
    { key:'email',     label:'Email',       render:v => <span style={{ color:'#5a2e10' }}>{v}</span> },
    { key:'phone',     label:'Phone'       },
    { key:'createdAt', label:'Joined',      render:v => <span style={{ color:'#9a6040' }}>{new Date(v).toLocaleDateString()}</span> },
    { key:'_id',       label:'Actions',     render:(_,r) => <ABtn size="sm" variant="outline" onClick={() => setViewItem(r)}>View</ABtn> },
  ]

  return (
    <div style={{ padding:'1.5rem' }}>
      <Card>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        </div>
        <DataTable columns={columns} data={filtered} />
      </Card>
      {viewItem && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:440, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:800, color:'#1a0400', margin:0 }}>Customer Details</h2>
              <button onClick={() => setViewItem(null)} style={{ background:'none', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14, color:'#7a4020' }}>✕</button>
            </div>
            {[['Name',viewItem.name],['Email',viewItem.email],['Phone',viewItem.phone||'N/A'],['Joined',new Date(viewItem.createdAt).toLocaleDateString()]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(201,168,76,.08)' }}>
                <span style={{ fontSize:'.82rem', color:'#9a6040' }}>{l}</span>
                <span style={{ fontSize:'.82rem', fontWeight:600, color:'#1a0400' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// PAYMENTS
// ══════════════════════════════════════════════════════════════════
export function APayments() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [statusF, setStatusF] = useState('All')
  const [viewItem, setViewItem] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("puji_token")

    fetch("https://puji-home-foods.onrender.com/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("PAYMENTS:", data)
        setData(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error(err)
        setData([])
      })
  }, [])

  const filtered = data.filter(p =>
    (statusF === 'All' || p.paymentStatus === statusF) &&
    (
      (p.customerName || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  )

  const columns = [
    {
      key: '_id',
      label: 'Pay ID',
      render: v => (
        <span style={{ color: AC.crimson, fontWeight: 700 }}>
          {v.slice(-6)}
        </span>
      )
    },

    {
      key: '_id',
      label: 'Order ID',
      render: v => (
        <span style={{ color: '#5b21b6', fontWeight: 600 }}>
          {v.slice(-6)}
        </span>
      )
    },

    {
      key: 'customerName',
      label: 'Customer'
    },

    {
      key: 'totalAmount',
      label: 'Amount',
      render: v => (
        <span style={{ fontWeight: 700, color: AC.crimson }}>
          ₹{v}
        </span>
      )
    },

    {
      key: 'paymentMethod',
      label: 'Method'
    },

    {
      key: 'paymentStatus',
      label: 'Status',
      render: v => <Badge status={v} />
    },

    {
      key: 'createdAt',
      label: 'Date',
      render: v => (
        <span style={{ color: '#9a6040' }}>
          {new Date(v).toLocaleDateString()}
        </span>
      )
    },

    {
      key: '_id',
      label: 'Actions',
      render: (_, r) => (
        <ABtn
          size="sm"
          variant="outline"
          onClick={() => setViewItem(r)}
        >
          View
        </ABtn>
      )
    }
  ]

  return (
    <div style={{ padding:'1.5rem' }}>
      <Card>
        <div
          style={{
            padding:'1.2rem 1.4rem',
            borderBottom:'1px solid rgba(201,168,76,.1)',
            display:'flex',
            flexWrap:'wrap',
            gap:'1rem',
            alignItems:'center'
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search payments..."
          />

          <select
  value={statusF}
  onChange={e => setStatusF(e.target.value)}
  style={{
    padding: "10px 18px",
    borderRadius: "30px",
    border: "1px solid #d4b15a",
    background: "#fff",
    color: "#5a2e10",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
            <option>All</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
        </div>

        <DataTable columns={columns} data={filtered} />
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// COUPONS
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// COUPONS
// ══════════════════════════════════════════════════════════════════
export function ACoupons() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ code:'', discount:'', type:'Percentage', minOrder:'', usageLimit:'', validTill:'', status:'Active' })
  const [editId, setEditId]   = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast]     = useState(null)

  const BASE = 'https://puji-home-foods.onrender.com/api/coupons'

  useEffect(() => {
    fetch(BASE)
      .then(res => res.json())
      .then(data => setData(Array.isArray(data) ? data : []))
      .catch(() => setToast({ msg: 'Failed to load coupons', type: 'error' }))
  }, [])

  const open = (row) => {
    if (row) {
      setForm({
        code:       row.code,
        discount:   String(row.discount),
        type:       row.type,
        minOrder:   String(row.minOrder),
        usageLimit: String(row.usageLimit),
        validTill:  row.validTill ? row.validTill.slice(0, 10) : '',
        status:     row.status,
      })
      setEditId(row._id)
    } else {
      setForm({ code:'', discount:'', type:'Percentage', minOrder:'', usageLimit:'', validTill:'', status:'Active' })
      setEditId(null)
    }
    setModal(true)
  }

  const save = async () => {
    if (!form.code.trim() || !form.discount || !form.validTill) return
    setLoading(true)
    const payload = {
      code:       form.code.toUpperCase(),
      discount:   Number(form.discount),
      type:       form.type,
      minOrder:   Number(form.minOrder) || 0,
      usageLimit: Number(form.usageLimit) || 100,
      validTill:  form.validTill,
      status:     form.status,
    }
    try {
      if (editId) {
        const res = await fetch(`${BASE}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const updated = await res.json()
        setData(d => d.map(r => r._id === editId ? updated : r))
        setToast({ msg: 'Coupon updated!', type: 'success' })
      } else {
        const res = await fetch(BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const created = await res.json()
        if (!res.ok) throw new Error(created.message || 'Failed to create')
        setData(d => [created, ...d])
        setToast({ msg: 'Coupon added!', type: 'success' })
      }
      setModal(false)
    } catch (err) {
      setToast({ msg: err.message || 'Failed to save coupon', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const deleteCoupon = async (id) => {
    try {
      await fetch(`${BASE}/${id}`, { method: 'DELETE' })
      setData(d => d.filter(r => r._id !== id))
      setToast({ msg: 'Coupon deleted', type: 'error' })
    } catch {
      setToast({ msg: 'Failed to delete coupon', type: 'error' })
    } finally {
      setConfirm(null)
    }
  }

  const columns = [
    { key:'code',      label:'Code',      render:v => <span style={{ fontFamily:'monospace', fontWeight:800, color:AC.crimson, background:'#fee2e2', padding:'3px 10px', borderRadius:20, fontSize:'.8rem' }}>{v}</span> },
    { key:'discount',  label:'Discount',  render:(v,r) => <span style={{ fontWeight:700 }}>{r.type==='Flat'?`₹${v}`:`${v}%`}</span> },
    { key:'type',      label:'Type' },
    { key:'minOrder',  label:'Min Order', render:v => `₹${v}` },
    { key:'used',      label:'Used',      render:(v,r) => <span style={{ color: v>=r.usageLimit?'#991b1b':'#166534', fontWeight:700 }}>{v}/{r.usageLimit}</span> },
    { key:'validTill', label:'Valid Till', render:v => <span style={{ color:'#9a6040' }}>{new Date(v).toLocaleDateString()}</span> },
    { key:'status',    label:'Status',    render:v => <Badge status={v} /> },
    { key:'_id',       label:'Actions',   render:(_,r) => (
      <div style={{ display:'flex', gap:6 }}>
        <ABtn size="sm" variant="outline" onClick={() => open(r)}>Edit</ABtn>
        <ABtn size="sm" variant="primary" onClick={() => setConfirm(r._id)}>Delete</ABtn>
      </div>
    )},
  ]

  return (
    <div style={{ padding:'1.5rem' }}>
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmModal
          msg="Delete this coupon?"
          onConfirm={() => deleteCoupon(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <Card>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'flex-end' }}>
          <ABtn variant="gold" onClick={() => open(null)}>+ Add Coupon</ABtn>
        </div>
        <DataTable columns={columns} data={data} />
      </Card>
      {modal && (
        <Modal title={editId?'Edit Coupon':'Add Coupon'} onClose={() => setModal(false)} onSave={save} loading={loading}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <FInput label="Coupon Code"   value={form.code}       onChange={v => setForm(f=>({...f, code:v.toUpperCase()}))} half />
            <FInput label="Type"          value={form.type}       onChange={v => setForm(f=>({...f, type:v}))}       options={['Percentage','Flat']} half />
            <FInput label="Discount"      value={form.discount}   onChange={v => setForm(f=>({...f, discount:v}))}   type="number" half />
            <FInput label="Min Order (₹)" value={form.minOrder}   onChange={v => setForm(f=>({...f, minOrder:v}))}   type="number" half />
            <FInput label="Usage Limit"   value={form.usageLimit} onChange={v => setForm(f=>({...f, usageLimit:v}))} type="number" half />
            <FInput label="Valid Till"    value={form.validTill}  onChange={v => setForm(f=>({...f, validTill:v}))}  type="date"   half />
            <FInput label="Status"        value={form.status}     onChange={v => setForm(f=>({...f, status:v}))}     options={['Active','Inactive']} half />
          </div>
        </Modal>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════════════
const PIE_COLORS = [AC.crimson, AC.gold, '#5b21b6', '#1e40af']

export function AAnalytics() {
  const [period, setPeriod] = useState('This Year')
  return (
    <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={{ padding:'8px 16px', borderRadius:20, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.82rem', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'white', color:'#5a2e10', cursor:'pointer' }}>
          {['This Week','This Month','This Year'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <Card><div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Revenue Overview</div></div><div style={{ padding:'1rem', height:260 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData}><defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={AC.crimson} stopOpacity={0.3}/><stop offset="95%" stopColor={AC.crimson} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" /><XAxis dataKey="month" tick={{ fontSize:11, fill:'#9a6040' }} /><YAxis tick={{ fontSize:11, fill:'#9a6040' }} /><Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} /><Area type="monotone" dataKey="revenue" stroke={AC.crimson} fill="url(#aGrad)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div></Card>
        <Card><div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Orders Overview</div></div><div style={{ padding:'1rem', height:260 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={ordersData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" /><XAxis dataKey="month" tick={{ fontSize:11, fill:'#9a6040' }} /><YAxis tick={{ fontSize:11, fill:'#9a6040' }} /><Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} /><Line type="monotone" dataKey="orders" stroke={AC.gold} strokeWidth={2.5} dot={{ fill:AC.gold, r:4 }} /></LineChart></ResponsiveContainer></div></Card>
        <Card><div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Top Selling Products</div></div><div style={{ padding:'1rem', height:260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={topProducts}><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,.1)" /><XAxis dataKey="name" tick={{ fontSize:10, fill:'#9a6040' }} /><YAxis tick={{ fontSize:11, fill:'#9a6040' }} /><Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} /><Bar dataKey="sales" fill={AC.crimson} radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card><div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)' }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#1a0400' }}>Category Wise Sales</div></div><div style={{ padding:'1rem', height:260 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">{categoryData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip formatter={v=>`${v}%`} contentStyle={{ borderRadius:10, border:`1px solid ${AC.gold}`, fontSize:12 }} /><Legend wrapperStyle={{ fontSize:11 }} /></PieChart></ResponsiveContainer></div></Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// DELIVERY
// ══════════════════════════════════════════════════════════════════
export function ADelivery() {
  const [data, setData]         = useState([])
  const [statusF, setStatusF]   = useState('All')
  const [viewItem, setViewItem] = useState(null)
  const [toast, setToast]       = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('puji_token')
    fetch('https://puji-home-foods.onrender.com/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(orders => setData(Array.isArray(orders) ? orders : []))
      .catch(() => setToast({ msg: 'Failed to load deliveries', type: 'error' }))
  }, [])

  const deliveryStatuses = ['Pending', 'On the Way', 'Delivered']

  // Map orderStatus → delivery status
  const toDeliveryStatus = (orderStatus) => {
    if (orderStatus === 'Shipped')   return 'On the Way'
    if (orderStatus === 'Delivered') return 'Delivered'
    return 'Pending'
  }

  // Map delivery status → orderStatus for API
  const toOrderStatus = (deliveryStatus) => {
    if (deliveryStatus === 'On the Way') return 'Shipped'
    if (deliveryStatus === 'Delivered')  return 'Delivered'
    return 'Pending'
  }

  const filtered = data.filter(o => {
    const ds = toDeliveryStatus(o.orderStatus)
    return statusF === 'All' || ds === statusF
  })

  const updateStatus = async (id, deliveryStatus) => {
    const orderStatus = toOrderStatus(deliveryStatus)
    try {
      await fetch(`https://puji-home-foods.onrender.com/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus }),
      })
      setData(d => d.map(o => o._id === id ? { ...o, orderStatus } : o))
      setToast({ msg: `Delivery marked as ${deliveryStatus}`, type: 'success' })
    } catch {
      setToast({ msg: 'Failed to update status', type: 'error' })
    }
  }

  const columns = [
    {
      key: '_id',
      label: 'Del ID',
      render: v => <span style={{ color: AC.crimson, fontWeight: 700, fontFamily: 'monospace' }}>#{v.slice(-6).toUpperCase()}</span>
    },
    {
      key: '_id',
      label: 'Order ID',
      render: v => <span style={{ color: '#5b21b6', fontWeight: 600, fontFamily: 'monospace' }}>#{v.slice(-6).toUpperCase()}</span>
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: v => <span style={{ fontWeight: 600 }}>{v}</span>
    },
    {
      key: 'address',
      label: 'Address',
      wrap: true
    },
    {
      key: 'orderStatus',
      label: 'Status',
      render: (v, r) => (
        <select
          value={toDeliveryStatus(v)}
          onChange={e => updateStatus(r._id, e.target.value)}
          style={{ padding: '4px 8px', borderRadius: 20, border: '1.5px solid rgba(201,168,76,.25)', fontSize: '.72rem', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white', cursor: 'pointer', color: '#1a0400' }}
        >
          {deliveryStatuses.map(s => <option key={s}>{s}</option>)}
        </select>
      )
    },
    {
      key: 'createdAt',
      label: 'Order Date',
      render: v => <span style={{ color: '#9a6040' }}>{new Date(v).toLocaleDateString()}</span>
    },
    {
      key: 'paymentMethod',
      label: 'Payment'
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, r) => <ABtn size="sm" variant="outline" onClick={() => setViewItem(r)}>View</ABtn>
    },
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <Card>
        <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid rgba(201,168,76,.1)', display: 'flex', gap: '1rem' }}>
          <select
            value={statusF}
            onChange={e => setStatusF(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 20, border: '1.5px solid rgba(201,168,76,.25)', fontSize: '.8rem', fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white', color: '#5a2e10', cursor: 'pointer' }}
          >
            {['All', 'Pending', 'On the Way', 'Delivered'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filtered} />
      </Card>

      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '2rem', maxWidth: 480, width: '100%', boxShadow: '0 30px 80px rgba(0,0,0,.3)', border: '1px solid rgba(201,168,76,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 800, color: '#1a0400', margin: 0 }}>
                Delivery Details
              </h2>
              <button onClick={() => setViewItem(null)} style={{ background: 'none', border: '1px solid rgba(201,168,76,.2)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14, color: '#7a4020' }}>✕</button>
            </div>
            {[
              ['Order ID',    `#${viewItem._id.slice(-6).toUpperCase()}`],
              ['Customer',    viewItem.customerName],
              ['Phone',       viewItem.phone || 'N/A'],
              ['Address',     viewItem.address],
              ['Amount',      `₹${viewItem.totalAmount}`],
              ['Payment',     viewItem.paymentMethod],
              ['Order Status',viewItem.orderStatus],
              ['Delivery',    toDeliveryStatus(viewItem.orderStatus)],
              ['Date',        new Date(viewItem.createdAt).toLocaleDateString()],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,.08)' }}>
                <span style={{ fontSize: '.82rem', color: '#9a6040' }}>{l}</span>
                <span style={{ fontSize: '.82rem', fontWeight: 600, color: '#1a0400', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
              </div>
            ))}

            {/* Products */}
            {viewItem.products?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#7a4020', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Items</div>
                {viewItem.products.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(201,168,76,.06)', fontSize: '.8rem' }}>
                    <span style={{ color: '#1a0400' }}>{p.name} × {p.quantity}</span>
                    <span style={{ color: AC.crimson, fontWeight: 700 }}>₹{p.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════════
export function AReviews() {
  const [data, setData] = useState([])
  const [statusF, setStatusF] = useState('All')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetch('https://puji-home-foods.onrender.com/api/reviews')
      .then(res => res.json())
      .then(data => {
        setData(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error(err)
        setToast({
          msg: 'Failed to load reviews',
          type: 'error'
        })
      })
  }, [])

  const filtered =
    statusF === 'All'
      ? data
      : data.filter(r => r.status === statusF)

  const toggle = async (review) => {
    try {
      const endpoint =
        review.status === 'Approved'
          ? 'unapprove'
          : 'approve'

      const res = await fetch(
        `https://puji-home-foods.onrender.com/api/reviews/${endpoint}/${review._id}`,
        {
          method: 'PUT',
        }
      )

      const updated = await res.json()

      setData(d =>
        d.map(r =>
          r._id === updated._id ? updated : r
        )
      )

      setToast({
        msg: 'Review status updated',
        type: 'success'
      })
    } catch (err) {
      console.error(err)

      setToast({
        msg: 'Failed to update review',
        type: 'error'
      })
    }
  }

  const columns = [
    {
      key: 'productName',
      label: 'Product',
      render: v => (
        <span style={{ fontWeight: 700 }}>
          {v}
        </span>
      )
    },

    {
      key: 'customerName',
      label: 'Customer'
    },

    {
      key: 'rating',
      label: 'Rating',
      render: v => (
        <span style={{ color: AC.gold }}>
          {'★'.repeat(v)}
          {'☆'.repeat(5 - v)}
        </span>
      )
    },

    {
      key: 'review',
      label: 'Review',
      wrap: true
    },

    {
      key: 'createdAt',
      label: 'Date',
      render: v => (
        <span>
          {new Date(v).toLocaleDateString()}
        </span>
      )
    },

    {
      key: 'status',
      label: 'Status',
      render: v => <Badge status={v} />
    },

    {
      key: '_id',
      label: 'Actions',
      render: (_, r) => (
        <ABtn
          size="sm"
          variant={
            r.status === 'Approved'
              ? 'primary'
              : 'outline'
          }
          onClick={() => toggle(r)}
        >
          {r.status === 'Approved'
            ? 'Unapprove'
            : 'Approve'}
        </ABtn>
      )
    }
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      <Card>
        <div
          style={{
            padding: '1.2rem 1.4rem',
            borderBottom:
              '1px solid rgba(201,168,76,.1)',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <select
            value={statusF}
            onChange={e =>
              setStatusF(e.target.value)
            }
            style={{
              padding: '8px 14px',
              borderRadius: 20
            }}
          >
            <option>All</option>
            <option>Approved</option>
            <option>Pending</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
        />
      </Card>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// SETTINGS  (with Admin Code tab)
// ══════════════════════════════════════════════════════════════════
export function ASettings() {
  const [tab, setTab]   = useState('store')
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    storeName:'PUJI HOME FOODS', email:'hello@pujihomefoods.com', phone:'+91 98765 43210',
    address:'Hyderabad, Telangana', deliveryCharge:'80', freeDeliveryMin:'999',
    codEnabled:true, onlineEnabled:true,
    emailNotif:true, smsNotif:false,
    currentPwd:'', newPwd:'', confirmPwd:'',
  })
  useEffect(() => {
  fetch("https://puji-home-foods.onrender.com/api/store-settings")
    .then(res => res.json())
    .then(data => {
      setForm(f => ({
        ...f,
        storeName: data.storeName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      }))
    })
    .catch(err => console.error(err))
}, [])

  // Admin Code tab
  const [codeInput, setCodeInput]     = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [codeError, setCodeError]     = useState('')
  const [showCode, setShowCode]       = useState(false)

  const tabs = [
    { key:'store',     label:'Store',      icon:'products'  },
    { key:'shipping',  label:'Shipping',   icon:'delivery'  },
    { key:'payment',   label:'Payment',    icon:'payments'  },
    { key:'notif',     label:'Notifications', icon:'bell'   },
    { key:'password',  label:'Password',   icon:'key'       },
    { key:'admincode', label:'Admin Code', icon:'admins'    },
  ]

  const save = async () => {
  try {
    const res = await fetch(
      "https://puji-home-foods.onrender.com/api/store-settings",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName: form.storeName,
          email: form.email,
          phone: form.phone,
          address: form.address,
        }),
      }
    )

    if (!res.ok) throw new Error("Save failed")

    setToast({
      msg: "Settings saved successfully!",
      type: "success",
    })
  } catch (err) {
    console.error(err)

    setToast({
      msg: "Failed to save settings",
      type: "error",
    })
  }
}

  const saveAdminCode = () => {
    setCodeError('')
    if (!codeInput.trim())         return setCodeError('New code cannot be empty')
    if (codeInput.length < 6)      return setCodeError('Code must be at least 6 characters')
    if (codeInput !== confirmCode) return setCodeError('Codes do not match')
    setAdminCode(codeInput)
    setCodeInput('')
    setConfirmCode('')
    setToast({ msg:'Admin Access Code updated! New registrations will require this code.', type:'success' })
  }

  const I = ({ label, k, type='text' }) => (
    <div>
      <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#7a4020', marginBottom:5 }}>{label}</label>
      <input type={type} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.86rem', fontFamily:"'DM Sans',sans-serif", outline:'none', color:'#1a0400' }}
        onFocus={e=>e.target.style.borderColor='#C9A84C'}
        onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.25)'}
      />
    </div>
  )

  const Toggle = ({ label, k }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(201,168,76,.08)' }}>
      <span style={{ fontSize:'.85rem', color:'#1a0400', fontWeight:500 }}>{label}</span>
      <div onClick={()=>setForm(f=>({...f,[k]:!f[k]}))}
        style={{ width:44, height:24, borderRadius:12, background:form[k]?AC.crimson:'#ddd', cursor:'pointer', position:'relative', transition:'background .3s' }}>
        <div style={{ width:18, height:18, borderRadius:'50%', background:'white', position:'absolute', top:3, left:form[k]?23:3, transition:'left .3s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
      </div>
    </div>
  )

  const CodeInput = ({ label, value, onChange, placeholder }) => (
    <div style={{ marginBottom:'1rem' }}>
      <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#7a4020', marginBottom:5 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input type={showCode ? 'text' : 'password'} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ width:'100%', padding:'10px 42px 10px 14px', borderRadius:10, border:'1.5px solid rgba(201,168,76,.25)', fontSize:'.86rem', fontFamily:"'DM Sans',sans-serif", outline:'none', color:'#1a0400', letterSpacing: showCode ? 'normal' : '3px' }}
          onFocus={e=>e.target.style.borderColor='#C9A84C'}
          onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.25)'}
        />
        <button type="button" onClick={()=>setShowCode(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9a6040', lineHeight:0, padding:0 }}>
          <Icon name={showCode ? 'reviews' : 'key'} size={16} color="#9a6040" />
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding:'1.5rem' }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1.5rem' }}>
        {/* Tabs */}
        <Card style={{ padding:'8px', height:'fit-content' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'10px 14px', borderRadius:10, border:'none', background:tab===t.key?`linear-gradient(135deg,${AC.crimson},${AC.darkRed})`:'none', color:tab===t.key?'white':'#5a2e10', fontSize:'.82rem', fontWeight:tab===t.key?700:400, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", textAlign:'left', marginBottom:2, transition:'all .2s' }}>
              <Icon name={t.icon} size={15} color={tab===t.key?'white':AC.crimson} />
              {t.label}
            </button>
          ))}
        </Card>

        <Card style={{ padding:'2rem' }}>
          {tab==='store' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'.5rem' }}>Store Settings</div>
              <I label="Store Name" k="storeName" />
              <I label="Email" k="email" type="email" />
              <I label="Phone" k="phone" />
              <I label="Address" k="address" />
              <div style={{ marginTop:'.5rem' }}><ABtn variant="gold" onClick={save}>Save Settings</ABtn></div>
            </div>
          )}
          {tab==='shipping' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'.5rem' }}>Shipping Settings</div>
              <I label="Delivery Charge (₹)" k="deliveryCharge" type="number" />
              <I label="Free Delivery Min Amount (₹)" k="freeDeliveryMin" type="number" />
              <div style={{ marginTop:'.5rem' }}><ABtn variant="gold" onClick={save}>Save Settings</ABtn></div>
            </div>
          )}
          {tab==='payment' && (
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'1rem' }}>Payment Settings</div>
              <Toggle label="Cash on Delivery (COD)" k="codEnabled" />
              <Toggle label="Online Payment" k="onlineEnabled" />
              <div style={{ marginTop:'1.5rem' }}><ABtn variant="gold" onClick={save}>Save Settings</ABtn></div>
            </div>
          )}
          {tab==='notif' && (
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'1rem' }}>Notification Settings</div>
              <Toggle label="Email Notifications" k="emailNotif" />
              <Toggle label="SMS Notifications" k="smsNotif" />
              <div style={{ marginTop:'1.5rem' }}><ABtn variant="gold" onClick={save}>Save Settings</ABtn></div>
            </div>
          )}
          {tab==='password' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'.5rem' }}>Change Password</div>
              <I label="Current Password" k="currentPwd" type="password" />
              <I label="New Password" k="newPwd" type="password" />
              <I label="Confirm New Password" k="confirmPwd" type="password" />
              <div style={{ marginTop:'.5rem' }}><ABtn variant="gold" onClick={save}>Update Password</ABtn></div>
            </div>
          )}
          {tab==='admincode' && (
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1a0400', marginBottom:'.5rem' }}>Admin Registration Code</div>
              <p style={{ fontSize:'.84rem', color:'#7a4020', marginBottom:'1.5rem', lineHeight:1.6 }}>
                This secret code is required when registering a new Admin account. Share it only with trusted personnel. Change it regularly for security.
              </p>

              {/* Current code display */}
              <div style={{ background:'rgba(201,168,76,.06)', border:'1px dashed rgba(201,168,76,.4)', borderRadius:12, padding:'1rem 1.2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:'.7rem', color:AC.gold, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:6 }}>Current Active Code</div>
                  <div style={{ fontFamily:'monospace', fontSize:'1.1rem', fontWeight:800, color:AC.crimson, letterSpacing: showCode ? '2px' : '6px' }}>
                    {showCode ? getAdminCode() : '•'.repeat(getAdminCode().length)}
                  </div>
                </div>
                <button onClick={()=>setShowCode(s=>!s)}
                  style={{ background:'none', border:`1px solid rgba(201,168,76,.3)`, borderRadius:8, padding:'6px 12px', color:AC.crimson, fontSize:'.76rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Icon name={showCode?'reviews':'key'} size={14} color={AC.crimson} />
                  {showCode ? 'Hide' : 'Show'}
                </button>
              </div>

              <div style={{ borderTop:'1px solid rgba(201,168,76,.15)', paddingTop:'1.5rem' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'.95rem', fontWeight:700, color:'#1a0400', marginBottom:'1rem' }}>Set New Code</div>
                <CodeInput label="New Admin Code" value={codeInput} onChange={setCodeInput} placeholder="Enter new code (min 6 chars)" />
                <CodeInput label="Confirm New Code" value={confirmCode} onChange={setConfirmCode} placeholder="Re-enter new code" />
                {codeError && (
                  <div style={{ display:'flex', alignItems:'center', gap:6, color:'#c0392b', fontSize:'.8rem', marginBottom:'1rem', background:'#fee2e2', padding:'8px 12px', borderRadius:8 }}>
                    <Icon name="warning" size={14} color="#c0392b" /> {codeError}
                  </div>
                )}
                <ABtn variant="gold" onClick={saveAdminCode}>
                  <Icon name="key" size={15} color={AC.brown} /> Update Admin Code
                </ABtn>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ADMINS
// ══════════════════════════════════════════════════════════════════
// REPLACE WITH:
export function AAdmins() {
  const [data, setData] = useState([])

  useEffect(() => {
  const token = localStorage.getItem("puji_token")

  fetch("https://puji-home-foods.onrender.com/api/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("ADMINS:", data)
      setData(Array.isArray(data) ? data : [])
    })
    .catch(err => {
      console.error(err)
      setData([])
    })
}, [])
const [modal, setModal]       = useState(false)
const [form, setForm]         = useState({ name:'', email:'', password:'', role:'Admin', status:'Active' })
const [editId, setEditId]     = useState(null)
const [confirm, setConfirm]   = useState(null)
const [toast, setToast]       = useState(null)
const [inviteModal, setInviteModal] = useState(false)
const [inviteCode, setInviteCode]   = useState(null)
const [inviteLoading, setInviteLoading] = useState(false)
const [copied, setCopied]     = useState(false)

const generateInvite = async () => {
  setInviteLoading(true)
  try {
    
const token = localStorage.getItem('puji_token')

const res = await fetch(
  'https://puji-home-foods.onrender.com/api/invite/generate',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
);



const result = await res.json();



if (!res.ok) throw new Error(result.message)


setInviteCode(result)
    setInviteModal(true)
  } catch (err) {
    setToast({ msg: err.message || 'Failed to generate code', type: 'error' })
  } finally {
    setInviteLoading(false)
  }
}

const copyCode = () => {
  navigator.clipboard.writeText(inviteCode.code)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

  const open = (row) => {
    if (row) { setForm({name:row.name,email:row.email,password:'',role:row.role,status:row.status}); setEditId(row._id) }
    else     { setForm({name:'',email:'',password:'',role:'Admin',status:'Active'}); setEditId(null) }
    setModal(true)
  }
  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (editId) setData(d =>
  d.map(r =>
    r._id === editId
      ? { ...r, ...form }
      : r
  )
)
    else        setData(d => [...d, {...form, id:`A${Date.now()}`, lastLogin:'Never'}])
    setModal(false); setToast({ msg: editId?'Admin updated!':'Admin added!', type:'success' })
  }

  const columns = [
    { key:'name',      label:'Name',       render:v => <span style={{ fontWeight:700, color:'#1a0400' }}>{v}</span> },
    { key:'email',     label:'Email',      render:v => <span style={{ color:'#5a2e10' }}>{v}</span> },
    { key:'role',      label:'Role',       render:v => <Badge status={v} /> },
    { key:'lastLogin', label:'Last Login', render:v => <span style={{ color:'#9a6040', fontSize:'.78rem' }}>{v}</span> },
    { key:'status',    label:'Status',     render:v => <Badge status={v} /> },
    { key:'id',        label:'Actions',    render:(_,r) => (
      <div style={{ display:'flex', gap:6 }}>
        <ABtn size="sm" variant="outline" onClick={()=>open(r)}>Edit</ABtn>
        <ABtn size="sm" variant="primary" onClick={()=>setConfirm(r._id)}>Delete</ABtn>
      </div>
    )},
  ]

  return (
    <div style={{ padding:'1.5rem' }}>
      {toast   && <Toast {...toast} onClose={()=>setToast(null)} />}
      {confirm && (
  <ConfirmModal
    msg="Remove this admin?"
    onConfirm={async () => {
      try {
        const token = localStorage.getItem("puji_token")

        const res = await fetch(
          `https://puji-home-foods.onrender.com/api/admin/${confirm}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message)
        }

        setData(d => d.filter(r => r._id !== confirm))

        setToast({
          msg: "Admin deleted successfully",
          type: "success",
        })
      } catch (err) {
        console.error(err)

        setToast({
          msg: "Delete failed",
          type: "error",
        })
      }

      setConfirm(null)
    }}
    onCancel={() => setConfirm(null)}
  />
)}
      <Card>
        <div style={{ padding:'1.2rem 1.4rem', borderBottom:'1px solid rgba(201,168,76,.1)', display:'flex', justifyContent:'flex-end', gap:'1rem' }}>
  <ABtn variant="outline" onClick={generateInvite} disabled={inviteLoading}>
    {inviteLoading ? 'Generating…' : '🔗 Generate Invite Code'}
  </ABtn>
  <ABtn variant="gold" onClick={()=>open(null)}>+ Add Admin</ABtn>
</div>
        <DataTable columns={columns} data={data} />
      </Card>
      {inviteModal && inviteCode && (
        <div style={{ position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'white', borderRadius:20, padding:'2rem', maxWidth:420, width:'100%', boxShadow:'0 30px 80px rgba(0,0,0,.3)', border:'1px solid rgba(201,168,76,.2)', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(201,168,76,.1)', border:'2px solid rgba(201,168,76,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.5rem' }}>🔗</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:800, color:'#1a0400', marginBottom:6 }}>Invite Code Generated</div>
            <p style={{ fontSize:'.82rem', color:'#9a6040', marginBottom:'1.5rem' }}>Share this code with the new admin. It expires in 24 hours and can only be used once.</p>
            <div style={{ background:'rgba(201,168,76,.06)', border:'1px dashed rgba(201,168,76,.4)', borderRadius:12, padding:'1rem 1.4rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
              <span style={{ fontFamily:'monospace', fontSize:'1.2rem', fontWeight:800, color:'#8B1A1A', letterSpacing:'3px' }}>{inviteCode.code}</span>
              <button onClick={copyCode} style={{ background: copied ? '#166534' : 'rgba(201,168,76,.15)', border:'1px solid rgba(201,168,76,.3)', borderRadius:8, padding:'6px 14px', color: copied ? 'white' : '#8B1A1A', fontSize:'.76rem', fontWeight:700, cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize:'.75rem', color:'#9a6040', marginBottom:'1.5rem' }}>
              Expires: {new Date(inviteCode.expiresAt).toLocaleString()}
            </div>
            <ABtn variant="gold" onClick={() => { setInviteModal(false); setInviteCode(null) }}>Done</ABtn>
          </div>
        </div>
      )}
      {modal && (
        <Modal title={editId?'Edit Admin':'Add Admin'} onClose={()=>setModal(false)} onSave={save}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <FInput label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} />
            <FInput label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} half />
            <FInput label="Password" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} type="password" half />
            <FInput label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v}))} options={['Super Admin','Admin']} half />
            <FInput label="Status" value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} options={['Active','Inactive']} half />
          </div>
        </Modal>
      )}
    </div>
  )
}
