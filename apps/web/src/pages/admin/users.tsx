import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

const AdminUsers = () => {
  const { user } = useUser();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Role kontrolü
    if (!user || user.publicMetadata.role !== 'superadmin') {
      navigate('/');
      return;
    }

    // Kullanıcıları getir
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      // API'den kullanıcıları getir
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      // API'ye rol değişikliği isteği gönder
      await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      // Kullanıcı listesini güncelle
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-users">
      <div className="container">
        <h1 className="page-title">
          {currentLang === 'tr' ? 'Kullanıcı Yönetimi' : 'User Management'}
        </h1>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>{currentLang === 'tr' ? 'İsim' : 'Name'}</th>
                <th>{currentLang === 'tr' ? 'E-posta' : 'Email'}</th>
                <th>{currentLang === 'tr' ? 'Rol' : 'Role'}</th>
                <th>{currentLang === 'tr' ? 'İşlemler' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.role === 'user' ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRoleChange(user.id, 'admin')}
                      >
                        {currentLang === 'tr' ? 'Admin Yap' : 'Make Admin'}
                      </button>
                    ) : user.role === 'admin' ? (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleRoleChange(user.id, 'user')}
                      >
                        {currentLang === 'tr' ? 'Yetkiyi Kaldır' : 'Remove Admin'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-users {
          padding: 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .users-table {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        tr:last-child td {
          border-bottom: none;
        }

        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .role-badge.superadmin {
          background: #fee2e2;
          color: #dc2626;
        }

        .role-badge.admin {
          background: #dbeafe;
          color: #2563eb;
        }

        .role-badge.user {
          background: #f3f4f6;
          color: #4b5563;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 1.125rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .admin-users {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .users-table {
            overflow-x: auto;
          }

          table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminUsers; 