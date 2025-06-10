import React,{ReactNode} from 'react';
import Sidebar from "../adminSidebar/AdminSidebar";
import CustomerHeader from "../header/CustomerHeader";
import SidebarWrapper from '../adminSidebar/SidebarWrapper';



interface AdminLayoutProps {
  children: ReactNode;
}

const CustomerLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
       <CustomerHeader/>
  
 
    {children}
</div>

  );
};

export default CustomerLayout;
