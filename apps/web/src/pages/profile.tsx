import { useState, useEffect, useRef } from 'react';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { trpc } from '../utils/trpc';
import { useAuth } from '../lib/auth';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dup6ahhjt/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'dietkem';

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
    setAvatarSuccess(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        updateAvatar.mutate({ avatarUrl: data.secure_url });
      } else {
        setError(currentLang === 'tr' ? 'Yükleme başarısız' : 'Upload failed');
      }
    } catch {
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
  }, [currentUser]); // Remove user and setUser from dependencies

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
        // CLERK_DISABLED_TEMP: clerkId: user?.id || '',
        clerkId: currentUser?.clerk_id || '',
        // CLERK_DISABLED_TEMP: email: user?.primaryEmailAddress?.emailAddress || '',
        email: currentUser?.email || '',
        firstName,
        // CLERK_DISABLED_TEMP: lastName: user?.lastName || '',
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
                {currentLang === 'tr' ? 'Ad Soyad' : 'Full Name'}
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (currentLang === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                : (currentLang === 'tr' ? 'Kaydet' : 'Save Changes')
              }
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 2rem;
          min-height: 100vh;
          background: #f9fafb;
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 64px;
        }

        .header {
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-button {
          position: absolute;
          left: 0;
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-button:hover {
          color: var(--primary-color);
          background-color: var(--hover-bg);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .profile-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
          color: #1f2937;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .submit-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .success-message {
          background: #dcfce7;
          color: #16a34a;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: #6b7280;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .avatar-img {
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          width: 96px;
          height: 96px;
          object-fit: cover;
        }

        .avatar-upload-label {
          margin-left: 16px;
          cursor: pointer;
        }

        .avatar-upload-btn {
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: background 0.2s;
          display: inline-block;
        }

        .avatar-upload-btn:hover {
          background: #1d4ed8;
        }

        .avatar-success {
          color: #16a34a;
          margin-left: 1rem;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem;
          }

          .profile-form {
            padding: 1.5rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
          }

          .back-button {
            position: static;
            align-self: flex-start;
          }

          .page-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage; 