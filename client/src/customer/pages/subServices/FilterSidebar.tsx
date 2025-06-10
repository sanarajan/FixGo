// components/FilterSidebar.tsx

import React, { useState } from "react";

const FilterSidebar: React.FC = () => {
  const [status, setStatus] = useState<string>("Pending");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [brandOpen, setBrandOpen] = useState<boolean>(false);
  const [ratings, setRatings] = useState<number[]>([]);
  const [offer, setOffer] = useState<boolean>(false);

  const handleRatingChange = (value: number) => {
    setRatings((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-72 bg-white rounded-xl shadow-2xl p-5 transition-all duration-500 ease-in-out transform hover:scale-[1.01] hover:shadow-purple-300/50 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center border-b pb-2">
        FILTER
      </h2>

      {/* Status Dropdown */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 block mb-1">
          STATUS
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          PRICE
        </label>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-20 px-2 py-1 border rounded"
          />
          <span className="mx-2">to</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
        {/* Optional: Slider can be added here */}
      </div>

      {/* Brand Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setBrandOpen(!brandOpen)}
          className="w-full text-left text-sm font-semibold text-gray-600 flex justify-between items-center"
        >
          Category
          <span>{brandOpen ? "▲" : "▼"}</span>
        </button>
        {brandOpen && (
          <div className="mt-2 text-sm text-gray-500">
            <label className="block">
              <input type="checkbox" className="mr-2" /> Samsung
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> LG
            </label>
            {/* Add more brands */}
          </div>
        )}
      </div>

      {/* Customer Rating */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-600 block mb-2">
          CUSTOMER RATING
        </label>
        {[4, 3, 2, 1].map((rate) => (
          <label
            key={rate}
            className="flex items-center text-sm mb-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={ratings.includes(rate)}
              onChange={() => handleRatingChange(rate)}
              className={`accent-blue-600 mr-2 h-4 w-4`}
            />
            {rate} ★ & Above
          </label>
        ))}
      </div>

      {/* Offer Checkbox */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600">
          <input
            type="checkbox"
            checked={offer}
            onChange={() => setOffer(!offer)}
            className="mr-2 h-4 w-4 accent-purple-600"
          />
          OFFER
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
