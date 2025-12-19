import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  projectService, 
  clientService, 
  contactService, 
  newsletterService,
  authService 
} from '../services/api';
import { toast } from 'react-toastify';

// Import Sub-Components (We will define these below)
import ProjectManager from '../components/dashboard/ProjectManager';
import ClientManager from '../components/dashboard/ClientManager';
import ContactViewer from '../components/dashboard/ContactViewer';
import NewsletterViewer from '../components/dashboard/NewsletterViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ projects: 0, clients: 0, contacts: 0, subscribers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setUser(authService.getCurrentUser());
    fetchStats();
  }, [navigate, activeTab]); // Refresh stats when tab changes

  const fetchStats = async () => {
    try {
      const [proj, cli, con, sub] = await Promise.all([
        projectService.getAll(),
        clientService.getAll(),
        contactService.getAll(),
        newsletterService.getAll()
      ]);
      setStats({
        projects: proj.data.length || proj.data.results?.length || 0,
        clients: cli.data.length || cli.data.results?.length || 0,
        contacts: con.data.length || con.data.results?.length || 0,
        subscribers: sub.data.length || sub.data.results?.length || 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hello, {user?.username}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <div className="p-4 space-y-2">
            <SidebarItem label="Dashboard" id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon="📊" />
            <SidebarItem label="Projects" id="projects" activeTab={activeTab} setActiveTab={setActiveTab} icon="💼" />
            <SidebarItem label="Clients" id="clients" activeTab={activeTab} setActiveTab={setActiveTab} icon="🤝" />
            <SidebarItem label="Messages" id="contacts" activeTab={activeTab} setActiveTab={setActiveTab} icon="✉️" />
            <SidebarItem label="Subscribers" id="newsletter" activeTab={activeTab} setActiveTab={setActiveTab} icon="📰" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardHome stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'clients' && <ClientManager />}
          {activeTab === 'contacts' && <ContactViewer />}
          {activeTab === 'newsletter' && <NewsletterViewer />}
        </main>
      </div>
    </div>
  );
};

// Helper Components
const SidebarItem = ({ label, id, activeTab, setActiveTab, icon }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      activeTab === id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const DashboardHome = ({ stats, setActiveTab }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard title="Total Projects" count={stats.projects} color="blue" onClick={() => setActiveTab('projects')} />
    <StatCard title="Total Clients" count={stats.clients} color="green" onClick={() => setActiveTab('clients')} />
    <StatCard title="Messages" count={stats.contacts} color="purple" onClick={() => setActiveTab('contacts')} />
    <StatCard title="Subscribers" count={stats.subscribers} color="yellow" onClick={() => setActiveTab('newsletter')} />
  </div>
);

const StatCard = ({ title, count, color, onClick }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
      <div className={`inline-block p-3 rounded-lg ${colors[color]} mb-4`}>
        <span className="text-xl font-bold">{count}</span>
      </div>
      <h3 className="text-gray-500 font-medium">{title}</h3>
    </div>
  );
};

export default AdminDashboard;