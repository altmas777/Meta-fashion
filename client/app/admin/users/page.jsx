"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Trash2, Search, Shield, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id, currentRole) => {
    if (!window.confirm(`Are you sure you want to make this user ${currentRole === 'admin' ? 'a user' : 'an admin'}?`)) return;
    
    try {
      await api.put(`/api/users/${id}/role`);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/api/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary mb-8">User Management</h1>

      <div className="mb-6 relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border text-textPrimary py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-textMuted" />
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background/50 border-b border-border text-textMuted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-textPrimary">{user.name}</td>
                  <td className="px-6 py-4 text-textMuted">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface text-textMuted border border-border'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-textMuted">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button 
                        onClick={() => handleToggleRole(user._id, user.role)}
                        title={user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                        className="text-textMuted hover:text-primary transition-colors"
                      >
                        {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="text-textMuted hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
