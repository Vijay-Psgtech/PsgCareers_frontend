import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import axios from '../utils/axiosInstance'; 

export default function InstitutionModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/dropDown/addinstitution', { name });
      onSuccess(res.data); 
      onClose();
      setName('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add institution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-md w-full max-w-sm shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-semibold">Add New Institution</Dialog.Title>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Institution Name"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-1 bg-gray-200 rounded">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
