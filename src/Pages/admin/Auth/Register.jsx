import React,{ useState } from 'react'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo.png'

const Register = () => {
    const [form,setForm] = useState({first_name:'', last_name:'', mobile:'', email:''});
    const [errors,setErrors] = useState({});
    const initialForm = {
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
    };
    /*-- Api Calls function s--*/
    const UserRegister = async(form) =>{
        try{
            const res = await axiosInstance.post('/api/auth/register',form);
            toast.success(res.data.message);
            setForm(initialForm);
        }catch(err){
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMsg);
        }
    }
    /*--Events & Functions*/
    const handleNameChange = (e) =>{
        const {name, value} = e.target;
        const alphaOnly = value.replace(/[^a-zA-Z\s]/g, ''); // allows letters and spaces
        setForm((prev) => ({ ...prev, [name]: alphaOnly }));
        setErrors((prev) => ({ ...prev, [name]: false })); // clear error when user types
    }
    const handleChange = (e) =>{
        setForm({...form,[e.target.name]:e.target.value});
        setErrors((prev) => ({ ...prev, [name]: false })); // clear error when user types
    };

    const ResetFields = () =>{
        setForm(initialForm);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        
        //Empty field Validations
        const newErrors = {};
        Object.entries(form).forEach(([key, value]) => {
            if (!value.trim()) {
                newErrors[key] = true;
                toast.error(`${key.replace('_', ' ')} is required`);
            }
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Mobile Number validation
        if (!/^\d{10}$/.test(form.mobile)) {
            setErrors(prev => ({ ...prev, mobile: true }));
            toast.error("Mobile number must be exactly 10 digits");
            return;
        }
       
        UserRegister(form)
        console.log("Form submitted", form);
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-5xl">
                <div className="text-center mb-8">
                    <img src={logo  } alt="PSG Logo" className="mx-auto w-12 h-12 mb-2" />
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900">PSG Careers</h2>
                    <p className="text-lg font-bold py-2 md:text-base text-gray-600">Start your career on the right Path</p>
                </div>

                <form  onSubmit={handleSubmit} className='mt-12'>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                        <div className="flex items-center justify-center gap-12">
                            <label className="w-50 text-right font-semibold text-gray-800">First Name</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                value={form.first_name}
                                placeholder="First Name"
                                onChange={handleNameChange}
                                title="Only alphabets and spaces are allowed"
                                className={`w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                        </div>

                        <div className="flex items-center justify-center gap-12">
                            <label className="w-50 text-right font-semibold text-gray-800">Last Name</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                value={form.last_name}
                                placeholder="Last Name"
                                onChange={handleNameChange}
                                title="Only alphabets and spaces are allowed"
                                className={`w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-12">
                            <label className="w-50 text-right font-semibold text-gray-800">Mobile</label>
                            <input 
                                type="number" 
                                name="mobile" 
                                value={form.mobile}
                                placeholder="Mobile Number"
                                onChange={handleChange}
                                maxLength={10}
                                className={`no-spinner w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                        </div>

                        <div className="flex items-center justify-center gap-12">
                            <label className="w-50 text-right font-semibold text-gray-800">User Name [Email ID]</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email}
                                placeholder="User Name (EMAIL ID)"
                                onChange={handleChange}
                                className={`w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                        </div>

                       
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
                        <button type="submit"
                        className="w-full md:w-auto bg-blue-700 hover:bg-blue-900 cursor-pointer text-white py-3 px-8 rounded font-semibold transition duration-300">
                            Send Verification link
                        </button>
                        <button type="button"
                            className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 cursor-pointer text-black py-3 px-8 rounded font-semibold transition duration-300"
                            onClick={ResetFields}>
                            Cancel
                        </button>
                    </div>
                    <div className='my-8 text-center'>
                        <p className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                            Already have an account? <a href="/" className="text-bold text-lg border-b border-blue-800 hover:text-blue-900">Login here</a>
                        </p>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Register