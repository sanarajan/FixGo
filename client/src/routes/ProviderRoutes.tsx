import React from "react";
import Login from "../components/Login/Login";
import { Routes, Route } from "react-router-dom";
import ProviderRegister from "../components/providerRegister/ProviderRegister";
import OtpLogin from "../components/otp/OtpLogin";
import ForgotPassword from "../components/forgotPassword/ForgotPassword";
import ResetPassword from "../components/resetPassword/ResetPassword";
import AdminUserList from "../components/adminUserList/AdminUserList";
import Services from "../admin/pages/serviceManagement/Services";
import ProviderDashboard from "../providers/pages/dashboard/ProviderDashboard";
import serviceImage from "../assets/images/customerLogin.jpg";
import { UserRole } from "../components/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import CustomersList from "../providers/pages/CustomersList";
import StaffsList from "../providers/pages/staffs/StaffsList";

import ProviderServices from "../providers/pages/providerServices/ProviderServices";
import AddStaff from "../providers/pages/staffs/AddStaff";
import EditStaff from "../providers/pages/staffs/EditStaff";
import ProfilePage from "../providers/pages/profile/ProfilePage"
import Bookings from "../providers/pages/bookings/Bookings";

const ProviderRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/register"
          element={<ProviderRegister imageSrc={serviceImage} />}
        />
        <Route
          path="/"
          element={
            <Login
              imageSrc={serviceImage}
              showGoogleAuth={true}
              showOtpLogin={true}
              haveOrNotAccount={true}
              reqUrl={"/api/login"}
              redirectPath={`/provider/dashboard`}
              userType={UserRole.PROVIDER}
            />
          }
        />
        <Route
          path="/otp"
          element={
            <OtpLogin
              title="OTP Verification"
              onSend={(otp) => console.log("OTP sent:", otp)}
              onResend={() => console.log("Resend triggered")}
            />
          }
        />
        <Route
          path="/register/otp"
          element={
            <OtpLogin
              title="OTP Verification"
              onSend={(otp) => console.log("OTP sent:", otp)}
              onResend={() => console.log("Resend triggered")}
            />
          }
        />
        <Route
          path="/forgotPassword"
          element={
            <ForgotPassword
              redirectPath={"/provider"}
              userType={UserRole.PROVIDER}
            />
          }
        />
        <Route path="/resetPassword/:id" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route
          path="/customers"
          element={<CustomersList userType={"provider"} />}
        />
        
        <Route
          path="/staffs"
          element={<StaffsList userType={"provider"} />}
        />
          <Route
          path="/addStaff"
          element={<AddStaff userType={"provider"} />}
        />
         <Route
          path="/editStaff"
          element={<EditStaff userType={"provider"} />}
        />
        
        <Route
          path="/services"
          element={<ProviderServices userType={"provider"} />}
        />
          <Route
          path="/profile"
          element={<ProfilePage userType={"provider"} />}
        />
         <Route
          path="/bookings"
          element={<Bookings userType={"provider"} />}
        />
      </Routes>
     
      
    </div>
  );
};

export default ProviderRoutes;
