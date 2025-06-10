
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect ,useMemo,useState} from 'react';
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from './routes/AdminRoutes'
import ProviderRoutes from './routes/ProviderRoutes'
import { useDispatch } from 'react-redux';
import { setUser } from './redux/UserSlice';
import { setProviderUser } from './redux/ProviderSlice';
import { setAdminUser } from './redux/AdminSlice';
import axiosClient from "./api/axiosClient";
import customerAxiosClient from "./api/customerAxiosClient";
import { useSelector } from 'react-redux';
import { RootState } from "./redux/Store";
import {
  getCurrentUserRole,getAccessTokenByUserRole
} from "./utils/RoleHelper";
 enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  STAFF = "staff",
  PROVIDER = "provider",
  WORKER = "worker",
}
function App() {
  const user = useSelector((state: RootState) => state.user.user);  
const adminUser = useSelector((state: RootState) => state.admin.user); // example for admin
const providerUser = useSelector((state: RootState) => state.provider.user); // example for provider
const [userType, setUserType] = useState<UserRole>(getCurrentUserRole());

useEffect(() => {
  const shouldFetch =
    (userType === "customer" && !user) ||
    (userType === "admin" && !adminUser) ||
    (userType === "provider" && !providerUser);
const isLogedin = getAccessTokenByUserRole(userType)
  if (shouldFetch&&isLogedin) {
   fetchUserData();
  }
}, [userType, user, adminUser, providerUser]);
  const dispatch = useDispatch();
console.log(providerUser,"provider user")
const fetchUserData = async () => {
    try {
      let res =null
      if((userType === "provider"&&providerUser!==null)||(userType ==="admin"&&adminUser==null)) {
         res = await axiosClient.get('/api/fetchUserData', {
        headers: { 
          // "Content-Type": "application/json", 
          userRole: userType },
      });
    }else if(userType === "customer"&&user!==null) {
console.log(" it is fetching ciustomer login data")
         res = await customerAxiosClient.get('/api/fetchUserData');
    }
      // console.log(res)
     if (res?.data) {
      if(userType === "provider"){
      dispatch(setProviderUser(res.data.user.user));

      }else if(userType === "admin"){
        dispatch(setAdminUser(res.data.user.user));     

      }else if(userType === "customer"){
         dispatch(setUser(res.data.user.user));

      }
    }
    } catch (err) {
      console.error('Error fetching user data', err);
    }
  };
  return (
    <>
    
    <Router>
      <Routes>
        {/* <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} /> */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/provider/*" element={<ProviderRoutes />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
