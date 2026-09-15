import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const AVATAR_PLACEHOLDER = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/avatar-place.png'

function getAuthHeader(token) {
  return { Authorization: `Bearer ${token}` }
}

function Alert({ msg }) {
  if (!msg) return null
  const isErr = msg.type === 'error'
  return (
    <div className={`flex items-center gap-[8px] px-[12px] py-[9px] rounded-[4px] text-[12px] mb-[16px] border ${isErr ? 'bg-[#fff2f5] border-[#fcd9e0] text-[#d9214e]' : 'bg-[#f0faf4] border-[#c2ebd3] text-[#1a7a45]'}`}>
      <span className="text-[14px] leading-none">{isErr ? '✕' : '✓'}</span>
      <span>{msg.text}</span>
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-[#e4e3ee] rounded-[6px] overflow-hidden">
      <div className="px-[20px] py-[13px] border-b border-[#eeedf6] bg-[#f8f7fc]">
        <h2 className="text-[13px] font-semibold text-[#2E294E] m-0 tracking-[0.01em] uppercase">{title}</h2>
      </div>
      <div className="p-[20px]">{children}</div>
    </div>
  )
}

function FieldRow({ label, required, children }) {
  return (
    <div className="flex items-center gap-[12px]">
      <label className="w-[140px] flex-shrink-0 text-[12px] text-[#5a546e] font-medium">
        {label}{required && <span className="text-[#d9214e] ml-[2px]">*</span>}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function TextInput({ name, type = 'text', value, onChange, placeholder, disabled }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-[36px] px-[10px] border border-[#dddbe8] rounded-[4px] text-[12px] text-[#2E294E] placeholder:text-[#b8b5ca] focus:outline-none focus:border-[#2E294E] focus:ring-[2px] focus:ring-[#2E294E]/10 bg-white disabled:bg-[#f5f4fa] disabled:text-[#a5a3b8] transition-colors"
    />
  )
}

function PrimaryBtn({ saving, onClick, label = 'Save Changes' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="h-[36px] px-[18px] bg-[#2E294E] hover:bg-[#231e3b] active:bg-[#1a1630] text-white text-[12px] font-semibold rounded-[4px] transition-colors disabled:opacity-50 flex items-center gap-[6px]"
    >
      {saving && (
        <span className="inline-block w-[12px] h-[12px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {saving ? 'Saving…' : label}
    </button>
  )
}

export default function Profile_Seller() {
  const { user, token, login, role } = useAuth()

  const [profile, setProfile]       = useState({ fullName: '', email: '', phone: '', avatar: '', shopName: '' })
  const [loading, setLoading]       = useState(true)
  const [infoMsg, setInfoMsg]       = useState(null)
  const [passMsg, setPassMsg]       = useState(null)
  const [emailMsg, setEmailMsg]     = useState(null)
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [passwords, setPasswords]   = useState({ current: '', newPass: '', confirm: '' })
  const [emailForm, setEmailForm]   = useState({ newEmail: '', password: '' })
  const fileRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await fetch(`${API_URL}/auth/profile`, { headers: getAuthHeader(token) })
        const data = await res.json()
        if (data.success) {
          setProfile({
            fullName: data.user.fullName || '',
            email:    data.user.email    || '',
            phone:    data.user.phone    || '',
            avatar:   data.user.avatar   || '',
            shopName: data.user.shopName || '',
          })
        } else {
          setProfile({
            fullName: user?.fullName || '',
            email:    user?.email    || '',
            phone:    user?.phone    || '',
            avatar:   user?.avatar   || '',
            shopName: user?.shopName || '',
          })
        }
      } catch {
        setProfile({
          fullName: user?.fullName || '',
          email:    user?.email    || '',
          phone:    user?.phone    || '',
          avatar:   user?.avatar   || '',
          shopName: user?.shopName || '',
        })
      }
      setLoading(false)
    }
    if (token) fetchProfile()
    else {
      setProfile({
        fullName: user?.fullName || '',
        email:    user?.email    || '',
        phone:    user?.phone    || '',
        avatar:   user?.avatar   || '',
        shopName: user?.shopName || '',
      })
      setLoading(false)
    }
  }, [token])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) { setInfoMsg({ type: 'error', text: 'Only JPEG, PNG, WEBP, or GIF allowed.' }); return }
    if (file.size > 5 * 1024 * 1024) { setInfoMsg({ type: 'error', text: 'Image must be under 5MB.' }); return }
    setUploading(true); setInfoMsg(null)
    const fd = new FormData(); fd.append('image', file)
    try {
      const upRes  = await fetch(`${API_URL}/upload`, { method: 'POST', headers: getAuthHeader(token), body: fd })
      const upData = await upRes.json()
      if (!upRes.ok || !upData.url) throw new Error(upData.message || 'Upload failed')
      const avRes  = await fetch(`${API_URL}/auth/update-avatar`, {
        method: 'PUT',
        headers: { ...getAuthHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: upData.url }),
      })
      const avData = await avRes.json()
      if (avData.success) {
        setProfile(prev => ({ ...prev, avatar: avData.avatar }))
        login(token, { ...user, avatar: avData.avatar }, role)
        setInfoMsg({ type: 'success', text: 'Avatar updated.' })
      } else {
        setInfoMsg({ type: 'error', text: avData.message || 'Avatar update failed.' })
      }
    } catch (err) {
      setInfoMsg({ type: 'error', text: err.message || 'Upload error.' })
    } finally {
      setUploading(false); e.target.value = ''
    }
  }

  const handleSaveInfo = async () => {
    if (!profile.fullName.trim()) { setInfoMsg({ type: 'error', text: 'Full name is required.' }); return }
    setSavingInfo(true); setInfoMsg(null)
    try {
      const res  = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: { ...getAuthHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile.fullName,
          phone:    profile.phone,
          shopName: profile.shopName,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setProfile(prev => ({ ...prev, ...data.user }))
        login(token, { ...user, fullName: data.user.fullName, phone: data.user.phone, shopName: data.user.shopName }, role)
        setInfoMsg({ type: 'success', text: 'Profile updated successfully.' })
      } else {
        setInfoMsg({ type: 'error', text: data.message || 'Update failed.' })
      }
    } catch { setInfoMsg({ type: 'error', text: 'Network error.' }) }
    setSavingInfo(false)
  }

  const handleSaveEmail = async () => {
    setEmailMsg(null)
    if (!emailForm.newEmail.trim()) { setEmailMsg({ type: 'error', text: 'New email is required.' }); return }
    if (!emailForm.password)        { setEmailMsg({ type: 'error', text: 'Current password is required.' }); return }
    setSavingEmail(true)
    try {
      const res  = await fetch(`${API_URL}/auth/change-email`, {
        method: 'PUT',
        headers: { ...getAuthHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: emailForm.newEmail.trim(), password: emailForm.password }),
      })
      const data = await res.json()
      if (data.success) {
        setProfile(prev => ({ ...prev, email: data.email }))
        login(data.token, { ...user, email: data.email }, role)
        setEmailForm({ newEmail: '', password: '' })
        setEmailMsg({ type: 'success', text: 'Email updated successfully.' })
      } else {
        setEmailMsg({ type: 'error', text: data.message || 'Email update failed.' })
      }
    } catch { setEmailMsg({ type: 'error', text: 'Network error.' }) }
    setSavingEmail(false)
  }

  const handleSavePass = async () => {
    setPassMsg(null)
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPassMsg({ type: 'error', text: 'All password fields are required.' }); return
    }
    if (passwords.newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return
    }
    if (passwords.newPass !== passwords.confirm) {
      setPassMsg({ type: 'error', text: 'Passwords do not match.' }); return
    }
    setSavingPass(true)
    try {
      const res  = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { ...getAuthHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      })
      const data = await res.json()
      if (data.success) {
        setPasswords({ current: '', newPass: '', confirm: '' })
        setPassMsg({ type: 'success', text: 'Password changed successfully.' })
      } else {
        setPassMsg({ type: 'error', text: data.message || 'Failed to change password.' })
      }
    } catch { setPassMsg({ type: 'error', text: 'Network error.' }) }
    setSavingPass(false)
  }

  if (loading) return (
    <div className="flex items-center gap-[8px] text-[12px] text-[#a5a3b8] mt-[20px]">
      <span className="inline-block w-[14px] h-[14px] border-[2px] border-[#dddbe8] border-t-[#2E294E] rounded-full animate-spin" />
      Loading profile…
    </div>
  )

  const avatarSrc = profile.avatar || AVATAR_PLACEHOLDER

  return (
    <div>
      {/* Page header */}
      <div className="mb-[20px]">
        <h1 className="text-[18px] font-semibold text-[#2E294E] m-0 leading-tight">My Profile</h1>
        <p className="text-[12px] text-[#a5a3b8] mt-[3px] m-0">Manage your account information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-[18px]">

        {/* Left: Avatar panel */}
        <div>
          <SectionCard title="Photo">
            <div className="flex flex-col items-center gap-[12px]">

              {/* Avatar with purple ring */}
              <div className="relative">
                <div className="w-[88px] h-[88px] rounded-full p-[2px] bg-gradient-to-br from-[#2E294E] to-[#5a4e8a]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#f5f4fa]">
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = AVATAR_PLACEHOLDER }}
                    />
                  </div>
                </div>
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <span className="inline-block w-[16px] h-[16px] border-[2px] border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Name + role badge */}
              <div className="text-center">
                <p className="text-[13px] font-semibold text-[#2E294E] m-0 leading-tight">{profile.fullName || 'Seller'}</p>
                <p className="text-[11px] text-[#a5a3b8] mt-[2px] mb-[6px] truncate max-w-[160px]">{profile.email}</p>
                <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] bg-[#2E294E] text-white text-[10px] font-semibold rounded-[3px] tracking-[0.04em] uppercase">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#a89fd4] inline-block" />
                  Seller
                </span>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-[32px] border border-[#dddbe8] hover:border-[#2E294E] hover:text-[#2E294E] text-[#5a546e] text-[12px] font-medium rounded-[4px] transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Change Photo'}
              </button>
              <p className="text-[10px] text-[#b8b5ca] text-center m-0">JPG, PNG, WEBP or GIF · Max 5MB</p>
            </div>
          </SectionCard>
        </div>

        {/* Right: forms */}
        <div className="flex flex-col gap-[18px]">

          {/* Basic Information */}
          <SectionCard title="Basic Information">
            <Alert msg={infoMsg} />
            <div className="flex flex-col gap-[12px]">
              <FieldRow label="Full Name" required>
                <TextInput
                  name="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="Enter full name"
                />
              </FieldRow>
              <FieldRow label="Shop Name" required>
                <TextInput
                  name="shopName"
                  value={profile.shopName}
                  onChange={(e) => setProfile(p => ({ ...p, shopName: e.target.value }))}
                  placeholder="Enter shop name"
                />
              </FieldRow>
              <FieldRow label="Phone Number">
                <TextInput
                  name="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </FieldRow>
            </div>
            <div className="flex justify-end mt-[16px] pt-[14px] border-t border-[#eeedf6]">
              <PrimaryBtn saving={savingInfo} onClick={handleSaveInfo} />
            </div>
          </SectionCard>

          {/* Change Email */}
          <SectionCard title="Change Email">
            <Alert msg={emailMsg} />
            <div className="flex flex-col gap-[12px]">
              <FieldRow label="Current Email">
                <TextInput name="currentEmail" value={profile.email} disabled placeholder="Current email" />
              </FieldRow>
              <FieldRow label="New Email" required>
                <TextInput
                  name="newEmail"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm(p => ({ ...p, newEmail: e.target.value }))}
                  placeholder="Enter new email address"
                />
              </FieldRow>
              <FieldRow label="Confirm Password" required>
                <TextInput
                  name="emailPassword"
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter current password to confirm"
                />
              </FieldRow>
            </div>
            <div className="flex justify-end mt-[16px] pt-[14px] border-t border-[#eeedf6]">
              <PrimaryBtn saving={savingEmail} onClick={handleSaveEmail} label="Update Email" />
            </div>
          </SectionCard>

          {/* Change Password */}
          <SectionCard title="Change Password">
            <Alert msg={passMsg} />
            <div className="flex flex-col gap-[12px]">
              <FieldRow label="Current Password" required>
                <TextInput
                  name="current"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  placeholder="Current password"
                />
              </FieldRow>
              <FieldRow label="New Password" required>
                <TextInput
                  name="newPass"
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                  placeholder="New password (min 6 chars)"
                />
              </FieldRow>
              <FieldRow label="Confirm Password" required>
                <TextInput
                  name="confirm"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </FieldRow>
            </div>
            <div className="flex justify-end mt-[16px] pt-[14px] border-t border-[#eeedf6]">
              <PrimaryBtn saving={savingPass} onClick={handleSavePass} label="Update Password" />
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}