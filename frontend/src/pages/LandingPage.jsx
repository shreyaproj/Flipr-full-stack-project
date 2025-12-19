import React, { useState, useEffect } from 'react';
import { projectService, clientService, contactService, newsletterService } from '../services/api';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [contactSending, setContactSending] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    mobile: '', 
    city: '',
    message: '',
  });
  
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = 'http://localhost:8000'; 
    return `${baseUrl}${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          projectService.getAll(),
          clientService.getAll(),
        ]);
        const projectsData = projectsRes.data.results || projectsRes.data;
        const clientsData = clientsRes.data.results || clientsRes.data;
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load portfolio data');
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSending(true);
    try {
      await contactService.create(contactForm);
      toast.success('Quote request sent successfully!');
      setContactForm({ name: '', email: '', mobile: '', city: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Failed to send request.');
    } finally {
      setContactSending(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if(!newsletterEmail) return;
    setNewsletterSending(true);
    try {
      await newsletterService.create({ email: newsletterEmail });
      toast.success('Subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
        if (error.response?.status === 400) toast.info('Already subscribed!');
        else toast.error('Failed to subscribe');
    } finally {
      setNewsletterSending(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header [cite: 73] */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 tracking-tighter">
            <span className="text-orange-500">Flipr</span>Realty
          </div>
          <nav className="hidden md:flex space-x-8 uppercase text-sm font-semibold tracking-wide">
            <a href="#home" className="text-gray-600 hover:text-orange-500 transition">Home</a>
            <a href="#services" className="text-gray-600 hover:text-orange-500 transition">Services</a>
            <a href="#projects" className="text-gray-600 hover:text-orange-500 transition">Projects</a>
            <a href="#clients" className="text-gray-600 hover:text-orange-500 transition">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-orange-500 transition">Contact</a>
          </nav>
          <a href="/admin/login" className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-500 transition">
            ADMIN LOGIN
          </a>
        </div>
      </header>

      {/* Hero Section [cite: 111-112] */}
      <section id="home" className="relative bg-gray-900 py-32">
        <div className="absolute inset-0 overflow-hidden">
             {/* Placeholder for background image to match reference */}
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Building" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Consultation, <br />
            <span className="text-orange-500">Design</span> & Marketing
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto uppercase tracking-widest">
            Not Your Average Realtor [cite: 113]
          </p>
        </div>
      </section>

      {/* Projects Section [cite: 11] */}
      <section id="projects" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">Our Projects [cite: 117]</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group relative">
                <div className="h-64 overflow-hidden bg-gray-200 rounded-lg">
                  {project.image && (
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                   {/* Project Name & Description [cite: 14-15] */}
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{project.description.substring(0, 50)}...</p>
                  
                  {/* Dummy READ MORE Button [cite: 16, 20] */}
                  <button className="text-orange-500 font-bold text-sm tracking-wider border-b-2 border-transparent hover:border-orange-500 transition">
                    READ MORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section [cite: 34] */}
      <section id="clients" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">Happy Clients [cite: 118]</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clients.map((client) => (
              <div key={client.id} className="bg-white p-6 rounded shadow-sm text-center">
                <div className="flex justify-center -mt-12 mb-4">
                   {/* Client Image [cite: 36] */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src={getImageUrl(client.image || client.logo)}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Client Description [cite: 37] */}
                <p className="text-gray-500 text-sm italic mb-4">"{client.description}"</p>
                {/* Name & Designation [cite: 38-39] */}
                <h3 className="text-blue-900 font-bold">{client.name}</h3>
                <p className="text-orange-500 text-xs font-bold uppercase">{client.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Styled as "Get a Free Consultation" [cite: 63] */}
      <section id="contact" className="py-20 bg-blue-900">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="bg-blue-800 p-8 rounded-lg shadow-2xl max-w-lg w-full border border-blue-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Get a Free [cite: 63]</h2>
              <h2 className="text-3xl font-bold text-white">Consultation [cite: 64]</h2>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Full Name [cite: 65] */}
              <input
                type="text"
                placeholder="Full Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full p-3 rounded bg-blue-900/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500"
                required
              />
              {/* Email [cite: 66] */}
              <input
                type="email"
                placeholder="Enter Email Address"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full p-3 rounded bg-blue-900/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500"
                required
              />
              {/* Mobile [cite: 67] */}
              <input
                type="tel"
                placeholder="Mobile Number"
                value={contactForm.mobile}
                onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
                className="w-full p-3 rounded bg-blue-900/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500"
                required
              />
              {/* City [cite: 68] */}
              <input
                type="text"
                placeholder="Area, City"
                value={contactForm.city}
                onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                className="w-full p-3 rounded bg-blue-900/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500"
                required
              />

              {/* Submit Button  */}
              <button
                type="submit"
                disabled={contactSending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded transition duration-300 uppercase shadow-lg mt-4"
              >
                {contactSending ? 'Sending...' : 'Get Quick Quote'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Newsletter Section [cite: 70] */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Subscribe Us [cite: 74]</h2>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md">
            {/* Email Input [cite: 75] */}
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="submit"
              disabled={newsletterSending}
              className="bg-blue-400 text-white font-bold py-2 px-6 rounded-r hover:bg-blue-500 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer  */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-4">
              <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500">f</span>
              <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500">in</span>
              <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500">t</span>
          </div>
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Flipr Task. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;