import { useState, useEffect } from 'react';

const API_BASE = "http://16.176.160.92:30008";

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/contacts`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_BASE}/contacts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ name: '', email: '', phone: '', address: '' });
    fetchContacts();
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address
    });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
    fetchContacts();
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Contact Management System (Three-Tier App)</h2>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
        <h3>{editingId ? "Edit Contact" : "Add New Contact"}</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
          <input required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
          <input required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {editingId ? "Update Contact" : "Save Contact"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '', address: '' }); }} style={{ marginLeft: '10px', padding: '10px 15px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Contact Records</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <button onClick={() => handleEdit(c)} style={{ marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No contact records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
