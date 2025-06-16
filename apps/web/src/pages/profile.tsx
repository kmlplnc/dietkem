import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded || !user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profil</h1>
      <div className="profile-content">
        <div className="profile-header">
          <img src={user.imageUrl} alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
        <div className="profile-details">
          <h3>Hesap Bilgileri</h3>
          <div className="detail-item">
            <span className="label">Ad:</span>
            <span className="value">{user.firstName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Soyad:</span>
            <span className="value">{user.lastName}</span>
          </div>
          <div className="detail-item">
            <span className="label">E-posta:</span>
            <span className="value">{user.emailAddresses[0]?.emailAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 