'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Member {
  id: string;
  email: string;
  name: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  source: 'manual' | 'payment';
}

interface Stats {
  totalMembers: number;
  activeMembers: number;
  pageViews: number;
  uniqueVisitors: number;
  recentVisits: { date: string; count: number }[];
}

const ADMIN_EMAILS = ['admin@maomihanyu.com'];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'stats' | 'members'>('stats');
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add member form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newDays, setNewDays] = useState(30);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  useEffect(() => {
    if (loading) return;

    // Allow access if logged in (in production: check admin role in DB)
    if (!user) {
      router.push('/');
      return;
    }

    loadData();
  }, [user, loading]);

  const loadData = async () => {
    setIsLoading(false);

    // Load from localStorage (prototype) - replace with DB calls
    const storedMembers = JSON.parse(localStorage.getItem('admin_members') || '[]') as Member[];
    setMembers(storedMembers);

    // Load visit stats
    const visits = JSON.parse(localStorage.getItem('admin_visits') || '[]') as { date: string; count: number }[];
    const totalViews = JSON.parse(localStorage.getItem('admin_total_views') || '0') as number;

    setStats({
      totalMembers: storedMembers.length,
      activeMembers: storedMembers.filter((m) => {
        if (!m.active || !m.expires_at) return false;
        return new Date(m.expires_at) > new Date();
      }).length,
      pageViews: totalViews,
      uniqueVisitors: Math.floor(totalViews * 0.7),
      recentVisits: visits.slice(-7),
    });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!newEmail.trim() || !newName.trim()) {
      setAddError('กรุณากรอกอีเมลและชื่อ');
      return;
    }

    const existing = members.find((m) => m.email === newEmail);
    if (existing) {
      setAddError('อีเมลนี้มีอยู่แล้ว');
      return;
    }

    const expiry = new Date(Date.now() + newDays * 24 * 60 * 60 * 1000).toISOString();
    const newMember: Member = {
      id: `manual_${Date.now()}`,
      email: newEmail.trim(),
      name: newName.trim(),
      active: true,
      expires_at: expiry,
      created_at: new Date().toISOString(),
      source: 'manual',
    };

    const updated = [...members, newMember];
    setMembers(updated);
    localStorage.setItem('admin_members', JSON.stringify(updated));

    setNewEmail('');
    setNewName('');
    setNewDays(30);
    setAddSuccess(`เพิ่ม ${newMember.name} สำเร็จแล้ว`);
    loadData();
  };

  const handleToggleMember = (id: string) => {
    const updated = members.map((m) => {
      if (m.id !== id) return m;
      return {
        ...m,
        active: !m.active,
        expires_at: !m.active
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : m.expires_at,
      };
    });
    setMembers(updated);
    localStorage.setItem('admin_members', JSON.stringify(updated));
    loadData();
  };

  const handleExtendMember = (id: string, days: number) => {
    const updated = members.map((m) => {
      if (m.id !== id) return m;
      const currentExpiry = m.expires_at ? new Date(m.expires_at) : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      return {
        ...m,
        active: true,
        expires_at: new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString(),
      };
    });
    setMembers(updated);
    localStorage.setItem('admin_members', JSON.stringify(updated));
    loadData();
  };

  const handleDeleteMember = (id: string) => {
    if (!confirm('ยืนยันลบสมาชิกนี้?')) return;
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    localStorage.setItem('admin_members', JSON.stringify(updated));
    loadData();
  };

  const getDaysLeft = (expiresAt: string | null): number => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-desk flex items-center justify-center">
        <p className="text-ink text-lg">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-desk">
      {/* Admin TopBar */}
      <div className="sticky top-0 z-40 bg-topbar border-b border-black/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 text-ink hover:bg-white/50 rounded-md">
            ←
          </button>
          <h1 className="font-noto-serif-sc text-lg md:text-xl font-bold text-ink">
            ⚙️ หลังบ้าน
          </h1>
        </div>
        <span className="text-xs text-text-muted hidden sm:block">{user?.email}</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-black/10">
          <button
            onClick={() => setTab('stats')}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              tab === 'stats' ? 'bg-paper text-ink border border-b-0 border-black/10' : 'text-text-muted hover:text-ink'
            }`}
          >
            📊 สถิติ
          </button>
          <button
            onClick={() => setTab('members')}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              tab === 'members' ? 'bg-paper text-ink border border-b-0 border-black/10' : 'text-text-muted hover:text-ink'
            }`}
          >
            👥 จัดการสมาชิก
          </button>
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && stats && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="สมาชิกทั้งหมด" value={stats.totalMembers} icon="👥" color="blue" />
              <StatCard label="สมาชิก Active" value={stats.activeMembers} icon="✅" color="green" />
              <StatCard label="ผู้เข้าชม (total)" value={stats.pageViews} icon="👁️" color="yellow" />
              <StatCard label="Unique Visitors" value={stats.uniqueVisitors} icon="🙋" color="purple" />
            </div>

            {/* Recent visits */}
            <div className="paper-surface rounded-lg p-6">
              <h3 className="font-bold text-ink mb-4">การเข้าชม 7 วันล่าสุด</h3>
              {stats.recentVisits.length === 0 ? (
                <p className="text-text-muted text-sm">ยังไม่มีข้อมูล (จะมีข้อมูลหลังผู้ใช้เข้าชม)</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentVisits.map((v) => (
                    <div key={v.date} className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-24">{v.date}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-accent-blue h-full rounded-full"
                          style={{ width: `${Math.min(100, (v.count / Math.max(...stats.recentVisits.map((r) => r.count))) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{v.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Member breakdown */}
            <div className="paper-surface rounded-lg p-6">
              <h3 className="font-bold text-ink mb-4">สรุปสมาชิก</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">เพิ่มด้วยตนเอง (manual)</p>
                  <p className="text-xl font-bold">{members.filter((m) => m.source === 'manual').length} คน</p>
                </div>
                <div>
                  <p className="text-text-muted">ผ่านการชำระเงิน</p>
                  <p className="text-xl font-bold">{members.filter((m) => m.source === 'payment').length} คน</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {tab === 'members' && (
          <div className="space-y-6">
            {/* Add Member Form */}
            <div className="paper-surface rounded-lg p-6">
              <h3 className="font-bold text-ink mb-4">เพิ่มสมาชิกใหม่</h3>
              {addError && <p className="text-danger-text text-sm mb-3">{addError}</p>}
              {addSuccess && <p className="text-success-text text-sm mb-3">✓ {addSuccess}</p>}
              <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="ชื่อ"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-text-muted rounded-md text-sm"
                />
                <input
                  type="email"
                  placeholder="อีเมล"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-text-muted rounded-md text-sm"
                />
                <select
                  value={newDays}
                  onChange={(e) => setNewDays(Number(e.target.value))}
                  className="px-3 py-2 border border-text-muted rounded-md text-sm"
                >
                  <option value={7}>7 วัน</option>
                  <option value={30}>30 วัน</option>
                  <option value={90}>90 วัน</option>
                  <option value={365}>1 ปี</option>
                  <option value={36500}>ตลอดกาล</option>
                </select>
                <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                  + เพิ่มสมาชิก
                </button>
              </form>
            </div>

            {/* Members Table */}
            <div className="paper-surface rounded-lg overflow-hidden">
              <div className="p-4 border-b border-black/10 flex items-center justify-between">
                <h3 className="font-bold text-ink">รายชื่อสมาชิก ({members.length} คน)</h3>
              </div>

              {members.length === 0 ? (
                <div className="p-8 text-center text-text-muted">
                  ยังไม่มีสมาชิก — เพิ่มด้านบนได้เลย
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-text-muted">
                      <tr>
                        <th className="text-left px-4 py-3">ชื่อ / อีเมล</th>
                        <th className="text-left px-4 py-3 hidden sm:table-cell">วันหมดอายุ</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">แหล่งที่มา</th>
                        <th className="text-center px-4 py-3">สถานะ</th>
                        <th className="text-right px-4 py-3">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => {
                        const daysLeft = getDaysLeft(m.expires_at);
                        const isActive = m.active && daysLeft > 0;
                        return (
                          <tr key={m.id} className="border-t border-black/5 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium">{m.name}</p>
                              <p className="text-text-muted text-xs">{m.email}</p>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              {m.expires_at ? (
                                <span className={daysLeft < 7 ? 'text-danger-text' : ''}>
                                  {daysLeft > 0 ? `เหลือ ${daysLeft} วัน` : 'หมดอายุแล้ว'}
                                </span>
                              ) : (
                                <span className="text-text-muted">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                m.source === 'manual'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {m.source === 'manual' ? 'Manual' : 'Payment'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleMember(m.id)}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isActive
                                    ? 'bg-success-bg text-success-text border border-success-border'
                                    : 'bg-gray-100 text-text-muted border border-gray-200'
                                }`}
                              >
                                {isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleExtendMember(m.id, 30)}
                                  className="px-2 py-1 rounded text-xs bg-gold-bg text-gold-text border border-gold-border hover:bg-gold-bg-2"
                                  title="+30 วัน"
                                >
                                  +30ว
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(m.id)}
                                  className="px-2 py-1 rounded text-xs text-danger-text hover:bg-red-50"
                                >
                                  ลบ
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-success-bg border-success-border',
    yellow: 'bg-gold-bg border-gold-border',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`rounded-lg p-4 border ${colors[color]}`}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-2xl font-bold text-ink">{value.toLocaleString()}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
    </div>
  );
}
