import React,{ReactNode} from 'react';
import Sidebar from "../adminSidebar/AdminSidebar";
import Header from "../header/Header";
import SidebarWrapper from '../adminSidebar/SidebarWrapper';



interface AdminLayoutProps {
  children: ReactNode;
}

const ProviderLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div>
       <Header/>
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

export default ProviderLayout;
