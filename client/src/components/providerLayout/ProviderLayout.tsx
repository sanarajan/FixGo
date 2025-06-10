import React, { ReactNode } from "react";
import ProviderSidebar from "../providerLayout/ProviderSidebar";
import ProviderHeader from "../header/ProviderHeader";
import SidebarWrapper from "../providerLayout/ProviderSidebarWrapper";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
      <ProviderHeader />
      <div className="flex">
        {/* Sidebar wrapper with fixed width */}
        <div className="transition-all duration-300">
          <SidebarWrapper />
        </div>

        {/* Main content */}
        <main className="flex-grow p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
