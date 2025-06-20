import React from "react";

type Subcategory = {
  _id: string;
  name: string;
};

type GroupedProviderService = {
  serviceId: string;
  serviceName: string;
  subcategories: Subcategory[];
};

interface StaffServiceModalProps {
  servicesData: GroupedProviderService[];
  selectedServices: { [key: string]: string[] };
  expandedServices: string[];
  show: boolean;
  onClose: () => void;
  onToggleExpand: (serviceId: string) => void;
  onServiceToggle: (serviceId: string, isChecked: boolean) => void;
  onSubcategoryToggle: (
    serviceId: string,
    subId: string,
    isChecked: boolean
  ) => void;
  areAllServicesSelected: () => boolean;
  handleSelectAll: (isChecked: boolean) => void;
}

const StaffServices: React.FC<StaffServiceModalProps> = ({
  servicesData,
  selectedServices,
  expandedServices,
  show,
  onClose,
  onToggleExpand,
  onServiceToggle,
  onSubcategoryToggle,
  areAllServicesSelected,
  handleSelectAll,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] p-6 rounded-lg shadow-lg overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4 text-[#5A52A4]">Select Services</h2>

        <div className="mb-4 flex items-center gap-2">
          <label className="font-semibold text-sm">Select All Services</label>
          <input
            type="checkbox"
            checked={areAllServicesSelected()}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>

        <div className="space-y-4">
          {servicesData.map((service) => (
            <div
              key={service.serviceId}
              className="border border-[#ddd] rounded p-3 bg-[#F9F9FC]"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedServices[service.serviceId]?.length ===
                    service.subcategories.length
                  }
                  onChange={(e) =>
                    onServiceToggle(service.serviceId, e.target.checked)
                  }
                />
                <span
                  className="cursor-pointer ml-3 font-semibold text-[#5A52A4]"
                  onClick={() => onToggleExpand(service.serviceId)}
                >
                  {service.serviceName}
                </span>
              </div>

              {expandedServices.includes(service.serviceId) && (
                <div className="ml-6 mt-2 space-y-2">
                  {service.subcategories.map((sub) => (
                    <label
                      key={sub._id}
                      className="flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedServices[service.serviceId]?.includes(
                            sub._id
                          ) || false
                        }
                        onChange={(e) =>
                          onSubcategoryToggle(
                            service.serviceId,
                            sub._id,
                            e.target.checked
                          )
                        }
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="bg-[#5A52A4] text-white px-4 py-2 rounded hover:bg-[#4a479c]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffServices;
