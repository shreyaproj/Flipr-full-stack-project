import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';

const ContactViewer = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    contactService.getAll().then(res => setMessages(res.data.results || res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Form Responses</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(msg.created_at || msg.submitted_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{msg.email}</div>
                  <div className="text-sm text-gray-500">{msg.phone_number || msg.mobile}</div>
                  <div className="text-sm text-gray-500">{msg.city}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {msg.message}
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactViewer;