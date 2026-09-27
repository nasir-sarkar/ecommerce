import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Basic Info Form

function BasicInfoCard({ profile, onUpdate, token }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: profile.fullName || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only JPEG, PNG, WEBP, or GIF images are allowed' });
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    setUploadingAvatar(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Step 1: Upload file to /api/upload
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.message || 'Image upload failed');
      }

      const avatarUrl = uploadData.url;

      // Step 2: Update user profile with the new avatar URL
      const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      const updateData = await updateRes.json();
      if (updateData.success && onUpdate) {
        onUpdate({ ...profile, avatar: updateData.avatar });
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      } else {
        setMessage({ type: 'error', text: updateData.message || 'Failed to update avatar' });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Update profile info
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.name,
          phone: form.phone,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        if (onUpdate) onUpdate(data.user);

        // If password change requested
        if (form.newPassword && form.newPassword === form.confirmPassword && form.currentPassword) {
          const passwordResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/change-password`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
              }),
            }
          );
          const passwordData = await passwordResponse.json();
          if (passwordData.success) {
            setMessage({ type: 'success', text: 'Profile and password updated successfully!' });
            setForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '', currentPassword: '' }));
          } else {
            setMessage({ type: 'error', text: passwordData.message });
          }
        } else if (form.newPassword && form.newPassword !== form.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-none shadow-none border border-[#dfdfe6] mb-[1.5rem]">
      <div className="pt-[1.5rem] px-[1.25rem] border-b-0">
        <h5 className="mb-0 text-[18px] font-bold text-[#292933]">Basic Info</h5>
      </div>
      <div className="p-[1.25rem]">
        {message && (
          <div
            className={`mb-4 p-3 text-sm rounded ${
              message.type === 'success'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              Your name
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <input
                type="text"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Your name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Phone */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              Your Phone
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <input
                type="text"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Your Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Photo */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              Photo
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <div className="flex flex-wrap items-stretch w-full">
                <div className="flex">
                  <label
                    className={`flex items-center px-[0.75rem] py-[0.375rem] mb-0 text-[14px] font-medium text-[#292933] text-center whitespace-nowrap border border-[#dfdfe6] border-r-0 rounded-none cursor-pointer ${
                      uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ background: 'rgba(145, 145, 153, 0.15)' }}
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Browse'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>
                <div className="flex-1 block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none">
                  Choose File
                </div>
              </div>
              {profile?.avatar && (
                <div className="mt-2">
                  <img src={profile.avatar} alt="Avatar" className="w-12 h-12 object-cover rounded-full" />
                </div>
              )}
            </div>
          </div>
          {/* Current Password */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              Current Password
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <input
                type="password"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Current Password (required to change password)"
                name="currentPassword"
                value={form.currentPassword || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* New Password */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              New Password
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <input
                type="password"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="New Password (leave blank to keep current)"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Confirm Password */}
          <div className="flex flex-wrap mb-[1rem] -mx-[15px]">
            <label className="w-full md:w-2/12 px-[15px] pt-[0.375rem] pb-[0.375rem] mb-0 text-[14px]">
              Confirm Password
            </label>
            <div className="w-full md:w-10/12 px-[15px]">
              <input
                type="password"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Submit */}
          <div className="mb-0 text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0080ff] hover:bg-[#0066cc] text-white border-0 rounded-none w-[150px] mt-[1rem] py-[0.375rem] px-[0.75rem] text-[14px] disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function AddressCard({ addresses, onAddressUpdate, token }) {
  const [showDropdown, setShowDropdown] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      address: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      address: address.address,
      postalCode: address.postalCode || '',
      city: address.city,
      state: address.state,
      country: address.country,
      phone: address.phone || '',
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    });
    setShowForm(true);
    setShowDropdown(null);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && onAddressUpdate) {
        onAddressUpdate(data.addresses);
        // Force dropdown close
        setShowDropdown(null);
      } else {
        alert(data.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingAddress
        ? `${import.meta.env.VITE_API_URL}/auth/address/${editingAddress._id}`
        : `${import.meta.env.VITE_API_URL}/auth/address`;
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        onAddressUpdate(data.addresses);
        resetForm();
      } else {
        alert(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId, type) => {
    const addressToUpdate = addresses.find((a) => a._id === addressId);
    if (!addressToUpdate) return;

    const updates = {
      ...addressToUpdate,
      isDefaultShipping: type === 'shipping' ? true : addressToUpdate.isDefaultShipping,
      isDefaultBilling: type === 'billing' ? true : addressToUpdate.isDefaultBilling,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/address/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success && onAddressUpdate) {
        onAddressUpdate(data.addresses);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to update default address');
    }
    setShowDropdown(null);
  };

  return (
    <div className="bg-white rounded-none shadow-none border border-[#dfdfe6] mb-[1.5rem]">
      <div className="pt-[1.5rem] px-[1.25rem] border-b-0">
        <h5 className="mb-0 text-[18px] font-bold text-[#292933]">Address</h5>
      </div>
      <div className="p-[1.25rem]">
        {addresses &&
          addresses.map((addr) => (
            <div key={addr._id} className="border border-[#dfdfe6] p-[1.5rem] mb-[1.5rem] relative">
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">Address:</span>
                <span className="w-full md:w-8/12 px-[15px] text-[#292933]">{addr.address}</span>
              </div>
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">Postal code:</span>
                <span className="w-full md:w-10/12 px-[15px] text-[#292933]">{addr.postalCode || 'N/A'}</span>
              </div>
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">City:</span>
                <span className="w-full md:w-10/12 px-[15px] text-[#292933]">{addr.city}</span>
              </div>
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">State:</span>
                <span className="w-full md:w-10/12 px-[15px] text-[#292933]">{addr.state}</span>
              </div>
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">Country:</span>
                <span className="w-full md:w-10/12 px-[15px] text-[#292933]">{addr.country}</span>
              </div>
              <div className="flex flex-wrap text-[14px] mb-[0.5rem] md:mb-0 -mx-[15px]">
                <span className="w-full md:w-2/12 px-[15px] text-[#919199]">Phone:</span>
                <span className="w-full md:w-10/12 px-[15px] text-[#292933]">{addr.phone || 'N/A'}</span>
              </div>

              {addr.isDefaultShipping && (
                <div className="md:absolute md:top-0 md:right-0 pt-[0.5rem] md:pt-[1.5rem] md:pr-[3rem]">
                  <span
                    className="inline-block bg-[#292933] text-white p-[1rem] text-[12px] rounded-[25px] font-semibold"
                    style={{ minWidth: '80px' }}
                  >
                    Default Shipping
                  </span>
                </div>
              )}

              <div className="absolute right-0 top-0 pt-[1.5rem] mr-[0.25rem]">
                <button
                  className="bg-[#9d9da6] text-white px-[0.25rem] py-[0.25rem] border-0"
                  type="button"
                  onClick={() => setShowDropdown(showDropdown === addr._id ? null : addr._id)}
                >
                  <i className="la la-ellipsis-v">⋮</i>
                </button>
                {showDropdown === addr._id && (
                  <div className="absolute top-full right-0 z-[1000] min-w-[10rem] py-[0.5rem] m-0 text-[14px] text-left list-none bg-white bg-clip-padding border border-[rgba(0,0,0,0.15)] rounded-[0.25rem]">
                    <button
                      className="block w-full px-[1.5rem] py-[0.25rem] clear-both font-normal text-[#292933] whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] text-left"
                      onClick={() => handleEdit(addr)}
                    >
                      Edit
                    </button>
                    {!addr.isDefaultShipping && (
                      <button
                        className="block w-full px-[1.5rem] py-[0.25rem] clear-both font-normal text-[#292933] whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] text-left"
                        onClick={() => handleSetDefault(addr._id, 'shipping')}
                      >
                        Make This Default Shipping
                      </button>
                    )}
                    {!addr.isDefaultBilling && (
                      <button
                        className="block w-full px-[1.5rem] py-[0.25rem] clear-both font-normal text-[#292933] whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] text-left"
                        onClick={() => handleSetDefault(addr._id, 'billing')}
                      >
                        Make This Default Billing
                      </button>
                    )}
                    <button
                      className="block w-full px-[1.5rem] py-[0.25rem] clear-both font-normal text-[#292933] whitespace-nowrap bg-transparent hover:bg-[#f5f5f5] text-left"
                      onClick={() => handleDelete(addr._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Address Form */}
        {showForm && (
          <div className="border border-[#dfdfe6] p-[1.5rem] mb-[1.5rem]">
            <h6 className="text-[16px] font-bold mb-[1rem]">{editingAddress ? 'Edit Address' : 'Add New Address'}</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-[1rem]">
                <input
                  type="text"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="Street Address *"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem] mb-[1rem]">
                <input
                  type="text"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
                <input
                  type="text"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="State *"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="Country *"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
              <div className="mb-[1rem]">
                <input
                  type="tel"
                  className="block w-full px-[0.75rem] py-[0.375rem] text-[14px] border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-[1rem] mb-[1rem]">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-[0.5rem]"
                    checked={formData.isDefaultShipping}
                    onChange={(e) => setFormData({ ...formData, isDefaultShipping: e.target.checked })}
                  />
                  Set as default shipping address
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-[0.5rem]"
                    checked={formData.isDefaultBilling}
                    onChange={(e) => setFormData({ ...formData, isDefaultBilling: e.target.checked })}
                  />
                  Set as default billing address
                </label>
              </div>
              <div className="flex gap-[1rem]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0080ff] hover:bg-[#0066cc] text-white border-0 px-[1.5rem] py-[0.375rem] text-[14px] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingAddress ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#9d9da6] hover:bg-[#7d7d86] text-white border-0 px-[1.5rem] py-[0.375rem] text-[14px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add New Address */}
        {!showForm && (
          <div>
            <div
              onClick={() => setShowForm(true)}
              className="border border-[#dfdfe6] p-[1rem] mb-[1rem] cursor-pointer text-center bg-[#f5f5f5] transition hover:bg-[#dfdfe6]"
            >
              <i className="la la-plus la-2x" />
              <div className="text-[14px] font-bold" style={{ opacity: 0.7 }}>
                Add New Address
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



function ChangeEmailCard({ currentEmail, onEmailUpdate, onTokenUpdate, token }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [currentEmail]);

  const handleUpdateEmail = async () => {
    if (!email || email === currentEmail) {
      setMessage({ type: 'error', text: 'Please enter a new email address' });
      return;
    }

    if (!password) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm email change' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail: email, password }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Email updated successfully!' });
        if (onEmailUpdate) onEmailUpdate(data.email);
        if (onTokenUpdate && data.token) {
          localStorage.setItem('ec_token', data.token);
          if (onTokenUpdate) onTokenUpdate(data.token);
        }
        setPassword('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-none shadow-none border border-[#dfdfe6] mb-[1.5rem]">
      <div className="pt-[1.5rem] px-[1.25rem] border-b-0">
        <h5 className="mb-0 text-[18px] font-bold text-[#292933]">Change your email</h5>
      </div>
      <div className="p-[1.25rem]">
        {message && (
          <div
            className={`mb-4 p-3 text-sm rounded ${
              message.type === 'success'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="flex flex-wrap -mx-[15px]">
          <div className="w-full md:w-2/12 px-[15px]">
            <label className="text-[14px]">Your New Email</label>
          </div>
          <div className="w-full md:w-10/12 px-[15px]">
            <div className="flex flex-wrap items-stretch w-full mb-[1rem]">
              <input
                type="email"
                className="flex-1 block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-[15px]">
          <div className="w-full md:w-2/12 px-[15px]">
            <label className="text-[14px]">Your Password</label>
          </div>
          <div className="w-full md:w-10/12 px-[15px]">
            <div className="flex flex-wrap items-stretch w-full mb-[1rem]">
              <input
                type="password"
                className="flex-1 block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-0 text-right">
              <button
                type="button"
                className="bg-[#17c3f5] hover:bg-[#0fa8d6] text-white border-0 rounded-none w-[150px] mt-[1rem] py-[0.375rem] px-[0.75rem] text-[14px] disabled:opacity-65 disabled:cursor-not-allowed"
                onClick={handleUpdateEmail}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component

export default function ManageProfile_User() {
  const { user: authUser, token: authToken, role: authRole, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        // Keep AuthContext (and localStorage) in sync with the DB in case
        // it drifted (e.g. avatar updated from another tab/session).
        login(authToken, { ...authUser, ...data.user }, authRole || 'user');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setProfile(updatedUser);
    login(authToken, { ...authUser, ...updatedUser }, authRole || 'user');
  };

  const handleAddressUpdate = (addresses) => {
    setProfile((prev) => ({ ...prev, addresses }));
  };

  const handleEmailUpdate = (newEmail) => {
    setProfile((prev) => ({ ...prev, email: newEmail }));
  };

  const handleTokenUpdate = (newToken) => {
    if (authUser && login) {
      const updatedUser = { ...authUser, email: profile?.email };
      login(newToken, updatedUser, 'user');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-[1.5rem]">
          <h1 className="text-[20px] font-bold text-[#292933]">Manage Profile</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 mb-4"></div>
          <div className="h-60 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-[1.5rem]">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-[20px] font-bold text-[#292933]">Manage Profile</h1>
          </div>
        </div>
      </div>

      <BasicInfoCard profile={profile} onUpdate={handleProfileUpdate} token={authToken} />
      <AddressCard addresses={profile?.addresses || []} onAddressUpdate={handleAddressUpdate} token={authToken} />
      <ChangeEmailCard
        currentEmail={profile?.email || ''}
        onEmailUpdate={handleEmailUpdate}
        onTokenUpdate={handleTokenUpdate}
        token={authToken}
      />
    </div>
  );
}