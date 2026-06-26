import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../auth/AuthContext'

export default function EditProfile({ setPage }) {
  const { user, login } = useAuth()

  const [form, setForm] = useState({
    name:     user?.name     || '',
    phone:    user?.phone    || '',
    address:  user?.address  || '',
  })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const inputStyle = {
    width: '100%',
    padding: '14px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '15px',
    marginTop: '6px',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border .2s',
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError('')
    try {
      const data = await api.updateProfile({
        name:    form.name,
        phone:   form.phone,
        address: form.address,
      })
      // ✅ FIX: Update user in context WITHOUT triggering AuthContext redirect
      // Pass token=null so login() skips localStorage writes, but we manually
      // call setPage here to navigate correctly
      login({ ...user, ...data.user }, null)
      setSuccess(true)
      // ✅ FIX: Navigate directly using setPage instead of relying on AuthContext
      setTimeout(() => { setSuccess(false); setPage('portal') }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const initial = (form.name || 'C').charAt(0).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#F5ECD7', padding: '120px 40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,.08)' }}>

        <h1 style={{ color: '#3D0000', marginBottom: '10px' }}>Edit Profile</h1>
        <p style={{ color: '#666', marginBottom: '35px' }}>Update your personal information.</p>

        {/* Avatar */}
        <div style={{ textAlign: 'center', background: '#FAFAFA', padding: '30px', borderRadius: '16px', marginBottom: '35px' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#8B1A1A', color: '#fff', fontSize: '34px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            {initial}
          </div>
          <h3 style={{ margin: '0 0 4px' }}>{form.name}</h3>
          <p style={{ margin: 0, color: '#666' }}>{user?.email}</p>
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: '#FFE8E8', border: '1px solid rgba(192,57,43,.3)', borderRadius: 10, padding: '12px 16px', marginBottom: '1.2rem', color: '#c0392b', fontSize: '.88rem' }}>
            ⚠ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#EAF7EC', border: '1px solid rgba(46,139,87,.3)', borderRadius: 10, padding: '12px 16px', marginBottom: '1.2rem', color: '#2E8B57', fontSize: '.88rem' }}>
            ✅ Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 600, color: '#3D0000', fontSize: '.88rem' }}>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#3D0000', fontSize: '.88rem' }}>Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{ ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed', color: '#999' }}
            />
            <p style={{ fontSize: '.75rem', color: '#9a6040', marginTop: 4 }}>Email cannot be changed</p>
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#3D0000', fontSize: '.88rem' }}>Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#3D0000', fontSize: '.88rem' }}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
              placeholder="Your city / address"
            />
          </div>
        </div>

        {/* Account info */}
        <div style={{ marginTop: '35px', padding: '20px', background: '#FAFAFA', borderRadius: '12px' }}>
          <h3 style={{ color: '#3D0000', marginBottom: 8 }}>Account Information</h3>
          <p style={{ margin: '0 0 4px' }}><strong>Status:</strong> Active</p>
          <p style={{ margin: 0 }}><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
          <button
            onClick={() => setPage('portal')}
            style={{ padding: '12px 18px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: saving ? '#bbb' : '#8B1A1A', color: '#fff', cursor: saving ? 'wait' : 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {saving && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  )
}
