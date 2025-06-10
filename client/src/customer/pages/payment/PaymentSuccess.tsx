import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use your header style for consistency */}
      <header className="flex flex-wrap bg-[#7879CA] items-center justify-between px-6 py-4 shadow-md">
        <div className="text-2xl font-bold text-white">
          <span className="bg-black px-2 py-1 rounded">FG</span> FixGo
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-10 max-w-md text-center">
          <div className="text-6xl mb-6" aria-label="Success icon">
            🎉
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Payment Successful
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your transaction has been completed successfully.
          </p>
          <button
            onClick={() => navigate('/')} // adjust route as needed
            className="bg-[#7879CA] hover:bg-[#5b5da6] text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Go to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
