'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@sripalie/ui';
import { ShieldAlert, Lock, UserX, AlertTriangle, ShieldCheck, RefreshCw, KeyRound, Ban } from 'lucide-react';
import { IUser, ISecuritySetting } from '@sripalie/types';

export default function SecurityPage() {
  const [securityStatus, setSecurityStatus] = useState<ISecuritySetting | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const [ipToBlacklist, setIpToBlacklist] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const [statusRes, usersRes] = await Promise.all([
        fetch(`${apiUrl}/admin/security/status`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        }),
        fetch(`${apiUrl}/admin/security/users`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        }),
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setSecurityStatus(sData);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData);
      }
    } catch (err) {
      console.error('Error fetching security data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleToggleLockdown = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/admin/security/toggle-lockdown`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({
          text: data.message,
          type: data.isLockdownMode ? 'danger' : 'success',
        });
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Error toggling lockdown');
    }
  };

  const handleRevokeUser = async (userId: string) => {
    if (!confirm('Revoke access and increment token version for this user? Active sessions will terminate immediately.')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/admin/security/revoke-user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ reason: 'Security Revocation by Store Manager' }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ text: data.message, type: 'danger' });
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Error revoking user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/admin/security/unblock-user/${userId}`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ text: data.message, type: 'success' });
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Error unblocking user');
    }
  };

  const handleAddBlacklistIP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipToBlacklist) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/admin/security/blacklist-ip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ ip: ipToBlacklist }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ text: data.message, type: 'success' });
        setIpToBlacklist('');
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Error blacklisting IP');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.phone.includes(searchUser)
  );

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="burgundy" className="mb-2">EMERGENCY THREAT CONTROL</Badge>
        <h1 className="text-3xl font-extrabold text-white">Security Control Center</h1>
        <p className="text-xs text-slate-400 mt-1">Session revocation, IP blacklisting, and Store Lockdown panic switch</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between ${
            message.type === 'danger'
              ? 'bg-red-950/80 border-red-800 text-red-200'
              : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 1. STORE LOCKDOWN PANIC BUTTON */}
      <Card className="bg-slate-900 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Emergency Store Lockdown Panic Switch</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Toggling lockdown mode immediately places the public storefront into maintenance view. Public catalog and ordering APIs will return 503 while Admin console remains active.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={securityStatus?.isLockdownMode ? 'danger' : 'success'} className="py-1 px-3 text-xs">
              {securityStatus?.isLockdownMode ? 'LOCKDOWN ACTIVE' : 'STOREFRONT NORMAL'}
            </Badge>

            <Button
              onClick={handleToggleLockdown}
              className={securityStatus?.isLockdownMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
            >
              <Lock className="w-4 h-4 mr-2" />
              {securityStatus?.isLockdownMode ? 'Deactivate Store Lockdown' : 'TOGGLE STORE PANIC LOCKDOWN'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. USER SESSION REVOCATION TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="User Session Revocation & Access Control" subtitle="Search user and force immediate JWT session token invalidation">
            <div className="mb-4">
              <Input
                placeholder="Search user by name, email, or phone..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-300">
                    <th className="p-3 border-b border-slate-700">User</th>
                    <th className="p-3 border-b border-slate-700">Role</th>
                    <th className="p-3 border-b border-slate-700">Token Version</th>
                    <th className="p-3 border-b border-slate-700">Status</th>
                    <th className="p-3 border-b border-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b border-slate-800 hover:bg-slate-850">
                      <td className="p-3">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email} • {u.phone}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant={u.role === 'admin' ? 'burgundy' : 'slate'}>{u.role}</Badge>
                      </td>
                      <td className="p-3 font-mono font-bold text-rose-400">v{u.tokenVersion || 0}</td>
                      <td className="p-3">
                        <Badge variant={u.isBlocked ? 'danger' : 'success'}>
                          {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'admin' && (
                          u.isBlocked ? (
                            <Button size="sm" variant="outline" onClick={() => handleUnblockUser(u._id)}>
                              Unblock
                            </Button>
                          ) : (
                            <Button size="sm" variant="danger" onClick={() => handleRevokeUser(u._id)}>
                              <UserX className="w-3.5 h-3.5 mr-1" /> Force Logout & Block
                            </Button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 3. IP BLACKLISTING CONTROL */}
        <div className="space-y-4">
          <Card title="IP Blacklist Guard" subtitle="Block malicious client IPs with 403 Forbidden">
            <form onSubmit={handleAddBlacklistIP} className="space-y-4">
              <Input
                label="Add Client IP to Blacklist"
                placeholder="e.g. 192.168.1.100"
                value={ipToBlacklist}
                onChange={(e) => setIpToBlacklist(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-xs">
                <Ban className="w-4 h-4 mr-2" /> Add IP to Blacklist
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-400">Current Blacklisted IPs:</p>
              {securityStatus?.blacklistedIPs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No IPs currently blacklisted.</p>
              ) : (
                <ul className="space-y-1">
                  {securityStatus?.blacklistedIPs.map((ip) => (
                    <li key={ip} className="flex justify-between items-center text-xs font-mono bg-slate-800 p-2 rounded">
                      <span className="text-rose-400 font-bold">{ip}</span>
                      <Badge variant="danger">403 Blocked</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
