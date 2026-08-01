import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, ShieldAlert, Mail, Calendar } from 'lucide-react';
import { adminService } from '../../services/adminService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        showToast('Failed to load registered users list.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Registered Users (Read Only)</h2>
          <p className="text-slate-400 text-sm">System user directory and account security audit</p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No registered users" description="No users found in database." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-mono text-slate-500">#{u.id}</td>
                    <td className="py-4 px-6 font-bold text-white flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.full_name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {u.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'admin' ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md font-bold uppercase tracking-wider inline-flex items-center gap-1 text-[10px]">
                          <ShieldAlert className="w-3 h-3 text-amber-400" /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md font-bold uppercase tracking-wider inline-flex items-center gap-1 text-[10px]">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Student
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date(u.created_at).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
