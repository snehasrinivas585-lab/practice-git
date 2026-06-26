import { useState, useEffect } from 'react'
import { Card, Badge, ABtn, SearchBar, DataTable, Toast, ConfirmModal, AC } from '../components/AdminShared'

const BASE = 'https://puji-home-foods.onrender.com/api/products'

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price250g: '',
  price500g: '',
  price750g: '',
  price1kg: '',
  totalStock: '',
  stockStatus: 'In Stock',
  image: '',
}

export default function AProducts() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('All')
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [editId, setEditId]         = useState(null)
  const [errors, setErrors]         = useState({})
  const [confirm, setConfirm]       = useState(null)
  const [toast, setToast]           = useState(null)
  const [saving, setSaving]         = useState(false)
  const [cats, setCats] = useState(['All'])



  // ── Fetch products ──────────────────────────────────────────────
  useEffect(() => {
  Promise.all([
    fetch(BASE).then(r => r.json()),
    fetch("https://puji-home-foods.onrender.com/api/categories")
      .then(r => r.json())
  ])
    .then(([productsData, categoriesData]) => {
      setProducts(productsData)

      setCats([
        "All",
        ...categoriesData.map(c => c.name)
      ])

      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    })
}, [])

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // ── Validate ────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.name.trim())                    e.name       = 'Required'
    if (!form.price1kg || isNaN(form.price1kg)) e.price1kg = 'Enter valid 1kg price'
    if (!form.totalStock || isNaN(form.totalStock)) e.totalStock = 'Enter valid stock'
    return e
  }

  // ── Open Add ────────────────────────────────────────────────────
  const openAdd = () => {
  setForm({
    ...emptyForm,
    category: cats[1] || ''
  })

  setEditId(null)
  setErrors({})
  setModal(true)
}

  // ── Open Edit ───────────────────────────────────────────────────
  const openEdit = (p) => {
    setForm({
      name:        p.name        || '',
      category: p.category || '',
      description: p.description || '',
      price250g:   String(p.prices?.['250g'] || ''),
      price500g:   String(p.prices?.['500g'] || ''),
      price750g:   String(p.prices?.['750g'] || ''),
      price1kg:    String(p.prices?.['1kg']  || p.price || ''),
      totalStock:  String(p.totalStock ?? p.stock ?? ''),
      stockStatus: p.stockStatus || p.status || 'In Stock',
      image:       p.image       || '',
    })
    setEditId(p.id || p._id)
    setErrors({})
    setModal(true)
  }

  // ── Save (Add / Edit) ───────────────────────────────────────────
  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const body = {
        name:        form.name,
        category:    form.category,
        description: form.description,
        image:       form.image,
        totalStock:  Number(form.totalStock),
        stockStatus: form.stockStatus,
        prices: {
          '250g': form.price250g ? Number(form.price250g) : undefined,
          '500g': form.price500g ? Number(form.price500g) : undefined,
          '750g': form.price750g ? Number(form.price750g) : undefined,
          '1kg':  form.price1kg  ? Number(form.price1kg)  : undefined,
        },
      }

      const url    = editId ? `${BASE}/${editId}` : BASE
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      if (editId) {
        setProducts(ps => ps.map(p => (p.id || p._id) === editId ? { ...p, ...data } : p))
        setToast({ msg: 'Product updated!', type: 'success' })
      } else {
        // Re-fetch to get formatted product from backend
        const fresh = await fetch(BASE).then(r => r.json())
        setProducts(fresh)
        setToast({ msg: 'Product added!', type: 'success' })
      }
      setModal(false)
    } catch (err) {
  console.log(err)

  setToast({
    msg: err.message || 'Failed to save product',
    type: 'error'
  })
}
    setSaving(false)
  }

  // ── Delete ──────────────────────────────────────────────────────
  const handleDelete  = (id) => setConfirm(id)
  const confirmDelete = async () => {
    try {
      await fetch(`${BASE}/${confirm}`, { method: 'DELETE' })
      setProducts(ps => ps.filter(p => (p.id || p._id) !== confirm))
      setToast({ msg: 'Product deleted', type: 'error' })
    } catch {
      setToast({ msg: 'Failed to delete', type: 'error' })
    }
    setConfirm(null)
  }

  // ── Table columns ───────────────────────────────────────────────
  const columns = [
    {
      key: 'image', label: 'Image',
      render: (v) => (
        <img
          src={v?.startsWith('http') ? v : `https://puji-home-foods.onrender.com/images/${v?.split('/images/')[1] || v || ''}`}
          alt=""
          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(201,168,76,.2)' }}
        />
      )
    },
    {
      key: 'name', label: 'Name',
      render: (v) => <span style={{ fontWeight: 600, color: '#1a0400' }}>{v}</span>
    },
    { key: 'category', label: 'Category' },
    {
      key: 'price', label: 'Price (1kg)',
      render: (v) => <span style={{ fontWeight: 700, color: AC.crimson }}>₹{v || '—'}</span>
    },
    
      {
  key: 'totalStock',
  label: 'Stock',
  render: (_, row) => (
    <span
      style={{
        color: row.totalStock <= 10 ? '#991b1b' : '#166534',
        fontWeight: 700,
        background: row.totalStock <= 10 ? '#fee2e2' : '#dcfce7',
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: '.72rem'
      }}
    >
      {row.totalStock}
    </span>
  )
},
    {
      key: 'stockStatus', label: 'Status',
      render: (v) => <Badge status={v || 'In Stock'} />
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <ABtn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</ABtn>
          <ABtn size="sm" variant="primary" onClick={() => handleDelete(row.id || row._id)}>Delete</ABtn>
        </div>
      )
    },
  ]

  // ── Form fields config ──────────────────────────────────────────
  const formFields = [
    { label: 'Product Name',   k: 'name',        span: 2 },
    { label: 'Category',       k: 'category',    options: cats.slice(1) },
    { label: 'Stock Quantity', k: 'totalStock',  type: 'number' },
    { label: 'Price 250g (₹)', k: 'price250g',   type: 'number' },
    { label: 'Price 500g (₹)', k: 'price500g',   type: 'number' },
    { label: 'Price 750g (₹)', k: 'price750g',   type: 'number' },
    { label: 'Price 1kg (₹)',  k: 'price1kg',    type: 'number' },
    { label: 'Stock Status',   k: 'stockStatus', options: ['In Stock', 'Out of Stock', 'Low Stock'] },
    { label: 'Image URL',      k: 'image',       span: 2 },
  ]

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && <ConfirmModal msg="Delete this product permanently?" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />}

      <Card>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.4rem', borderBottom: '1px solid rgba(201,168,76,.1)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: 20, border: '1.5px solid rgba(201,168,76,.25)', fontSize: '.8rem', color: '#5a2e10', fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white', cursor: 'pointer' }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <ABtn variant="gold" onClick={openAdd}>+ Add Product</ABtn>
        </div>

        {/* Table */}
        {loading
          ? <div style={{ padding: '3rem', textAlign: 'center', color: '#9a6040' }}>Loading products...</div>
          : <DataTable columns={columns} data={filtered} />
        }
      </Card>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '2rem', maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,.3)', border: '1px solid rgba(201,168,76,.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 800, color: '#1a0400', margin: 0 }}>
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: '1px solid rgba(201,168,76,.2)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14, color: '#7a4020' }}>✕</button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {formFields.map(f => (
                <div key={f.k} style={{ gridColumn: f.span === 2 ? 'span 2' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: '#7a4020', marginBottom: 4 }}>{f.label}</label>
                  {f.options ? (
                    <select value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid rgba(201,168,76,.25)', fontSize: '.85rem', color: '#1a0400', outline: 'none', background: 'white' }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || 'text'} value={form[f.k]}
                      onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${errors[f.k] ? '#c0392b' : 'rgba(201,168,76,.25)'}`, fontSize: '.85rem', color: '#1a0400', outline: 'none' }} />
                  )}
                  {errors[f.k] && <div style={{ fontSize: '.7rem', color: '#c0392b', marginTop: 3 }}>⚠ {errors[f.k]}</div>}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <ABtn variant="outline" onClick={() => setModal(false)}>Cancel</ABtn>
              <ABtn variant="gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : (editId ? 'Save Changes' : 'Add Product')}
              </ABtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}