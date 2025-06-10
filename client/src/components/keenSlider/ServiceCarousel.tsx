import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Service {
  title: string;
  description: string;
  image: string;
  offer: string;
}

const services: Service[] = [
  {
    title: "Fan Installation",
    description: "Professional fan installation by experts.",
    image: "https://via.placeholder.com/150",
    offer: "25% OFF",
  },
  {
    title: "AC Repair",
    description: "Fast and reliable AC service.",
    image: "https://via.placeholder.com/150",
    offer: "30% OFF",
  },
  {
    title: "Pipe Fixing",
    description: "Affordable pipe fixing service.",
    image: "https://via.placeholder.com/150",
    offer: "15% OFF",
  },
  {
    title: "Switch Board",
    description: "Safe switch board installation.",
    image: "https://via.placeholder.com/150",
    offer: "10% OFF",
  },
];

const ServiceCarousel: React.FC = () => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 16,
    },
    mode: "free-snap",
  });

  const handlePrev = () => {
    slider.current?.prev();
  };

  const handleNext = () => {
    slider.current?.next();
  };

  const API = import.meta.env.VITE_API_URL;
  const imageURL = `${API}/asset/saloon2.jpg`;

  return (
    <div className="mt-10 relative">
      <h2 className="text-2xl font-bold mb-4">Popular Services</h2>

      <div ref={sliderRef} className="keen-slider">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="keen-slider__slide bg-black rounded-xl shadow-md flex flex-col sm:flex-row min-w-[220px] sm:min-w-[300px] p-4"
          >
            {/* Left content (75%) */}
            <div className="flex-1 flex flex-col justify-between pr-2">
              {/* Offer Badge */}
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded w-fit mb-2">
                {service.offer}
              </div>

              {/* Description */}
              <div className="text-white text-xs mb-1">
                {service.description}
              </div>

              {/* Title */}
              <div className="text-sm text-white font-semibold mb-2">
                {service.title}
              </div>
              <button className="mt-auto w-fit px-3 py-1 bg-[#7879CA] text-white text-sm rounded hover:bg-indigo-600">
                Book Now
              </button>
              {/* Book Button */}
            </div>

            {/* Right image (25%) */}
            <div className="w-full sm:w-1/3 mt-3 sm:mt-0">
              <img
                src={imageURL}
                alt={service.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        aria-label="Previous Slide"
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        ‹
      </button>

      <button
        aria-label="Next Slide"
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        ›
      </button>
    </div>
  );
};

export default ServiceCarousel;
