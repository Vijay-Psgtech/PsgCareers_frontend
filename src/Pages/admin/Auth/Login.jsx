import React,{ useState } from 'react'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance'
import logo from '../../../assets/images/logo.png'
import image1 from '../../../assets/images/image1.jpg'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';


const Login = () => {
    const [form,setForm] = useState({email:"",password:""});
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword,setShowPassword] = useState(false);

    const resetFields = () =>{
        setForm({email:"", password:""});
    }

    const handleChange = e =>{
        setForm({...form,[e.target.name]:e.target.value});
    }

     const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const res = await axiosInstance.post('/api/auth/login',form);
            if(res.data.token){
                login(res.data.token,res.data.role,res.data.name,res.data.userId,res.data.jobCategory);
                if(res.data.role ==='user'){
                    navigate('/dashboard');
                }else{
                    navigate('/admin/dashboard');
                }
            } else {
                toast.error(res.data.message || 'Login failed');
            }
        
        }catch(err){
            const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMsg);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12">
                    <div className="text-center p-8">
                        <img src={logo  } alt="PSG Logo" className="mx-auto w-16 h-16 mb-2" />
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">PSG Careers</h2>
                        <p className="text-lg font-bold py-2 md:text-base text-gray-600">Start your career on the right Path</p>
                    </div>
                    <div className="mt-2 flex flex-col items-center">
                        <div className="w-full flex-1 mt-4">
                            <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                                <input 
                                    name="email"
                                    placeholder='Email'
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-8 py-4 rounded-md font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-md focus:outline-none focus:border-gray-400 focus:bg-white"
                                />
                                <div className="relative">
                                    <input 
                                        name="password" 
                                        value={form.password}
                                        type={showPassword? "text" :"password"} 
                                        placeholder='password' 
                                        onChange={handleChange} 
                                        className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-md focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                                    /> 
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 mt-2"
                                        >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </button> 
                                </div>
                                <p className="text-sm text-end mt-2">
                                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                        Forgot Password?
                                    </Link>
                                </p>
                                <div className="mt-5 flex justify-between gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 tracking-wide font-semibold bg-blue-700 text-white py-3 rounded-md hover:bg-blue-900 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
                                    >
                                        Login
                                    </button>
                                     <button
                                        type="button"
                                        onClick={resetFields} // or your cancel logic
                                        className="flex-1 tracking-wide font-semibold bg-gray-300 text-black py-3 rounded-md hover:bg-gray-400 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                
                               
                            </form>
                        </div>
                         <div className="my-12 border-b text-center">
                            <div
                                className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                No account ? <a href="/register" className='text-blue-700 text-lg font-semibold hover:underline'>Create One</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1 bg-blue-50 hidden lg:flex'>
                    <div className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url(${image1})`}}>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login