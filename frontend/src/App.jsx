import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/guestbook';

function App() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching from:', API_URL);
      
      const res = await fetch(API_URL);
      console.log('📡 Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📦 Received data:', data);
      
      // Ensure data is an array
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching entries:', error.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      alert('Please fill in both fields');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      console.log('📤 Sending request:', { method, url, data: formData });

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to save: ${res.status}`);
      }

      const responseData = await res.json();
      console.log('✅ Success response:', responseData);

      setFormData({ name: '', message: '' });
      setEditingId(null);
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error('❌ Error saving entry:', error.message);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      console.log('🗑️ Deleting entry:', id);
      
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('📥 Delete response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Delete error:', errorText);
        throw new Error('Failed to delete');
      }
      
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting entry:', error.message);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setFormData({ name: entry.name, message: entry.message });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', message: '' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>My Profile & Guestbook</h1>
        <p>Leave a message in my guestbook!</p>
      </header>

      <main>
        <section className="guestbook-form">
          <h2>{editingId ? 'Edit Entry' : 'Sign the Guestbook'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows="4"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Entry' : 'Sign Guestbook'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="guestbook-entries">
          <h2>Guestbook Entries</h2>
          {loading ? (
            <p>Loading entries...</p>
          ) : entries.length === 0 ? (
            <p>No entries yet. Be the first to sign!</p>
          ) : (
            <div className="entries-list">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <strong>{entry.name}</strong>
                    <span className="entry-date">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="entry-message">{entry.message}</p>
                  <div className="entry-actions">
                    <button onClick={() => startEdit(entry)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;