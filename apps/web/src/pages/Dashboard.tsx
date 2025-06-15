import { trpc } from '../utils/trpc';
import { ClientProfile } from '../components/dashboard/ClientProfile';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { data: users, isLoading: isLoadingUsers } = trpc.users.list.useQuery();
  const { isLoading: isLoadingMe } = trpc.users.me.useQuery();

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  if (isLoadingUsers || isLoadingMe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
            <p className="text-gray-600">Role: {user.role}</p>
            <p className="text-gray-600">
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ClientProfile />
      </div>
    </div>
  );
}; 