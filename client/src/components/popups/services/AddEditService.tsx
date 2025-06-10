import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { getRoleFromPath } from "../../../utils/RoleHelper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

interface AddEditServiceProps {
  formData: { name: string; status: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; status: string }>
  >;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit" | "view" | "blockUnblock";
  data?: any;
  refresh?: () => void;
}

const AddEditService: React.FC<AddEditServiceProps> = ({
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
  const navigate = useNavigate();
  useEffect(() => {
    if (data && isEdit) {
      setFormData({
        name: data.serviceName || "",
        status: data.status,
      });
    }
  }, [data, isEdit, setFormData]);

  const closePopup = () => setShowPopup(false);
  const userType = getRoleFromPath();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors["serviceName"] = "Service name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (mode === "add") {
        const response = await axiosClient.post(
          "/api/admin/addService",
          {
            serviceName: formData.name,
            status: formData.status,
          },
          {
            headers: {
              userRole: userType,
            },
          }
        );

        if (response.status === 201) {
          navigate("/admin/services");
          toast.success("Service added successfully!", { autoClose: 500 });
        }
      } else if (mode === "edit") {
        const response = await axiosClient.put(
          `/api/admin/editService/${data._id}`,
          {
            serviceName: formData.name,
            status: formData.status,
          },
          {
            headers: {
              userRole: userType,
            },
          }
        );
        if (response.status === 200)
          toast.success("Service updated successfully!", { autoClose: 500 });
      } else if (mode === "blockUnblock") {
        await axiosClient.patch(`/api/admin/services/${data._id}`, {
          status: formData.status === "Active" ? "Inactive" : "Active",
        });
        toast.success(
          `Service ${
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
      <div className="bg-white rounded-xl shadow-xl w-[320px]">
        <div className="bg-[#5A52A4] text-white py-3 px-4 rounded-t-xl flex justify-between items-center">
          <span className="font-semibold">
            {isEdit ? "Update Service" : "Add Service"}
          </span>
          <button
            onClick={closePopup}
            className="text-white text-lg font-bold hover:text-gray-300"
          >
            ✖️
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="text-sm font-semibold px-2 py-3">
            Service name
          </label>
          <input
            type="text"
            placeholder="Service name"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors((prev) => ({ ...prev, serviceName: "" }));
            }}
          />
          {errors["serviceName"] && (
            <p className="text-sm text-red-500 -mt-2">
              {errors["serviceName"]}
            </p>
          )}
          <label className="text-sm font-semibold px-2 py-3"> Status</label>

          <select
            className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {!loading && mode !== "view" && (
            <button
              onClick={handleSubmit}
              className={`w-full bg-[#5A52A4] text-white py-2 rounded-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "UPDATE" : "SAVE"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEditService;
