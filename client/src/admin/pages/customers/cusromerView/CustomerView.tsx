import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../../../components/AdminLayout/AdminLayout";
import "./CustomerView.css";
import axiosClient from "../../../../api/axiosClient";

// ✅ Define customer type based on your backend shape
interface Customer {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  place?: string;
  state?: string;
  isActive: boolean;
  image?: string;
}

// ✅ Define route param type
interface RouteParams {
  id: string;
}

const CustomerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async (): Promise<void> => {
    try {
      const response = await axiosClient.get<Customer>(
        `/api/admin/customerView/${id}`
      );
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setCustomer(null);
    }
  };
  let providimage = `http://localhost:5000/uploads/noimage.png`;

  if (customer?.image) {
    providimage = `http://localhost:5000/uploads/${customer.image}`;
  }
  console.log(providimage);
  if (!customer) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="customer-container">
        {/* Title */}
        <div className="customer-name-box shadow">
          <h6>Customer View</h6>
        </div>
        {/* Customer Info Box */}
        <div className="customer-form-box shadow">
          <div className="form-top">
            <img src={providimage} alt="no image" className="profile-img" />
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input value={customer.fullname} readOnly />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input value={customer.username} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input value={customer.email} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={customer.phone} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Place</label>
                <input value={customer.place || "N/A"} readOnly />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={customer.state || "N/A"} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={customer.isActive ? "ACTIVE" : "INACTIVE"}
                  disabled
                >
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </select>
              </div>
              <div className="form-group">
                {/* Future: Add map preview if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerView;
