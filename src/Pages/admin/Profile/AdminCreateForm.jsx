import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Select from 'react-select'
import { useAuth } from '../../../Context/AuthContext';
import { FaPlus } from 'react-icons/fa';
import InstitutionModal from '../../../Components/InstitutionModal';

const AdminCreateForm = () => {
    const {auth} = useAuth();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: ''
    });
    const [institutionOptions, setInstitutionOptions] = useState('');
    const [selectedInstitutions, setSelectedInstitutions] = useState(null);
    const [showInstitutionModal, setShowInstitutionModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(!selectedInstitutions) return toast.error('Select Institution');
        const formData = {
            ...form,
            institution: selectedInstitutions.value,
        };
        try {
            await axiosInstance.post('/api/admin/create-admin', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Admin created & verification email sent');
            setForm({ first_name: '', last_name: '', email: '', mobile: '' });
            setSelectedInstitutions(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstitutions = async() =>{
        try{
            const res = await axiosInstance.get('/api/dropDown/getInstitutions');
            const formattedOptions = res.data.map((inst)=>({
                label: inst.name,
                value: inst.name
            }));
            setInstitutionOptions(formattedOptions);
        } catch(err) {
            console.error("failed to fetch institutions",err);
        }
    }

    const handleInstitutionAdded = async () => {
        fetchInstitutions();
    };

    useEffect(()=>{
        fetchInstitutions();
    },[])

  return auth.role !=='superadmin' ? (  <h2 className="p-4 font-bold text-lg"> Restricted Access</h2> ) : (
    <>
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl px-8 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Create Admin User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                    <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                    <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
             </div>

            {/* Institution Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">Select Institution 
                    <FaPlus
                        onClick={() => setShowInstitutionModal(true)}
                        className="text-blue-600 cursor-pointer hover:scale-110 transition"
                    />
                </label>
                <Select
                    name="institution"
                    options={institutionOptions}
                    value={selectedInstitutions}
                    onChange={setSelectedInstitutions}
                    placeholder="Select Institution"
                    className="min-h-[40px] w-75 font-medium rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400"
                    isClearable
                />
            </div>

            {/* Submit */}
            <div className="text-center">
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Create Admin
            </button>
            </div>
        </form>
    </div>
    <InstitutionModal
        isOpen={showInstitutionModal}
        onClose={() => setShowInstitutionModal(false)}
        onSuccess={handleInstitutionAdded}
    />
    </>
  );
};

export default AdminCreateForm;
