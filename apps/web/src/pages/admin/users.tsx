import { useState, useEffect } from 'react';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../../utils/trpc';

// Yeni: Enum roller
const USER_ROLES = [
  'subscriber_basic',
  'subscriber_pro',
  'clinic_admin',
  'dietitian_team_member',
  'admin',
  'superadmin',
] as const;
type UserRole = typeof USER_ROLES[number];

interface User {
  id: number; // API'den gelen id number
  name: string;
  email: string;
  role: UserRole;
}

const roleLabels: Record<UserRole, { tr: string; en: string }> = {
  subscriber_basic: { tr: 'Abone (Basic)', en: 'Subscriber (Basic)' },
  subscriber_pro: { tr: 'Abone (Pro)', en: 'Subscriber (Pro)' },
  clinic_admin: { tr: 'Klinik Admin', en: 'Clinic Admin' },
  dietitian_team_member: { tr: 'Diyetisyen', en: 'Dietitian' },
  admin: { tr: 'Admin', en: 'Admin' },
  superadmin: { tr: 'Süper Admin', en: 'Superadmin' },
};

const AdminUsers = () => {
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleEdits, setRoleEdits] = useState<Record<number, UserRole>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);

  // Get user role from database
  // CLERK_DISABLED_TEMP: const { data: currentUser } = trpc.users.getCurrentUser.useQuery(undefined, {
  // CLERK_DISABLED_TEMP:   enabled: !!user?.id,
  // CLERK_DISABLED_TEMP: });
  const { data: currentUser } = trpc.users.getCurrentUser.useQuery(undefined, {
    enabled: true,
  });

  // Get all users
  const { data: allUsers, isLoading: isLoadingUsers } = trpc.users.list.useQuery(undefined, {
    enabled: !!currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin'),
  });

  // Add this at the top of the component
  const updateRole = trpc.users.updateRole.useMutation();
  const deleteUser = trpc.users.deleteUser.useMutation();

  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (!isLoaded) {
    // CLERK_DISABLED_TEMP:   return;
    // CLERK_DISABLED_TEMP: }

    // CLERK_DISABLED_TEMP: if (!user) {
    // CLERK_DISABLED_TEMP:   navigate('/sign-in');
    // CLERK_DISABLED_TEMP:   return;
    // CLERK_DISABLED_TEMP: }

    if (currentUser) {
      if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
        navigate('/');
        return;
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers);
      setLoading(false);
    }
  }, [allUsers]);

  const handleRoleDropdownChange = (userId: number, newRole: UserRole) => {
    setRoleEdits((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleRoleUpdate = async (userId: number) => {
    const newRole = roleEdits[userId];
    console.log('DEBUG: Kaydet butonuna basıldı', { userId, newRole });
    if (!newRole) return;
    setUpdatingRole(userId);
    try {
      console.log('DEBUG: Mutation çağrılıyor', { userId, newRole });
      await updateRole.mutateAsync({ userId, role: newRole });
      console.log('DEBUG: Mutation bitti', { userId, newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setRoleEdits((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch (error) {
      console.log('DEBUG: Mutation hata', error);
      alert('Rol güncellenemedi!');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setDeleting(true);
    try {
      await deleteUser.mutateAsync({ userId });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Kullanıcı silinemedi!');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || isLoadingUsers) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-users">
      <div className="page-container">
        <div className="header">
          <h1 className="page-title">
            {currentLang === 'tr' ? 'Kullanıcı Yönetimi' : 'User Management'}
          </h1>
          <button 
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            ← {currentLang === 'tr' ? 'Admin Paneline Dön' : 'Back to Admin Panel'}
          </button>
        </div>

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
                    <select
                      value={roleEdits[user.id] ?? user.role}
                      onChange={(e) => handleRoleDropdownChange(user.id, e.target.value as UserRole)}
                      disabled={user.role === 'superadmin'}
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {roleLabels[role][currentLang]}
                        </option>
                      ))}
                    </select>
                    {roleEdits[user.id] && roleEdits[user.id] !== user.role && (
                      <button
                        className="btn btn-primary"
                        style={{ marginLeft: 8 }}
                        onClick={() => handleRoleUpdate(user.id)}
                        disabled={updatingRole === user.id}
                      >
                        {updatingRole === user.id
                          ? currentLang === 'tr' ? 'Kaydediliyor...' : 'Saving...'
                          : currentLang === 'tr' ? 'Kaydet' : 'Save'}
                      </button>
                    )}
                  </td>
                  <td>
                    {user.role !== 'superadmin' && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteConfirm({ id: user.id, name: user.name })}
                        disabled={deleting}
                      >
                        {currentLang === 'tr' ? 'Sil' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              {currentLang === 'tr'
                ? `Kullanıcıyı silmek istediğinize emin misiniz? (${deleteConfirm.name})`
                : `Are you sure you want to delete this user? (${deleteConfirm.name})`}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                {currentLang === 'tr' ? 'Vazgeç' : 'Cancel'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDeleteUser(deleteConfirm.id)}
                disabled={deleting}
              >
                {deleting
                  ? currentLang === 'tr' ? 'Siliniyor...' : 'Deleting...'
                  : currentLang === 'tr' ? 'Evet, Sil' : 'Yes, Delete'}
              </button>
            </div>
          </div>
          <style>{`
            .modal-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal {
              background: #fff;
              border-radius: 8px;
              padding: 2rem;
              box-shadow: 0 8px 32px rgba(0,0,0,0.15);
              min-width: 320px;
              max-width: 90vw;
            }
          `}</style>
        </div>
      )}

      <style>{`
        .admin-users {
          padding: 2rem;
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