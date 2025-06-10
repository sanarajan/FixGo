import React, { useState } from 'react';
import ProviderSidebar from "../providerLayout/ProviderSidebar";
import IconSidebar from './ProviderIconSidebar';

const ProviderSidebarWrapper = () => {
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
          <ProviderSidebar onCollapse={() => setIsCollapsed(true)} />
        )}
      </div>
    );
  };
  

export default ProviderSidebarWrapper;
