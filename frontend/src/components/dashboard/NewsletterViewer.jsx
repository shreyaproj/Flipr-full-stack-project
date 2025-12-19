import React, { useState, useEffect } from 'react';
import { newsletterService } from '../../services/api';

const NewsletterViewer = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    newsletterService.getAll().then(res => setSubscribers(res.data.results || res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Subscribed Users</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-3xl">
        <ul className="divide-y divide-gray-200">
          {subscribers.map((sub) => (
            <li key={sub.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{sub.email}</p>
                <p className="text-xs text-gray-500">
                  Subscribed on: {new Date(sub.subscribed_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {sub.is_active ? 'Active' : 'Unsubscribed'}
              </span>
            </li>
          ))}
          {subscribers.length === 0 && <li className="px-6 py-4 text-gray-500">No subscribers yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default NewsletterViewer;