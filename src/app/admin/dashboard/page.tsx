import { useEffect, useState } from 'react';

type DashboardData = {
  total: number;
  todayCount: number;
  districtStats: { _id: string; count: number }[];
  collegeStats: { _id: string; count: number }[];
  recent: { _id: string; fullName: string; collegeName: string; district: string; createdAt: string }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load dashboard');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-400">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-6"><p className="text-sm text-gray-400">Total Registrations</p><p className="mt-2 text-3xl font-semibold text-primary">{data.total}</p></div>
        <div className="card p-6"><p className="text-sm text-gray-400">Today&apos;s Registrations</p><p className="mt-2 text-3xl font-semibold text-primary">{data.todayCount}</p></div>
        <div className="card p-6"><p className="text-sm text-gray-400">Districts Covered</p><p className="mt-2 text-3xl font-semibold text-primary">{data.districtStats.length}</p></div>
        <div className="card p-6"><p className="text-sm text-gray-400">Colleges</p><p className="mt-2 text-3xl font-semibold text-primary">{data.collegeStats.length}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">District-wise Students</h2>
          <div className="mt-4 space-y-2">
            {data.districtStats.map((item) => (
              <div key={item._id} className="flex justify-between rounded-2xl bg-surface px-4 py-3 dark:bg-dark">
                <span>{item._id || 'Unknown'}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">College-wise Students</h2>
          <div className="mt-4 space-y-2">
            {data.collegeStats.map((item) => (
              <div key={item._id} className="flex justify-between rounded-2xl bg-surface px-4 py-3 dark:bg-dark">
                <span>{item._id || 'Unknown'}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">College</th>
                <th className="px-3 py-2">District</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((item) => (
                <tr key={item._id} className="border-b border-primary/5">
                  <td className="px-3 py-3">{item.fullName}</td>
                  <td className="px-3 py-3">{item.collegeName}</td>
                  <td className="px-3 py-3">{item.district}</td>
                  <td className="px-3 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
