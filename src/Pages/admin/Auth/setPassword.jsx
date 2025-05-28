import { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
// import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';
import logo from '../../../assets/images/logo.png'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';


const SetPasswordPage = () =>{
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [password,setPassword] = useState('');
    const [confirmpassword,setConfirmPassword] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
   
    const resetPasswordFields = () =>{
        setPassword('');
        setConfirmPassword('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Password match validation
        if (password && confirmpassword && password !== confirmpassword) {
            toast.error("Passwords do not match");
            return;
        }
        // Strong password validation
        if (!strongPasswordRegex.test(password)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }
        try{
            const res = await axiosInstance.post(`/api/auth/set-password/${id}`,{password});
            if(res.data.userId){
                toast.success(res.data.message);
                setPassword('');
                setConfirmPassword('');
                setTimeout(()=>{
                    navigate('/login');
                },2000)
            } else {
                toast.error(res.data.message || 'Registration Failed');
            }
        }catch(err){
            const errorMsg = err.response?.data?.message || 'Registration Failed';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-5xl">
                <div className="text-center mb-8">
                    <img src={logo} alt="PSG Logo" className="mx-auto w-12 h-12 mb-2" />
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900">PSG Careers</h2>
                    <p className="text-lg font-bold py-2 md:text-base text-gray-600">Start your career on the right Path</p>
                </div>
                <form onSubmit={handleSubmit} className='mt-12'>
                    <div className="relative flex items-center justify-center gap-4">
                        <label className="w-32 text-right font-semibold text-gray-800">Password</label>
                        <input 
                            type={showPassword? "text" :"password"} 
                            name="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 md:right-50"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button> 
                    </div>

                    <div className="relative flex items-center justify-center gap-4 mt-4">
                        <label className="w-32 text-right font-semibold text-gray-800">Re-enter Password</label>
                        <input 
                            type={showPassword? "text" :"password"} 
                            name="confirm_password" 
                            placeholder="Re-enter password"
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-100 p-4 rounded font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3  top-1/2 transform -translate-y-1/2 text-gray-600 md:right-50"
                            >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
                        <button type="submit"
                        className="w-full md:w-auto bg-blue-700 hover:bg-blue-900 cursor-pointer text-white py-3 px-8 rounded font-semibold transition duration-300">
                           Register
                        </button>
                        <button type="button"
                            className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 cursor-pointer text-black py-3 px-8 rounded font-semibold transition duration-300"
                            onClick={resetPasswordFields}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                
            </div>
        
        </div>
    );
}

export default SetPasswordPage
