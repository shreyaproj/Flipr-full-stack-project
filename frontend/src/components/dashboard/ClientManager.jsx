import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/api';
import { toast } from 'react-toastify';
import ImageCropperModal from './ImageCropperModal';

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', designation: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    const res = await clientService.getAll();
    setClients(res.data.results || res.data);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTempImage(URL.createObjectURL(e.target.files[0]));
      setCropperOpen(true);
    }
  };

  const handleCropComplete = (blob) => {
    setSelectedFile(blob);
    setCropperOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Client image required");

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('designation', formData.designation);
    data.append('image', selectedFile, 'client.jpg');

    setLoading(true);
    try {
      await clientService.create(data);
      toast.success("Client Added");
      setFormData({ name: '', description: '', designation: '' });
      setSelectedFile(null);
      loadClients();
    } catch (err) {
      toast.error("Failed to add client");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete client?")) {
      await clientService.delete(id);
      loadClients();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Clients</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Client Name" className="border p-2 rounded"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="text" placeholder="Designation (e.g., CEO)" className="border p-2 rounded"
              value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
          </div>
          <textarea placeholder="Client Description / Testimonial" className="border p-2 rounded w-full" rows="2"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div>
             <label className="block text-sm font-medium mb-1">Client Photo</label>
             <input type="file" accept="image/*" onChange={handleFileSelect} />
             {selectedFile && <span className="text-green-600 text-sm ml-2">Image ready</span>}
          </div>
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Client'}
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {clients.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow text-center relative group">
            <img src={c.image || c.logo} alt={c.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-3" />
            <h3 className="font-bold">{c.name}</h3>
            <p className="text-blue-600 text-sm">{c.designation}</p>
            <p className="text-gray-500 text-xs mt-2">{c.description}</p>
            <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm mt-3 hover:underline">Delete</button>
          </div>
        ))}
      </div>
      {cropperOpen && <ImageCropperModal imageSrc={tempImage} onCancel={() => setCropperOpen(false)} onCropComplete={handleCropComplete} />}
    </div>
  );
};

export default ClientManager;