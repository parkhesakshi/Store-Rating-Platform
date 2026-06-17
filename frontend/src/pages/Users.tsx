import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddUserModal from '../components/AddUserModal';
import { getErrorMessage } from '../lib/error-handler';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
  rating?: number;
}

const Users: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: users, refetch, isLoading, error } = useQuery<User[]>({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'STORE_OWNER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access denied. Admin only.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{getErrorMessage(error, 'Failed to load users')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {users && users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users?.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:gap-4">
                      <p className="text-sm text-gray-500 truncate">
                        Email: {user.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Address: {user.address}
                      </p>
                      {user.role === 'STORE_OWNER' && user.rating !== undefined && (
                        <p className="text-sm text-gray-500">
                          Rating: {user.rating || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          refetch();
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default Users;