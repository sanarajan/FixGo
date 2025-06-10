import React, { useState } from 'react';
import Sidebar from "../adminSidebar/AdminSidebar";
import IconSidebar from './IconSidebar';

const SidebarWrapper = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    return (
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'w-[70px]' : 'w-[235px]'
        }`}
      >
        {isCollapsed ? (
          <IconSidebar onExpand={() => setIsCollapsed(false)} />
        ) : (
          <Sidebar onCollapse={() => setIsCollapsed(true)} />
        )}
      </div>
    );
  };
  

export default SidebarWrapper;
