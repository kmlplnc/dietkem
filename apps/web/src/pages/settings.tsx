import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SettingsPage = () => {
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
    <div className="settings-container">
      <h1>Ayarlar</h1>
      <div className="settings-content">
        <section className="settings-section">
          <h2>Hesap Ayarları</h2>
          <div className="settings-group">
            <div className="setting-item">
              <label>Bildirimler</label>
              <div className="toggle-switch">
                <input type="checkbox" id="notifications" />
                <label htmlFor="notifications"></label>
              </div>
            </div>
            <div className="setting-item">
              <label>E-posta Bildirimleri</label>
              <div className="toggle-switch">
                <input type="checkbox" id="email-notifications" />
                <label htmlFor="email-notifications"></label>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Görünüm</h2>
          <div className="settings-group">
            <div className="setting-item">
              <label>Karanlık Mod</label>
              <div className="toggle-switch">
                <input type="checkbox" id="dark-mode" />
                <label htmlFor="dark-mode"></label>
              </div>
            </div>
            <div className="setting-item">
              <label>Dil</label>
              <select className="language-select">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>Gizlilik</h2>
          <div className="settings-group">
            <div className="setting-item">
              <label>Profil Görünürlüğü</label>
              <select className="visibility-select">
                <option value="public">Herkese Açık</option>
                <option value="private">Gizli</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage; 