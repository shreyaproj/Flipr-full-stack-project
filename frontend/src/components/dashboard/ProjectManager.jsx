import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/api';
import { toast } from 'react-toastify';
import ImageCropperModal from './ImageCropperModal';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    const res = await projectService.getAll();
    setProjects(res.data.results || res.data);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTempImage(URL.createObjectURL(file));
      setCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    setSelectedFile(croppedBlob); // Store the blob to send to backend
    setCropperOpen(false);
  };

  // Inside ProjectManager.jsx

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return toast.error("Image is required");

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        
        // FIX: Send empty string '' if link is missing, otherwise Django rejects it
        data.append('link', formData.link ? formData.link : ''); 
        
        // Ensure the 3rd argument (filename) is present
        data.append('image', selectedFile, 'project_image.jpg');

        setLoading(true);
        try {
            await projectService.create(data);
            toast.success("Project Added Successfully");
            setFormData({ title: '', description: '', link: '' });
            setSelectedFile(null);
            loadProjects();
        } catch (err) {
            console.error(err);
            // This will print the EXACT reason for the 400 error in your console
            if (err.response && err.response.data) {
                console.log("SERVER ERROR:", err.response.data);
                toast.error("Error: " + JSON.stringify(err.response.data));
            } else {
                toast.error("Failed to add project");
            }
        } finally {
            setLoading(false);
        }
    };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await projectService.delete(id);
      loadProjects();
      toast.success("Project deleted");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>
      
      {/* Add Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Project Name" className="border p-2 rounded" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input type="url" placeholder="Project Link (Optional)" className="border p-2 rounded" 
              value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          </div>
          <textarea placeholder="Description" className="border p-2 rounded w-full" rows="3"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          
          <div>
            <label className="block text-sm font-medium mb-1">Project Image (Will be cropped)</label>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {selectedFile && <p className="text-green-600 text-sm mt-1">Image cropped and ready to upload.</p>}
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Project'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded shadow overflow-hidden relative group">
            <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600 truncate">{p.description}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
              🗑️
            </button>
          </div>
        ))}
      </div>

      {cropperOpen && (
        <ImageCropperModal 
          imageSrc={tempImage} 
          onCancel={() => setCropperOpen(false)} 
          onCropComplete={handleCropComplete} 
        />
      )}
    </div>
  );
};

export default ProjectManager;