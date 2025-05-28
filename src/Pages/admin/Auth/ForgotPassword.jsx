import React, { useState } from 'react'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const res = await axiosInstance.post('/api/auth/forgot-password',{email});
            //const token = res.data.token;
            toast.success(res.data.message);
            //navigate(`/reset-password/${token}`);
        }catch(err){
            toast.error('Failed to send link. Please try again');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen mx-auto p4-10 bg-gray-100">   
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 space-y-4 bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Send Reset Link
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword