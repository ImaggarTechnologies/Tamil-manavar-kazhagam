import { useEffect, useState } from 'react';

type ContactItem = {
  _id: string;
  name: string;
  mobile?: string;
  college?: string;
  message: string;
  resolved: boolean;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactItem[]>([]);

  const loadData = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/contacts', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const markResolved = async (id: string, resolved: boolean) => {
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, resolved }),
    });
    loadData();
  };

  return (
    <div className="card space-y-4 p-6">
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No contact enquiries found.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} className="rounded-2xl border border-primary/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.mobile} · {item.college}</p>
                <p className="mt-2 text-sm">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => markResolved(item._id, !item.resolved)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${item.resolved ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'}`}
              >
                {item.resolved ? 'Resolved' : 'Mark Resolved'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
