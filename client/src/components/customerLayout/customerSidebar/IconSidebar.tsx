import React from 'react';
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaCogs,
  FaBox,
  FaMoneyBill,
  FaChartBar,
} from 'react-icons/fa';

const items = [
  { icon: <FaTachometerAlt />, label: 'Dashboard' },
  { icon: <FaUser />, label: 'Profile' },
  { icon: <FaUsers />, label: 'Provider' },
  { icon: <FaUsers />, label: 'Customer' },
  { icon: <FaCogs />, label: 'Services' },
  { icon: <FaBox />, label: 'Bookings' },
  { icon: <FaMoneyBill />, label: 'Payments' },
  { icon: <FaChartBar />, label: 'Report' },
];

const IconSidebar = ({ onExpand }) => {
  return (
    <div className="bg-[#7D7EB3] w-[70px] min-h-screen flex flex-col items-center pt-4 shadow-lg relative">
      
      {/* Toggle Button at Top */}
      <button
        onClick={onExpand}
        className="mb-6 text-white hover:text-gray-200 text-sm"
        title="Expand"
      >
        ➡️
      </button>

      {/* Icon Buttons Below */}
      <div className="flex flex-col items-center mt-4">
        {items.map((item, index) => (
          <div key={index} className="mb-6" title={item.label}>
            <button className="text-white hover:scale-110 transition-transform text-lg">
              {item.icon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSidebar;
