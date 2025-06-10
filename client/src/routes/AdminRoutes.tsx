import React from "react";
import Login from "../components/Login/Login";
import Dashboard from "../admin/pages/dashboard/Dashboard";
import Customers from "../admin/pages/customers/Customers";
import Providers from "../admin/pages/providers/Providers";
import CustomerView from "../admin/pages/customers/cusromerView/CustomerView";
import ProviderView from "../admin/pages/providers/providerView/ProviderView";
import Services from "../admin/pages/serviceManagement/Services";
import { Routes, Route } from "react-router-dom";
import serviceImage from "../assets/images/customerLogin.jpg";
import { UserRole } from "../components/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import ServiceSubcategories from "../admin/pages/serviceManagement/ServiceSubcategories";
import AdminProfile from "../admin/pages/profile/AdminProfile"

const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              imageSrc={serviceImage}
              showGoogleAuth={false}
              showOtpLogin={false}
              forgotPasswd={false}
              haveOrNotAccount={false}
              reqUrl={"/api/login"}
              redirectPath={`/admin/dashboard`}
              userType={UserRole.ADMIN}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/customers" element={<Customers userType={"admin"} />} />
        <Route path="/providers" element={<Providers userType={"admin"} />} />
        <Route path="/services" element={<Services userType={"admin"} />} />
        <Route
          path="/subcategory"
          element={<ServiceSubcategories userType={"admin"} />}
        />
        <Route path="/providers/view/:id" element={<ProviderView />} />
        <Route path="/customers/view/:id" element={<CustomerView />} />
        <Route
          path="/profile"
          element={<AdminProfile userType={"admin"} />}
        />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
