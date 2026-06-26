import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../auth/AuthContext'
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaTachometerAlt,
  FaBox,
  FaHeart,
  FaHome,
  FaCog,
} from 'react-icons/fa'

const C = {
  maroon:  '#3D0000',
  crimson: '#8B1A1A',
  gold:    '#C9A84C',
  cream:   '#F5ECD7',
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  fontSize: '15px',
  marginTop: '6px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border .2s',
  background: '#fff',
}

export default function Settings({ setPage }) {
  const { user, login, logout } = useAuth()

  // ── Profile form state ────────────────────────────────────────
  const [profile, setProfile] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  })
  const [profileSaving,  setProfileSaving]  = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError,   setProfileError]   = useState('')

  // ── Password form state ───────────────────────────────────────
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [pwSaving,  setPwSaving]  = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError,   setPwError]   = useState('')

  const initial = (profile.name || 'C').charAt(0).toUpperCase()

  // ── Save profile ──────────────────────────────────────────────
  
  const handleSaveProfile = async () => {
    
    if (!profile.name.trim()) { setProfileError('Name is required'); return }
    setProfileSaving(true)
    setProfileError('')
    setProfileSuccess(false)
    try {
      const data = await api.updateProfile({
        name:    profile.name,
        phone:   profile.phone,
        address: profile.address,
      })
      // ✅ Update context WITHOUT triggering AuthContext redirect (token=null)
      login({ ...user, ...data.user }, null)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Change password ───────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwError('')
    setPwSuccess(false)

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPwError('All password fields are required')
      return
    }
    if (passwords.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match')
      return
    }

    setPwSaving(true)
    try {
      await api.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      })
      setPwSuccess(true)
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err) {
      setPwError(err.message || 'Failed to change password')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.cream, padding: '80px 0 0' }}>
      <div style={{ maxWidth: '1250px', margin: '0 auto', background: '#fff', borderRadius: 0, boxShadow: '0 8px 30px rgba(0,0,0,.08)', overflow: 'hidden' }}>
       <div
className="settings-layout"
style={{
    display:'grid',
    gridTemplateColumns:'220px 1fr',
    minHeight:'calc(100vh - 80px)'
}}>

          {/* ── Sidebar ── */}
          <div
className="settings-sidebar"
style={{
background:'linear-gradient(180deg,#220000,#4d0000)',color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <button className="active-menu-s">
              <FaCog size={16} style={{ marginRight: 10 }} /> Settings
            </button>

            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,.12)', marginBottom: 20 }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#A61B1B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 12px' }}>
                {initial}
              </div>
              <h3 style={{ margin: 0, fontSize: 16, color: '#fff' }}>{profile.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{user?.email}</p>
            </div>

            <button className="menu-btn-s" onClick={() => setPage('portal')}><FaTachometerAlt size={16} /> Dashboard</button>
            <button className="menu-btn-s" onClick={() => setPage('orders')}><FaBox size={16} /> My Orders</button>
            <button className="menu-btn-s" onClick={() => setPage('wishlist')}><FaHeart size={16} /> Wishlist</button>
            <button className="menu-btn-s" onClick={() => setPage('addresses')}><FaHome size={16} /> Addresses</button>
            <button className="menu-btn-s" onClick={() => setPage('editProfile')}><FaUser size={16} /> Edit Profile</button>

            <div style={{ marginTop: 'auto' }}>
              <button className="menu-btn-s" onClick={() => { logout(); setPage('home') }}>🚪 Logout</button>
            </div>
          </div>

          {/* ── Main Content ── */}
         <div
className="settings-content"
style={{
padding:'30px 40px',
background:'#fff'
}}>

            <h1 style={{ color: C.maroon, fontSize: '1.7rem', marginBottom: 6 }}>⚙️ Settings</h1>
            <p style={{ color: '#666', marginBottom: 35 }}>Manage your profile, security and preferences.</p>

            {/* ── Profile Information ── */}
            <Section icon={<FaUser color={C.crimson} />} title="Profile Information">
              {profileError && <Alert type="error" msg={profileError} />}
              {profileSuccess && <Alert type="success" msg="Profile updated successfully!" />}

              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Full Name">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    placeholder="Your full name"
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    style={{ ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed', color: '#999' }}
                  />
                  <p style={{ fontSize: '.75rem', color: '#9a6040', margin: '4px 0 0' }}>Email cannot be changed</p>
                </Field>

                <Field label="Phone Number">
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    style={inputStyle}
                    placeholder="10-digit mobile number"
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </Field>

                <SaveBtn saving={profileSaving} label="Save Changes" onClick={handleSaveProfile} />
              </div>
            </Section>

            {/* ── Change Password ── */}
            <Section icon={<FaLock color={C.gold} />} title="Change Password" emoji="🔒">
              {pwError   && <Alert type="error"   msg={pwError} />}
              {pwSuccess && <Alert type="success" msg="Password changed successfully!" />}

              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Current Password">
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                    style={inputStyle}
                    placeholder="Enter current password"
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </Field>

                <Field label="New Password">
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                    style={inputStyle}
                    placeholder="Min. 6 characters"
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </Field>

                <Field label="Confirm Password">
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                    style={inputStyle}
                    placeholder="Re-enter new password"
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                  />
                </Field>

                <SaveBtn saving={pwSaving} label="Update Password" onClick={handleChangePassword} />
              </div>
            </Section>

            {/* ── Account Info ── */}
            <Section icon={<FaShieldAlt color="#16a34a" />} title="Account Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Account Status', '✅ Active'],
                  ['Account Type',   'Customer'],
                  ['Email',           user?.email || '—'],
                  ['Member Since',   user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#FAFAFA', padding: '14px 18px', borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: '.8rem', color: '#999', marginBottom: 4 }}>{k}</p>
                    <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>{v}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Notifications ── */}
            <Section icon={<FaBell color="#7C3AED" />} title="Notification Preferences">
              {[
                ['Order Updates',     'Get notified when your order status changes', true],
                ['Offers & Deals',    'Receive exclusive offers and discount codes',  true],
                ['Newsletter',        'Monthly newsletter with new products',         false],
              ].map(([label, desc, defaultOn]) => (
                <ToggleRow key={label} label={label} desc={desc} defaultOn={defaultOn} />
              ))}
            </Section>

          </div>
        </div>
      </div>

      <style>{`
        .menu-btn-s  { width:100%; background:transparent; border:none; color:white; text-align:left; padding:12px 14px; border-radius:10px; cursor:pointer; font-size:15px; margin-bottom:4px; transition:.3s; display:flex; align-items:center; gap:10px; }
        .menu-btn-s:hover { background:#8B1A1A; }
        .active-menu-s { width:100%; background:#8B0000; color:white; border:none; padding:14px 16px; border-radius:12px; font-size:16px; font-weight:600; text-align:left; margin-bottom:18px; display:flex; align-items:center; gap:10px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function Section({ icon, title, emoji, children }) {

return(

<div
className="settings-section"
style={{
background:'#fff',
border:'1px solid #eee',
borderRadius:16,
padding:'28px 32px',
marginBottom:24,
boxShadow:'0 2px 10px rgba(0,0,0,.04)'
}}
>

<h2
className="settings-title"
style={{
color:'#3D0000',
display:'flex',
alignItems:'center',
gap:10,
marginBottom:22,
fontSize:'1.1rem'
}}
>

{emoji ? <span>{emoji}</span> : icon}

{title}

</h2>

{children}

</div>

)

}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontWeight: 600, color: '#3D0000', fontSize: '.88rem' }}>{label}</label>
      {children}
    </div>
  )
}

function Alert({ type, msg }) {
  const isError = type === 'error'
  return (
    <div style={{
      background: isError ? '#FFE8E8' : '#EAF7EC',
      border: `1px solid ${isError ? 'rgba(192,57,43,.3)' : 'rgba(46,139,87,.3)'}`,
      borderRadius: 10, padding: '12px 16px', marginBottom: 16,
      color: isError ? '#c0392b' : '#2E8B57', fontSize: '.88rem',
    }}>
      {isError ? '⚠ ' : '✅ '}{msg}
    </div>
  )
}

function SaveBtn({ saving, label, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={saving}
        style={{
          padding: '13px 28px', borderRadius: 10, border: 'none',
          background: saving ? '#bbb' : '#8B1A1A', color: '#fff',
          cursor: saving ? 'wait' : 'pointer', fontWeight: 700,
          fontSize: '15px', display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background .2s',
        }}
      >
        {saving && (
          <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
        )}
        {saving ? 'Saving...' : label}
      </button>
    </div>
  )
}

function ToggleRow({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: '.82rem', color: '#888' }}>{desc}</p>
      </div>
      <div
        onClick={() => setOn(v => !v)}
        style={{
          width: 46, height: 26, borderRadius: 13, cursor: 'pointer', transition: '.3s',
          background: on ? '#8B1A1A' : '#ddd', position: 'relative', flexShrink: 0,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: on ? 23 : 3, transition: '.3s',
          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
        }} />
      </div>
    </div>
  )
}
