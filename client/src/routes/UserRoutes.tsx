// import React from 'react'
import Login from "../components/Login/Login";
import OtpLogin from "../components/otp/OtpLogin";
import ForgotPassword from "../components/forgotPassword/ForgotPassword";
import Home from "../customer/pages/home/Home";

import Services from "../admin/pages/serviceManagement/Services";
import CustomerRegister from "../components/customerRegister/CustomerRegister";
import ResetPassword from "../components/resetPassword/ResetPassword"

import {  Routes, Route } from "react-router-dom";
import serviceImage from "../assets/images/customerLogin.jpg";
import { UserRole } from "../components/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AllServices from "../customer/pages/allservices/AllServices";
import SubServices from "../customer/pages/subServices/SubServices"
import ProviderDetails from "../customer/pages/providerDetails/ProviderDetails";
import Checkout from "../customer/pages/checkout/Checkout";
import PaymentSuccess from "../customer/pages/payment/PaymentSuccess";
import PaymentCancel from "../customer/pages/payment/PaymentCancel";
const UserRoutes = () => {
  return (
    <div>
        <Routes>
          <Route
            path="/register"
            element={<CustomerRegister imageSrc={serviceImage} />}
          />
          <Route
            path="/"
            element={
              <Login
                imageSrc={serviceImage}
                showGoogleAuth={true}
                showOtpLogin={true}
                haveOrNotAccount={true}
                reqUrl={'/api/login'}
                redirectPath = {`/home`}
                userType={UserRole.CUSTOMER}    
                      
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
          

          <Route path="/forgotPassword" element={<ForgotPassword redirectPath={"/"}  userType={UserRole.CUSTOMER}  />} />
          <Route path="/resetPassword/:id" element={<ResetPassword />} />

          <Route path="/home" element={<Home />} />
          <Route path="/allservices" element={<AllServices />} />
          {/* <Route path="/subServices" element={<SubServices />} /> */}

          
          <Route path="/subServices" element={<SubServices />} />
           <Route path="/providerDetails" element={<ProviderDetails />} />
           <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          


          
        </Routes>
    </div>
  );
};

export default UserRoutes;
