import { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { api } from './AuthContext'


// ── Theme ─────────────────────────────────────────────────────────
const C = {
  maroon:  '#3D0000',
  darkRed: '#6B0F0F',
  crimson: '#8B1A1A',
  gold:    '#C9A84C',
  goldL:   '#E8C97A',
  cream:   '#F5ECD7',
  brown:   '#2A1005',
  offWhite:'#FAF7F2',
  white:   '#FFFFFF',
}

function validateEmail(v)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validatePhone(v)    { return /^[6-9]\d{9}$/.test(v) }
function validatePassword(v) { return v.length >= 6 }

// ── Input ─────────────────────────────────────────────────────────
function Input({ label, type = 'text', value, onChange, error, placeholder, suffix, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: error ? '#c0392b' : focused ? C.crimson : '#7a4020', marginBottom: 5, letterSpacing: '.3px', transition: 'color .2s' }}>
        {label}{required && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: suffix ? '10px 42px 10px 14px' : '10px 14px', borderRadius: 10, border: `1.5px solid ${error ? '#c0392b' : focused ? C.gold : 'rgba(201,168,76,.28)'}`, outline: 'none', fontSize: '.88rem', color: '#1a0400', background: focused ? 'rgba(201,168,76,.04)' : C.white, transition: 'all .25s', boxShadow: focused ? '0 0 0 3px rgba(201,168,76,.12)' : error ? '0 0 0 3px rgba(192,57,43,.08)' : 'none', fontFamily: "'DM Sans', sans-serif" }}
        />
        {suffix && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9a6040' }}>{suffix}</div>}
      </div>
      {error && <div style={{ fontSize: '.7rem', color: '#c0392b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {error}</div>}
    </div>
  )
}

// ── Password Input ────────────────────────────────────────────────
function PasswordInput({ label, value, onChange, error, placeholder, required }) {
  const [show, setShow] = useState(false)
  return (
    <Input label={label} type={show ? 'text' : 'password'} value={value} onChange={onChange} error={error}
      placeholder={placeholder} required={required}
      suffix={
        <span onClick={() => setShow(s => !s)} style={{ color: '#9a6040', lineHeight: 0 }}>
          {show ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </span>
      }
    />
  )
}

// ── Auth Button ───────────────────────────────────────────────────
function AuthBtn({ children, onClick, loading, variant = 'primary' }) {
  const [hov, setHov] = useState(false)
  const isPrimary = variant === 'primary'
  return (
    <button onClick={onClick} disabled={loading}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '100%', padding: '12px 0', borderRadius: 50, border: isPrimary ? '1px solid rgba(201,168,76,.35)' : `1.5px solid ${hov ? C.gold : 'rgba(201,168,76,.35)'}`, background: isPrimary ? (loading ? '#bbb' : `linear-gradient(135deg,${C.crimson},${C.darkRed})`) : (hov ? 'rgba(201,168,76,.1)' : 'transparent'), color: isPrimary ? C.white : C.crimson, fontWeight: 700, fontSize: '.88rem', cursor: loading ? 'wait' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .3s', boxShadow: isPrimary && !loading ? (hov ? `0 0 0 2px ${C.gold}, 0 10px 28px rgba(107,15,15,.45)` : '0 4px 16px rgba(107,15,15,.3)') : (hov ? `0 0 0 1.5px ${C.gold}` : 'none'), transform: hov && !loading ? 'translateY(-2px)' : 'translateY(0)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {loading && <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />}
      {children}
    </button>
  )
}

// ── Divider ───────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '1.2rem 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,.2)' }} />
      <span style={{ fontSize: '.72rem', color: '#bba060', fontWeight: 600, letterSpacing: '1px' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,.2)' }} />
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return (
    <div style={{ position: 'fixed', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 99999, background: type === 'success' ? '#1e4d2b' : '#7a1a1a', color: 'white', padding: '12px 24px', borderRadius: 50, fontSize: '.84rem', fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,.3)', border: `1px solid ${type === 'success' ? 'rgba(46,160,67,.4)' : 'rgba(201,168,76,.3)'}`, animation: 'fadeUp .3s ease both', whiteSpace: 'nowrap' }}>{msg}</div>
  )
}

// ── Server Error Banner ───────────────────────────────────────────
function ErrorBanner({ msg }) {
  if (!msg) return null
  return (
    <div style={{ background: 'rgba(192,57,43,.1)', border: '1px solid rgba(192,57,43,.3)', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: '.82rem', color: '#c0392b', display: 'flex', alignItems: 'center', gap: 8 }}>
      ⚠ {msg}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMER AUTH  (now with real API calls)
// ══════════════════════════════════════════════════════════════════
function CustomerAuth({ onSuccess, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab)
  useEffect(() => {
  setTab(initialTab)
}, [initialTab])
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)
  const [serverError, setServerError] = useState('')

  const [loginData, setLoginData]     = useState({ email: '', password: '' })
  const [loginErrors, setLoginErrors] = useState({})

  const [signData, setSignData]   = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [signErrors, setSignErrors] = useState({})

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const clearErrors = () => { setServerError(''); setLoginErrors({}); setSignErrors({}) }

  // ── Validate ──────────────────────────────────────────────────
  const validateLogin = () => {
    const e = {}
    if (!validateEmail(loginData.email)) e.email    = 'Enter a valid email address'
    if (!loginData.password)             e.password = 'Password is required'
    return e
  }

  const validateSignup = () => {
    const e = {}
    if (!signData.name.trim())                 e.name     = 'Full name is required'
    if (!validateEmail(signData.email))         e.email    = 'Enter a valid email address'
    if (!validatePhone(signData.phone))         e.phone    = 'Enter a valid 10-digit phone'
    if (!validatePassword(signData.password))   e.password = 'Password must be at least 6 characters'
    if (signData.password !== signData.confirm) e.confirm  = 'Passwords do not match'
    return e
  }

  // ── Login → real API ──────────────────────────────────────────
  const handleLogin = async () => {
    const e = validateLogin()
    if (Object.keys(e).length) { setLoginErrors(e); return }
    setLoading(true)
    setServerError('')
    try {
      const data = await api.login({ email: loginData.email, password: loginData.password })
      // data = { token, user: { id, name, email, phone, address } }
      showToast(`Welcome back, ${data.user.name}! 🎉`)
      setTimeout(() => onSuccess({ ...data.user, role: 'customer' }, data.token), 800)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Signup → real API ─────────────────────────────────────────
  const handleSignup = async () => {
    const e = validateSignup()
    if (Object.keys(e).length) { setSignErrors(e); return }
    setLoading(true)
    setServerError('')
    try {
      // Register the user
      await api.register({
        name:     signData.name,
        email:    signData.email,
        phone:    signData.phone,
        password: signData.password,
      })
      // Auto-login after register
      const data = await api.login({ email: signData.email, password: signData.password })
      showToast(`Welcome to Puji, ${data.user.name}! 🎉`)
      setTimeout(() => onSuccess({ ...data.user, role: 'customer' }, data.token), 800)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
  if (!validateEmail(forgotEmail)) {
    setForgotError('Enter a valid email address');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      "https://puji-home-foods.onrender.com/api/users/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    showToast("Reset link sent! Check your inbox 📧")
    setTimeout(() => setTab("login"), 1500)
  } catch (error) {
    setForgotError(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {tab !== 'forgot' && (
        <div style={{ display: 'flex', background: 'rgba(201,168,76,.1)', borderRadius: 50, padding: 4, marginBottom: '1.6rem', border: '1px solid rgba(201,168,76,.2)' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); clearErrors() }}
              style={{ flex: 1, padding: '8px 0', borderRadius: 50, border: 'none', background: tab === t ? `linear-gradient(135deg,${C.crimson},${C.darkRed})` : 'transparent', color: tab === t ? C.white : C.crimson, fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .3s', boxShadow: tab === t ? '0 4px 12px rgba(107,15,15,.3)' : 'none', textTransform: 'capitalize' }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
      )}

      {/* LOGIN */}
      {tab === 'login' && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <ErrorBanner msg={serverError} />
          <Input label="Email Address" type="email" value={loginData.email}
            onChange={v => setLoginData(d => ({ ...d, email: v }))}
            error={loginErrors.email} placeholder="email@example.com" required />
          <PasswordInput label="Password" value={loginData.password}
            onChange={v => setLoginData(d => ({ ...d, password: v }))}
            error={loginErrors.password} placeholder="Enter your password" required />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.4rem' }}>
            <button onClick={() => setTab('forgot')}
              style={{ background: 'none', border: 'none', color: C.crimson, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>
              Forgot Password?
            </button>
          </div>

          <AuthBtn onClick={handleLogin} loading={loading}>Sign In</AuthBtn>

          <p style={{ textAlign: 'center', fontSize: '.8rem', color: '#9a6040', marginTop: '1.2rem' }}>
            Don't have an account?{' '}
            <button onClick={() => { setTab('signup'); clearErrors() }}
              style={{ background: 'none', border: 'none', color: C.crimson, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Create one →</button>
          </p>
        </div>
      )}

      {/* SIGNUP */}
      {tab === 'signup' && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <ErrorBanner msg={serverError} />
          <Input label="Full Name" value={signData.name}
            onChange={v => setSignData(d => ({ ...d, name: v }))}
            error={signErrors.name} placeholder="e.g. Priya Sharma" required />
          <Input label="Email Address" type="email" value={signData.email}
            onChange={v => setSignData(d => ({ ...d, email: v }))}
            error={signErrors.email} placeholder="email@example.com" required />
          <Input label="Phone Number" type="tel" value={signData.phone}
            onChange={v => setSignData(d => ({ ...d, phone: v }))}
            error={signErrors.phone} placeholder="10-digit mobile number" required />
          <PasswordInput label="Password" value={signData.password}
            onChange={v => setSignData(d => ({ ...d, password: v }))}
            error={signErrors.password} placeholder="At least 6 characters" required />
          <PasswordInput label="Confirm Password" value={signData.confirm}
            onChange={v => setSignData(d => ({ ...d, confirm: v }))}
            error={signErrors.confirm} placeholder="Re-enter your password" required />

          <AuthBtn onClick={handleSignup} loading={loading}>Create Account</AuthBtn>

          <p style={{ textAlign: 'center', fontSize: '.8rem', color: '#9a6040', marginTop: '1.2rem' }}>
            Already have an account?{' '}
            <button onClick={() => { setTab('login'); clearErrors() }}
              style={{ background: 'none', border: 'none', color: C.crimson, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign in →</button>
          </p>
        </div>
      )}

      {/* FORGOT */}
      {tab === 'forgot' && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,.12)', border: '2px solid rgba(201,168,76,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.6rem' }}>🔑</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#1a0400', marginBottom: 6 }}>Reset Password</h3>
            <p style={{ fontSize: '.82rem', color: '#9a6040' }}>Enter your email and we'll send a reset link.</p>
          </div>
          <Input label="Email Address" type="email" value={forgotEmail}
            onChange={v => { setForgotEmail(v); setForgotError('') }}
            error={forgotError} placeholder="email@example.com" required />
          <AuthBtn onClick={handleForgot} loading={loading}>Send Reset Link</AuthBtn>
          <button onClick={() => setTab('login')}
            style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: C.crimson, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>← Back to Sign In</button>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ADMIN AUTH  (unchanged — uses admin code, not backend)
// ══════════════════════════════════════════════════════════════════
function AdminAuth({ onSuccess, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab)

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const [loginData, setLoginData]     = useState({ email: '', password: '', remember: false })
  const [loginErrors, setLoginErrors] = useState({})

  const [signData, setSignData]   = useState({ name: '', email: '', phone: '', password: '', confirm: '', code: '' })
  const [signErrors, setSignErrors] = useState({})

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const validateAdminLogin = () => {
    const e = {}
    if (!validateEmail(loginData.email)) e.email    = 'Enter a valid admin email'
    if (!loginData.password)             e.password = 'Password is required'
    return e
  }

  const validateAdminSignup = () => {
    const e = {}
    if (!signData.name.trim())                 e.name     = 'Full name is required'
    if (!validateEmail(signData.email))         e.email    = 'Enter a valid email address'
    if (!validatePhone(signData.phone))         e.phone    = 'Enter a valid 10-digit phone'
    if (!validatePassword(signData.password))   e.password = 'Password must be at least 6 characters'
    if (signData.password !== signData.confirm) e.confirm  = 'Passwords do not match'
    
    return e
  }

  const handleLogin = async () => {
  const e = validateAdminLogin();

  if (Object.keys(e).length) {
    setLoginErrors(e);
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
  "https://puji-home-foods.onrender.com/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    showToast("Admin access granted 🛡️");

    setTimeout(() => {
      onSuccess(
        {
          ...data.admin,
          role: "admin",
        },
        data.token
      );
    }, 800);

  } catch (error) {
  showToast(error.message, "error");
} finally {
    setLoading(false);
  }
};

  const handleSignup = async () => {
  const e = validateAdminSignup()
  if (Object.keys(e).length) { setSignErrors(e); return }
  setLoading(true)
  try {
    const response = await fetch('https://puji-home-foods.onrender.com/api/invite/register-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: signData.name,
        email: signData.email,
        password: signData.password,
        code: signData.code,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    showToast('Admin account created successfully 🛡️')
    setTimeout(() => setTab('login'), 1500)
  } catch (error) {
    showToast(error.message || 'Registration failed', 'error')
  } finally {
    setLoading(false)
  }
}


  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(61,0,0,.08)', border: '1px solid rgba(139,26,26,.2)', borderRadius: 12, padding: '10px 14px', marginBottom: '1.4rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.crimson} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <div>
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: C.crimson, letterSpacing: '.5px' }}>ADMIN PORTAL</div>
          <div style={{ fontSize: '.68rem', color: '#9a6040' }}>Restricted access — authorized personnel only</div>
        </div>
      </div>

      <div style={{ display: 'flex', background: 'rgba(201,168,76,.1)', borderRadius: 50, padding: 4, marginBottom: '1.5rem', border: '1px solid rgba(201,168,76,.2)' }}>
        {['login', 'signup'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '8px 0', borderRadius: 50, border: 'none', background: tab === t ? `linear-gradient(135deg,${C.maroon},${C.darkRed})` : 'transparent', color: tab === t ? C.white : C.crimson, fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all .3s', boxShadow: tab === t ? '0 4px 12px rgba(61,0,0,.35)' : 'none' }}>
            {t === 'login' ? 'Admin Sign In' : 'Register Admin'}
          </button>
        ))}
      </div>

      {tab === 'login' && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <Input label="Admin Email" type="email" value={loginData.email}
            onChange={v => setLoginData(d => ({ ...d, email: v }))}
            error={loginErrors.email} placeholder="admin@pujihomefoods.com" required />
          <PasswordInput label="Password" value={loginData.password}
            onChange={v => setLoginData(d => ({ ...d, password: v }))}
            error={loginErrors.password} placeholder="Admin password" required />
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '.8rem', color: '#7a4020', fontWeight: 500, userSelect: 'none' }}>
              <input type="checkbox" checked={loginData.remember} onChange={e => setLoginData(d => ({ ...d, remember: e.target.checked }))} style={{ accentColor: C.crimson, width: 14, height: 14 }} />
              Remember me
            </label>
          </div>
          <AuthBtn onClick={handleLogin} loading={loading}>Sign In as Admin</AuthBtn>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: '#9a6040', marginTop: '1rem' }}>
            New admin?{' '}
            <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: C.crimson, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Register here →</button>
          </p>
        </div>
      )}

      {tab === 'signup' && (
        <div style={{ animation: 'fadeUp .3s ease both' }}>
          <Input label="Full Name" value={signData.name} onChange={v => setSignData(d => ({ ...d, name: v }))} error={signErrors.name} placeholder="Your full name" required />
          <Input label="Admin Email" type="email" value={signData.email} onChange={v => setSignData(d => ({ ...d, email: v }))} error={signErrors.email} placeholder="admin@pujihomefoods.com" required />
          <Input label="Phone Number" type="tel" value={signData.phone} onChange={v => setSignData(d => ({ ...d, phone: v }))} error={signErrors.phone} placeholder="10-digit mobile number" required />
          <PasswordInput label="Password" value={signData.password} onChange={v => setSignData(d => ({ ...d, password: v }))} error={signErrors.password} placeholder="At least 6 characters" required />
          <PasswordInput label="Confirm Password" value={signData.confirm} onChange={v => setSignData(d => ({ ...d, confirm: v }))} error={signErrors.confirm} placeholder="Re-enter password" required />
          <PasswordInput label="Invite Code" value={signData.code} onChange={v => setSignData(d => ({ ...d, code: v }))} error={signErrors.code} placeholder="Enter invite code" required={false} />
          <AuthBtn onClick={handleSignup} loading={loading}>Create Admin Account</AuthBtn>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: '#9a6040', marginTop: '1rem' }}>
            Already registered?{' '}
            <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: C.crimson, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign in →</button>
          </p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// PORTAL PICKER
// ══════════════════════════════════════════════════════════════════
function PortalPicker({ onSelect, initialTab = 'login' }) {
  const portals = [
    { key: 'customer', icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), title: 'Customer Portal', desc: 'Shop, track orders & manage your account' },
    { key: 'admin',    icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), title: 'Admin Portal', desc: 'Manage products, orders & operations' },
  ]
  return (
    <div style={{ animation: 'fadeUp .35s ease both' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '.72rem', letterSpacing: '5px', textTransform: 'uppercase', color: C.gold, fontWeight: 700, marginBottom: 8 }}>Welcome Back</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a0400', marginBottom: 6 }}>
          Choose Your <span style={{ color: C.gold }}>Portal</span>
        </h2>
        <p style={{ fontSize: '.82rem', color: '#9a6040' }}>Select how you'd like to sign in</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {portals.map(p => <PortalCard key={p.key} p={p} onSelect={onSelect} initialTab={initialTab} />)}
      </div>
    </div>
  )
}

function PortalCard({ p, onSelect, initialTab = 'login' }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={() => onSelect(p.key, initialTab)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.4rem', borderRadius: 16, cursor: 'pointer', border: `1.5px solid ${hov ? C.gold : 'rgba(201,168,76,.25)'}`, background: hov ? 'rgba(201,168,76,.06)' : C.offWhite, transition: 'all .3s ease', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? `0 0 0 1.5px ${C.gold}, 0 10px 28px rgba(201,168,76,.14)` : '0 2px 10px rgba(0,0,0,.05)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: hov ? `linear-gradient(135deg,${C.crimson},${C.darkRed})` : `linear-gradient(135deg,${C.brown},${C.maroon})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .3s', boxShadow: hov ? '0 0 0 3px rgba(201,168,76,.25)' : 'none' }}>
        {p.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1a0400', marginBottom: 3 }}>{p.title}</div>
        <div style={{ fontSize: '.76rem', color: '#9a6040' }}>{p.desc}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hov ? C.gold : '#bba060'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all .3s', transform: hov ? 'translateX(3px)' : 'translateX(0)', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN MODAL
// ══════════════════════════════════════════════════════════════════
export default function AuthModal() {
  const { authModal, closeAuth, login } = useAuth()
  const [portal, setPortal] = useState(null)
  const [initialTab, setInitialTab] = useState('login')
  const overlayRef = useRef(null)

  useEffect(() => {
    if (authModal) {
      if (authModal === 'admin') { setPortal('admin'); setInitialTab('login') }
      else if (authModal === 'signup') { setPortal('customer'); setInitialTab('signup') }
      else if (authModal === 'customer') { setPortal('customer'); setInitialTab('login') }
      else if (authModal === 'picker-signup') { setPortal(null); setInitialTab('signup') }
      else setPortal(null)
      
      
    } else {
      setPortal(null)
    }
  }, [authModal])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') closeAuth() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [closeAuth])

  useEffect(() => {
    document.body.style.overflow = authModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [authModal])

  if (!authModal) return null

  // onSuccess now receives (userData, token)
  const handleSuccess = (userData, token) => { login(userData, token) }
  const handleBack    = () => setPortal(null)

  return (
    <>
      <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) closeAuth() }}
        style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(26,4,0,.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn .25s ease both' }}>
        <div style={{ width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto', background: C.white, borderRadius: 24, border: '1px solid rgba(201,168,76,.28)', boxShadow: '0 40px 100px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.1)', position: 'relative', animation: 'modalSlideUp .35s cubic-bezier(.34,1.56,.64,1) both' }}>

          <div style={{ background: `linear-gradient(135deg,${C.brown},${C.darkRed})`, borderRadius: '24px 24px 0 0', padding: '1.4rem 1.6rem 1.2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/images/logo.png" alt="Puji" style={{ height: 38, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(201,168,76,.4))' }} />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '.95rem', fontWeight: 900, color: C.goldL, letterSpacing: 1 }}>PUJI HOME FOODS</div>
                  <div style={{ fontSize: '.58rem', color: 'rgba(240,230,208,.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {portal ? (portal === 'customer' ? 'Customer Portal' : 'Admin Portal') : 'Authentication'}
                  </div>
                </div>
              </div>
              <button onClick={closeAuth}
                style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(201,168,76,.22)', color: C.cream, width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, transition: 'all .25s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,.2)'; e.currentTarget.style.borderColor = C.gold }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,.22)' }}>✕</button>
            </div>
            {portal && (
              <button onClick={handleBack}
                style={{ marginTop: 10, background: 'none', border: 'none', color: 'rgba(240,230,208,.65)', fontSize: '.76rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = C.goldL}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,230,208,.65)'}
              >← Back to portal selection</button>
            )}
          </div>

          <div style={{ padding: '1.6rem' }}>
            {!portal && <PortalPicker onSelect={(key, tab) => { console.log('portal selected:', key, 'tab:', tab); setPortal(key); setInitialTab(tab) }} initialTab={initialTab} />}
            {portal === 'customer' && <CustomerAuth onSuccess={handleSuccess} initialTab={initialTab} />}
            {portal === 'admin' &&
  <AdminAuth
    key={initialTab}
    onSuccess={handleSuccess}
    initialTab={initialTab}
  />
}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalSlideUp { from{opacity:0;transform:translateY(40px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin         { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}

