import { useEffect, useState } from 'react';

type GalleryItem = {
  _id: string;
  title: string;
  type: string;
  url: string;
  album: string;
};

const emptyForm = { title: '', type: 'photo', url: '', album: '' };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    loadData();
  };

  const deleteItem = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/admin/gallery?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={addItem} className="card grid gap-4 p-6 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="input-field" required />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="album">Album</option>
        </select>
        <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Image/Video URL" className="input-field md:col-span-2" required />
        <input value={form.album} onChange={(e) => setForm({ ...form, album: e.target.value })} placeholder="Album name" className="input-field md:col-span-2" />
        <button type="submit" className="btn-primary md:col-span-2">Upload Item</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="card p-4">
            <div className="mb-3 h-40 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.type} · {item.album || 'General'}</p>
            <button type="button" onClick={() => deleteItem(item._id)} className="mt-3 text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
