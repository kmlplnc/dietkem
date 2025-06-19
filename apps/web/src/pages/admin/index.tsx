import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();

  const adminSections = [
    {
      title: currentLang === 'tr' ? 'Kullanıcı Yönetimi' : 'User Management',
      description: currentLang === 'tr' 
        ? 'Kullanıcıları görüntüleyin ve yönetin' 
        : 'View and manage users',
      icon: '👥',
      path: '/admin/users'
    },
    {
      title: currentLang === 'tr' ? 'Blog Yönetimi' : 'Blog Management',
      description: currentLang === 'tr'
        ? 'Blog yazılarını düzenleyin ve yönetin'
        : 'Edit and manage blog posts',
      icon: '📝',
      path: '/admin/blog-management'
    },
    {
      title: currentLang === 'tr' ? 'Bekleyen Yazılar' : 'Pending Posts',
      description: currentLang === 'tr'
        ? 'Onay bekleyen blog yazılarını görüntüleyin'
        : 'View pending blog posts',
      icon: '⏳',
      path: '/admin/pending-posts'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="page-container">
        <div className="header">
          <h1 className="page-title">
            {currentLang === 'tr' ? 'Admin Paneli' : 'Admin Panel'}
          </h1>
        </div>

        <div className="sections-grid">
          {adminSections.map((section) => (
            <div
              key={section.path}
              className="section-card"
              onClick={() => navigate(section.path)}
            >
              <div className="section-icon">{section.icon}</div>
              <h2 className="section-title">{section.title}</h2>
              <p className="section-description">{section.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
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
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-button:hover {
          background: #e5e7eb;
          transform: translateX(-2px);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          text-align: center;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .section-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .section-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .section-description {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .header {
            gap: 0.75rem;
          }

          .back-button {
            position: static;
            align-self: flex-start;
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 