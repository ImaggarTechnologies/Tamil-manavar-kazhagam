import { useEffect, useState } from 'react';

type EventItem = {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: string;
};

const emptyForm = { title: '', date: '', location: '', description: '', status: 'upcoming' };

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/events', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const createEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    loadData();
  };

  const deleteEvent = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/admin/events?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={createEvent} className="card grid gap-4 p-6 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input-field" required />
        <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Date" className="input-field" required />
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="input-field" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-field md:col-span-2" rows={3} />
        <button type="submit" className="btn-primary md:col-span-2">Add Event</button>
      </form>

      <div className="card space-y-4 p-6">
        {items.map((item) => (
          <div key={item._id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-primary/10 p-4">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.date} · {item.location}</p>
              <p className="mt-2 text-sm">{item.description}</p>
            </div>
            <button type="button" onClick={() => deleteEvent(item._id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
