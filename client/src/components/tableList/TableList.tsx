import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import noImage from "../../assets/images/noimage.png";
import EnhancedPagination from "../../components/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { getNestedValue } from "../../utils/NestedKeyHelper";
interface Heading {
  key: string;
  label: string;
  type?: "image" | "status" | "text";
}
interface ActionConfigItem {
  type: "popup" | "page";
  path?: string;
  component?: React.ComponentType<any>;
  params?: Record<string, any>;
}

interface TableListProps<T> {
  data: T[];
  onSearch: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totCount: number;
  pagesize: number;
  busy?: boolean;
  userType?: string;

  // allservices?:T[]
  headings: Heading[];
  showSubcategory: boolean;
  showActions?: ("view" | "edit" | "delete" | "blockUnblock")[];

  actionConfig: {
    add?: ActionConfigItem;
    edit?: ActionConfigItem;
    view?: ActionConfigItem;
    blockUnblock?: ActionConfigItem;
    delete?: ActionConfigItem; // ← NEW
  };
  extraProps?: Record<string, any>;
  refresh?: () => void; // NEW
  imagePath?: string;
}

interface ServiceData {
  serviceName: string;
  isActive: boolean;
  [key: string]: any;
}

type PopupType = "add" | "edit" | "view" | "blockUnblock" | "delete";

interface PopupState<T> {
  type: PopupType;
  data?: T;
  headings?: T;
}

const TableList = <T extends Record<string, any>>({
  data,
  onSearch,
  page,
  setPage,
  totalPages,
  totCount,
  pagesize,
  busy,
  userType,
  headings,
  showSubcategory,
  showActions = [],
  actionConfig,
  extraProps = {},
  refresh,
  imagePath
}: TableListProps<T>) => {

  const [popupState, setPopupState] = useState<PopupState<T> | null>(null);

  const [formData, setFormData] = useState({ name: "", status: "Active" });
  const navigate = useNavigate();
  const handleAction = (
    action: "add" | "edit" | "view" | "blockUnblock" | "delete",
    item?: T
  ) => {
    const config = actionConfig[action];
    if (!config) return;
    if (config.type === "page" && config.path) {
      navigate(config.path, { state: item });
    } else if (config.type === "popup" && config.component) {
      setFormData({ name: "", status: "Active" });
      setPopupState({ type: action, data: item });
    }
  };

  const renderPopup = () => {
    if (!popupState) return null;
    const cfg = actionConfig[popupState.type];
    if (!cfg || cfg.type !== "popup" || !cfg.component) return null;

    const Popup = cfg.component;
    //pagination
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
    return (
      <Popup
        imagePath={imagePath}
        userType={userType}
        mode={popupState.type}
        data={popupState.data}
        formData={formData}
        setFormData={setFormData}
        setShowPopup={() => setPopupState(null)}
        {...(cfg.params ?? {})}
        {...extraProps}
        refresh={refresh}
      />
    );
  };
  const renderCell = (data: T, heading: Heading) => {
    const value = getNestedValue(data, heading.key);

    if (heading.key === "serviceName") {
      const serviceName =
        (data as any)?.serviceId?.serviceName || data.serviceName;
      return serviceName;
    }
    console.log(imagePath+" imagepath")
    if (heading.type === "image") {
      const API = import.meta.env.VITE_API_URL;
      let imageuRL =  API + "/uploads/" + imagePath + value
      if(!value){
        imageuRL =`${API}/asset/noimage.png`
      }    
     
      return (
        <div className="flex justify-center">
          <img
            src={imageuRL}
            alt={imagePath}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      );
    }
    if (heading.type === "status" && showActions?.includes("blockUnblock")) {
      return (
        <span
          onClick={() => handleAction("blockUnblock", data)}
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === "Active" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {value === "Active" ? "Active" : "Inactive"}
        </span>
      );
    }

    return <>{value}</>;
  };

  const viewPath = window.location.pathname;
  return (
    <div className="p-6">
      {/* Header Row */}
      <div
        className={`flex justify-between mb-4 ${
          showSubcategory ? "w-[calc(100%)]" : "w-full "
        }`}
      >
        {actionConfig.add && (
          <button
            onClick={() => handleAction("add")}
            className="bg-[#5A52A4] text-white px-4 py-1 rounded"
          >
            ➕ Add
          </button>
        )}
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />
      </div>

      {/* Table */}
      <div className="flex gap-4">
        {/* Table Section */}
        <div className={showSubcategory ? "w-[calc(100%)]" : "w-full "}>
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <table className="w-full table-auto text-sm">
                  <thead className="bg-[#7879CA] text-white">
                    <tr>
                      {headings.map((heading) => (
                        <th key={heading.key} className="px-2 py-2 text-left">
                          {heading.label}
                        </th>
                      ))}
                      <th className="px-2 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                  
                      <tr key={idx} className="border-t text-left">
                        {headings.map((rowdata) => (
                          <td key={rowdata.key} className="px-2 py-2">
                            {renderCell(item, rowdata)}
                          </td>
                        ))}
                        <td className="px-2 py-2 space-x-2">
                          {showActions?.includes("view") && (
                            <button
                              onClick={() => handleAction("view", item)}
                              className="text-green-500"
                            >
                              👁️
                            </button>
                          )}
                          {showActions?.includes("edit") && (
                            <button
                              className="text-blue-500"
                              onClick={() => handleAction("edit", item)}
                            >
                              ✏️
                            </button>
                          )}
                          {showActions?.includes("delete") && (
                            <button
                              onClick={() => handleAction("delete", item)}
                              className="text-red-500"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-4">
              <EnhancedPagination
                count={totalPages}
                page={page}
                totCount={totCount}
                pageSize={pagesize}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="medium"
              />
            </div>
          </div>
        </div>

        {/* Subcategory Button Section */}
        {showSubcategory && (
          <div className="w-[250px] ">
            <div className="bg-white shadow rounded h-full flex items-center justify-center p-4">
              <button
                onClick={() => navigate("/admin/subcategory")}
                className="bg-[#5A52A4] text-white px-4 py-2 rounded"
              >
                SUBCATEGORY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {renderPopup()}
    </div>
  );
};

export default TableList;
