import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGoogle, FaPhone } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/UserSlice";
interface Props {
  userType: 'customer' | 'provider' | 'staff' | 'admin' | 'worker';
  redirectPath?: string; 
}

const RedirectPaths: Record<string, string> = {
  admin: '/admin/dashboard',
  customer: '/home',
  staff: '/provider/dashboard',
  provider: '/provider/dashboard',
  worker: '/provider/dashboard',
};

const GoogleLoginButton: React.FC<Props> = ({ userType }) => {
  const navigate = useNavigate();
     const dispatch = useDispatch(); 
  
  const API = import.meta.env.VITE_API_URL;
  const handleLoginSuccess = async (credentialResponse: any) => {
    try { 
          toast.dismiss();
      // const { credential } = credentialResponse;
      // const decoded: any = jwtDecode(credential); 
      const { credential } = credentialResponse;
      const response = await axios.post(
        `${API}/api/google`,
      
        {
          token: credential,
          userType,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { accessToken, user } = response.data;

        localStorage.setItem('currentRole', userType);
        localStorage.setItem(`${userType}_accessToken`, accessToken);
        localStorage.setItem(`${userType}_user`, JSON.stringify(user));
        dispatch(setUser(user));
        toast.success('Login successful! Redirecting...', { autoClose: 1000 });
        setTimeout(() => {
         navigate(RedirectPaths[userType]|| '/');
        }, 2000);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err: any) {
      console.log("error here from google lohg")
        console.log("Server message:", err.response?.data?.message);
        const message = err.response?.data?.message || err.message || 'Something went wrong';
        toast.error(message);
    }
  };

  return (
    <>
<div className="mt-4 flex justify-center border border-[#5F60B9] w-[350px] mx-auto p-4 rounded-2xl shadow-md">
<GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => toast.error('Google login failed')}
      />
    </div>

    
    </>
  );
};

export default GoogleLoginButton;
