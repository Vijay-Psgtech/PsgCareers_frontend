import React,{ useState } from 'react'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import logo from '../../../assets/images/logo.png'

const Register = () => {
    const [form,setForm] = useState({first_name:'', last_name:'', mobile:'', email:'', jobCategory:''});
    const [errors,setErrors] = useState({});
    const initialForm = {
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        jobCategory: "",
    };
    const [open, setOpen] = useState(false);
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
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-4xl">
                <div className="text-center mb-8">
                    <img src={logo} alt="PSG Logo" className="mx-auto w-16 h-16 mb-2" />
                    <h2 className="text-3xl font-bold text-blue-900">PSG Careers</h2>
                    <p className="text-gray-600 text-sm md:text-base mt-2">Start your career on the right Path</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleNameChange}
                                placeholder="First Name"
                                title="Only alphabets and spaces are allowed"
                                className={`w-full p-3 rounded bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleNameChange}
                                placeholder="Last Name"
                                title="Only alphabets and spaces are allowed"
                                className={`w-full p-3 rounded bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-1">Mobile</label>
                            <input
                                type="number"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                maxLength={10}
                                className={`w-full p-3 rounded bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-800 font-semibold mb-1">User Name [Email ID]</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="User Name (EMAIL ID)"
                                className={`w-full p-3 rounded bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

                    {/* Job Category */}
                    <div>
                        <label className="block text-gray-800 font-semibold mb-2">Job Category</label>
                        <div className="flex items-center gap-10">
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                name="jobCategory"
                                value="Teaching"
                                checked={form.jobCategory === "Teaching"}
                                onChange={handleChange}
                                className="form-radio text-blue-600"
                                />
                                <span className="ml-2">Teaching</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                name="jobCategory"
                                value="Non Teaching"
                                checked={form.jobCategory === "Non Teaching"}
                                onChange={handleChange}
                                className="form-radio text-blue-600"
                                />
                                <span className="ml-2">Non Teaching</span>
                            </label>
                        </div>
                    </div>

                    {/* Terms & Privacy Checkbox */}
                    <div className="flex items-start gap-3">
                        <input type="checkbox" id="terms" required className="mt-1" />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            I agree to abide by PSG Institutions’{" "}
                            <button type="button" onClick={() => setOpen(true)} className="text-xs text-blue-600 underline">Terms & Privacy</button>
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col md:flex-row justify-center gap-6 pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-blue-700 hover:bg-blue-900 text-white py-3 px-8 rounded font-semibold transition duration-300"
                        >
                            Send Verification Link
                        </button>
                        <button
                            type="button"
                            onClick={ResetFields}
                            className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-black py-3 px-8 rounded font-semibold transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Login Redirect */}
                    <div className="text-center pt-6">
                        <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-700 text-lg font-semibold hover:underline">Login here</a>
                        </p>
                    </div>
                </form>
            </div>
            {open && (
            <div className="fixed inset-0 z-50 flex">
                <div className="w-80 bg-white p-6 shadow-lg w-full max-w-xl h-full overflow-y-auto">
                    <div className="flex justify-between items-center py-6">
                        <h2 className="text-xl font-semibold">Terms of Service</h2>
                        <button onClick={()=>setOpen(false)} className="text-gray-500 text-xl">&times;</button>
                    </div>
                    <p className="mb-4">
                        By accessing or using our platform, you agree to be bound by these Terms of Service.
                        If you disagree with any part, you may not access the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
                    <p className="mb-4">
                        You agree to use the service only for lawful purposes. You must not misuse or interfere
                        with the service or try to access it using a method other than the interface provided.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
                    <p className="mb-4">
                        You are responsible for maintaining the confidentiality of your account and password.
                        You agree to accept responsibility for all activities that occur under your account.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">3. Modifications</h2>
                    <p className="mb-4">
                        We reserve the right to modify or discontinue the service with or without notice.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact</h2>
                    <p className="mb-6 border-b">
                        If you have any questions about these Terms, please contact us at
                        <a href="mailto:careers@psginstitutions.in" className="text-blue-600 underline"> careers@psginstitutions.in</a>.
                    </p>

                    <h2 className="text-xl font-semibold mb-6">Privacy Policy</h2>
                    <p className="mb-4">
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, and
                        protect your information.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
                    <p className="mb-4">
                        We may collect personal information such as your name, email address, mobile number,
                        and usage data when you use our platform.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
                    <p className="mb-4">
                        We use your information to provide and improve our services, contact you, and enforce
                        our policies.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
                    <p className="mb-4">
                        We take appropriate security measures to protect your information from unauthorized access.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Services</h2>
                    <p className="mb-4">
                        We do not share your personal data with third parties except as required by law or to
                        provide the services.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h2>
                    <p>
                        If you have questions about this policy, email us at
                        <a href="mailto:privacy@example.com" className="text-blue-600 underline"> privacy@example.com</a>.
                    </p>
                    
                    <button onClick={() => setOpen(false)} className="mt-4 text-sm text-blue-600 underline">Close</button>
                </div>
                <div className="flex-1 bg-black/70 backdrop-blur-sm z-40" onClick={() => setOpen(false)}></div>
            </div>
            )}
        </div>
    )
}

export default Register