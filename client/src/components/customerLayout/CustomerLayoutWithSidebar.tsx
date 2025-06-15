import React,{ReactNode} from 'react';
import CustomerHeader from "../header/CustomerHeader";
import SidebarWrapper from "./customerSidebar/SidebarWrapper";



interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <div>
      <CustomerHeader />
      <div className="flex">
        <div className="transition-all duration-300">
          <SidebarWrapper />
        </div>

        <main className="flex-grow p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>

  );
};

export default CustomerLayout;
