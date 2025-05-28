import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

   useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/verify/${token}`);
        const userId = res.data.userId;
        navigate(`/set-password/${userId}`);
      } catch (err) {
        console.error('Verification error:', err.response?.data || err.message);
        toast.error('Verification failed or expired.');
      }
    };

    verify();
  }, [token, navigate]);

  return <div>Verifying your email...</div>;
};

export default VerifyEmailPage;
