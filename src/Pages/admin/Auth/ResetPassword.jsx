import React, { useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
// import axios from 'axios'
import axiosInstance from '../../../utils/axiosInstance'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();

    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(password!=confirmPassword){
            toast.error('Password Do not match');
            return;
        }
        try{
            const res = await axiosInstance.post('/api/auth/reset-password',{token,password});
            toast.success(res.data.message);
            setTimeout(()=>navigate('/login'),2000); // redirect after 2 seconds
        }catch(err){
            toast.error('Reset Failed. Token may be expired');
        }   
    }

    return (
        <div className="flex items-center justify-center min-h-screen mx-auto p4-10 bg-gray-100">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 space-y-4 bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-2xl font-bold text-center">Reset Password</h2>
                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}

export default ResetPassword