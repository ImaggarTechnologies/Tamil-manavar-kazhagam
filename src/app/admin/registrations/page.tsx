import { useEffect, useState } from 'react';
import { tamilNaduDistricts } from '../../../constants/districts';

type Registration = {
  _id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  collegeName: string;
  department: string;
  district: string;
  year: string;
  createdAt: string;
};

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [selected, setSelected] = useState<Registration | null>(null);

  const loadData = () => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (district) params.set('district', district);
    if (college) params.set('college', college);
    if (department) params.set('department', department);

    fetch(`/api/admin/registrations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportCsv = async () => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams({ export: 'csv' });
    if (search) params.set('search', search);
    if (district) params.set('district', district);
    if (college) params.set('college', college);
    if (department) params.set('department', department);

    const response = await fetch(`/api/admin/registrations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registrations.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="card grid gap-4 p-6 md:grid-cols-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="input-field" />
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field">
          <option value="">All Districts</option>
          {tamilNaduDistricts.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College" className="input-field" />
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" className="input-field" />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={loadData} className="btn-primary">Apply Filters</button>
        <button type="button" onClick={exportCsv} className="btn-outline">Export CSV</button>
      </div>

      <div className="card overflow-x-auto p-6">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Mobile</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">College</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-primary/5">
                <td className="px-3 py-3">{item.fullName}</td>
                <td className="px-3 py-3">{item.mobileNumber}</td>
                <td className="px-3 py-3">{item.email}</td>
                <td className="px-3 py-3">{item.collegeName}</td>
                <td className="px-3 py-3">{item.district}</td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => setSelected(item)} className="text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Registration Details</h2>
            <button type="button" onClick={() => setSelected(null)} className="text-sm text-primary">Close</button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-surface p-4 text-xs dark:bg-dark">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
