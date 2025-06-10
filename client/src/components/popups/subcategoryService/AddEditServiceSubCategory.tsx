import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { getRoleFromPath } from "../../../utils/RoleHelper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddEditServiceSubCategoryProps {
  formData: { serviceId: string; subcategory: string; status: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      serviceId: string;
      subcategory: string;
      status: string;
    }>
  >;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit" | "view" | "blockUnblock";
  data?: any;
  refresh?: () => void;
}

const AddEditServiceSubCategory: React.FC<AddEditServiceSubCategoryProps> = ({
  formData,
  setFormData,
  setShowPopup,
  mode,
  data,
  refresh,
}) => {
  const isEdit = mode === "edit" || mode === "blockUnblock" || mode === "view";
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [services, setServices] = useState<
    { _id: string; serviceName: string }[]
  >([]);
  const userType = getRoleFromPath();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (data && isEdit) {
      setFormData({
        serviceId: data.serviceId?._id || "",
        subcategory: data.subcategory || "",
        status: data.status,
      });
    }
  }, [data, isEdit, setFormData]);

  const fetchServices = async () => {
    try {
      const response = await axiosClient.get("/api/admin/services", {
        headers: {
          userRole: userType,
        },
      });
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const closePopup = () => setShowPopup(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceId) {
      newErrors["serviceId"] = "Service is required.";
    }

    if (!formData.subcategory || !formData.subcategory.trim()) {
      newErrors["subcategory"] = "Subcategory name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      if (mode === "add") {
        const response = await axiosClient.post(
          "/api/admin/addServiceSubcategory",
          {
            serviceId: formData.serviceId,
            subcategory: formData.subcategory,
            status: formData.status,
          },
          {
            headers: {
              userRole: userType,
            },
          }
        );
        if (response.status === 201) {
          toast.success("Subcategory added successfully!", { autoClose: 500 });
        }
      } else if (mode === "edit") {
        const response = await axiosClient.put(
          `/api/admin/editServiceSubcategory/${data._id}`,
          {
            serviceId: formData.serviceId,
            subcategory: formData.subcategory,
            status: formData.status,
          },
          {
            headers: {
              userRole: userType,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Subcategory updated successfully!", {
            autoClose: 500,
          });
        }
      } else if (mode === "blockUnblock") {
        await axiosClient.patch(`/api/admin/serviceSubcategories/${data._id}`, {
          status: formData.status === "Active" ? "Inactive" : "Active",
        });
        toast.success(
          `Subcategory ${
            formData.status === "Active" ? "deactivated" : "activated"
          } successfully!`,
          { autoClose: 1000 }
        );
      }
      setTimeout(() => {
        closePopup();
      }, 1000);
    } catch (error: any) {
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      refresh?.();
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="bg-white rounded-xl shadow-xl w-[350px]">
        <div className="bg-[#5A52A4] text-white py-3 px-4 rounded-t-xl flex justify-between items-center">
          <span className="font-semibold">
            {isEdit ? "Update Subcategory" : "Add Subcategory"}
          </span>
          <button
            onClick={closePopup}
            className="text-white text-lg font-bold hover:text-gray-300"
          >
            ✖️
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit}>
            <label className="text-sm font-semibold px-2 py-3">
              Service Name
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
              value={formData.serviceId}
              onChange={(e) => {
                setFormData({ ...formData, serviceId: e.target.value });
                setErrors((prev) => ({ ...prev, serviceId: "" }));
              }}
              disabled={mode === "view"}
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.serviceName}
                </option>
              ))}
            </select>
            {errors["serviceId"] && (
              <p className="text-sm text-red-500 -mt-2">
                {errors["serviceId"]}
              </p>
            )}

            <label className="text-sm font-semibold px-2 py-3">
              Subcategory Name
            </label>
            <input
              type="text"
              placeholder="Subcategory Name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm"
              value={formData.subcategory}
              onChange={(e) => {
                setFormData({ ...formData, subcategory: e.target.value });
                setErrors((prev) => ({ ...prev, subcategory: "" }));
              }}
              disabled={mode === "view"}
            />
            {errors["subcategory"] && (
              <p className="text-sm text-red-500 -mt-2">
                {errors["subcategory"]}
              </p>
            )}

            <label className="text-sm font-semibold px-2 py-3">Status</label>
            <select
              className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              disabled={mode === "view"}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {!loading && mode !== "view" && (
              <button
                className={`w-full bg-[#5A52A4] text-white py-2 rounded-lg font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : isEdit ? "UPDATE" : "SAVE"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditServiceSubCategory;
