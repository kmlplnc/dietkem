import { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export function ClientList({
  clients,
  isLoading,
  selectedClient,
  onSelectClient,
}: ClientListProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No clients found. Add your first client to get started.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {clients.map((client) => (
        <button
          key={client.id}
          onClick={() => onSelectClient(client)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedClient?.id === client.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-500">
                Weight: {client.weight} kg
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Last update: {new Date(client.lastUpdate).toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
} 