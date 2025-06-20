import { useState, useEffect, useRef } from 'react';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { trpc } from '../utils/trpc';
import { useAuth } from '../lib/auth';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dup6ahhjt/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'dietkem';

interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  clerk_id: string | null;
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar_url: string | null;
}

const ProfilePage = () => {
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // CLERK_DISABLED_TEMP: const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || '');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuth();

  // Get current user data
  // CLERK_DISABLED_TEMP: const { data: currentUser, refetch: refetchUser } = trpc.users.getCurrentUser.useQuery(undefined, {
  // CLERK_DISABLED_TEMP:   enabled: !!user?.id,
  // CLERK_DISABLED_TEMP: });
  const { data: currentUser, refetch: refetchUser } = trpc.users.getCurrentUser.useQuery(undefined, {
    enabled: true,
  });

  // Setup update profile mutation
  const updateProfile = trpc.users.updateProfile.useMutation({
    onSuccess: async (data) => {
      if (data.success) {
        setSuccess(currentLang === 'tr' ? 'Profil başarıyla güncellendi' : 'Profile updated successfully');
        // Refetch user data to get updated values
        await refetchUser();
      } else {
        setError(currentLang === 'tr' ? 'Profil güncellenirken bir hata oluştu' : 'Error updating profile');
      }
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      setError(currentLang === 'tr' ? 'Profil güncellenirken bir hata oluştu' : 'Error updating profile');
    },
  });

  const updateAvatar = trpc.users.updateAvatar.useMutation({
    onSuccess: (data) => {
      setAvatarSuccess(currentLang === 'tr' ? 'Profil fotoğrafı güncellendi' : 'Avatar updated');
      setAvatarUrl(data.avatarUrl ?? "");
      refetchUser().then(() => {
        // Update auth context after refetch only if avatar actually changed
        if (data.avatarUrl && user && user.avatar_url !== data.avatarUrl) {
          setUser({ ...user, avatar_url: data.avatarUrl });
        }
      });
    },
    onError: () => {
      setError(currentLang === 'tr' ? 'Fotoğraf güncellenemedi' : 'Failed to update avatar');
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setAvatarSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dietkem_avatars');

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }
      
      const text = await res.text();
      if (!text) {
        throw new Error('Empty response from upload service');
      }
      
      const data = JSON.parse(text);
      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        updateAvatar.mutate({ avatarUrl: data.secure_url });
      } else {
        setError(currentLang === 'tr' ? 'Yükleme başarısız' : 'Upload failed');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError(currentLang === 'tr' ? 'Yükleme başarısız' : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    // Set initial values from database user
    if (currentUser.first_name) {
      setFirstName(currentUser.first_name);
    }
    // Avatar: always use DB if available
    if (currentUser.avatar_url) {
      setAvatarUrl(currentUser.avatar_url);
    }
    
    // Update auth context with latest user data only if values actually changed
    if (user && currentUser) {
      const hasChanges = 
        user.firstName !== currentUser.first_name ||
        user.lastName !== currentUser.last_name ||
        user.avatar_url !== currentUser.avatar_url;
      
      if (hasChanges) {
        setUser({
          ...user,
          firstName: currentUser.first_name,
          lastName: currentUser.last_name,
          avatar_url: currentUser.avatar_url
        });
      }
    }
  }, [currentUser, user, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // CLERK_DISABLED_TEMP: // Update Clerk user
      // CLERK_DISABLED_TEMP: await user?.update({
      // CLERK_DISABLED_TEMP:   firstName,
      // CLERK_DISABLED_TEMP: });

      // Update database using mutation
      await updateProfile.mutateAsync({
        clerkId: '', // TODO: Get actual clerk ID when available
        email: currentUser?.email || '',
        firstName,
        lastName: currentUser?.last_name || '',
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(currentLang === 'tr' ? 'Profil güncellenirken bir hata oluştu' : 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CLERK_DISABLED_TEMP: if (!isLoaded || !user) {
  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="page-container">
        <div className="header">
          <Link to="/" className="back-button">
            {currentLang === 'tr' ? 'Ana Sayfa' : 'Back to Home'}
          </Link>
          <h1 className="page-title">
            {currentLang === 'tr' ? 'Profil Ayarları' : 'Profile Settings'}
          </h1>
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <img
            src={currentUser?.avatar_url || avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            className="avatar-img"
            style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
          />
          <label className="avatar-upload-label" style={{ marginLeft: 16, cursor: 'pointer' }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
            <span className="avatar-upload-btn">
              {uploading
                ? (currentLang === 'tr' ? 'Yükleniyor...' : 'Uploading...')
                : (currentLang === 'tr' ? 'Yeni Fotoğraf Yükle' : 'Upload New Photo')}
            </span>
          </label>
          {avatarSuccess && <span className="avatar-success">{avatarSuccess}</span>}
        </div>

        <div className="profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">
                {currentLang === 'tr' ? 'Ad' : 'First Name'}
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                {currentLang === 'tr' ? 'Soyad' : 'Last Name'}
              </label>
              <input
                type="text"
                id="lastName"
                value={currentUser.last_name || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                {currentLang === 'tr' ? 'E-posta' : 'Email'}
              </label>
              <input
                type="email"
                id="email"
                value={currentUser.email}
                disabled
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (currentLang === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                : (currentLang === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes')}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 1rem;
        }
        .page-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .header {
          margin-bottom: 2rem;
        }
        .back-button {
          display: inline-block;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .back-button:hover {
          color: #4b5563;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .avatar-section {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .avatar-upload-btn {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border-radius: 6px;
          color: #4b5563;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        .avatar-upload-btn:hover {
          background: #e5e7eb;
        }
        .avatar-success {
          margin-left: 1rem;
          color: #059669;
          font-size: 0.9rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4b5563;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .form-group input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }
        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #fef2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }
        .success-message {
          color: #059669;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f0fdf4;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
        }
        .save-button {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .save-button:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .save-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.2rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage; 