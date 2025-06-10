import { getRedirectPathFromCurrentRoute } from "../utils/AuthRedirection";
import { getRoleFromPath } from "../utils/RoleHelper";
import { logoutProvider } from "../redux/ProviderSlice";
import { logoutUser as customerLogout } from "../redux/UserSlice";
import { logoutAdmin } from "../redux/AdminSlice";
import store from "../redux/Store";
import customerAxiosClient from "../api/customerAxiosClient";
import axiosClient from "../api/axiosClient";

// Make logoutUser async so you can await internal calls
export const logout = async (userRole?: string) => {
  // const currentRole = getRoleFromPath();
  const currentRole =userRole;

  const logouthandle = async (currentRole:string): Promise<string | null> => {
    try {
      let response;
      if (currentRole === "provider" || currentRole === "admin") {
        response = await axiosClient.post(`/api/admin/adminLogout`);
      } else if (currentRole === "customer") {
        console.log("  yes customer from function logout")

        response = await customerAxiosClient.post(`/api/customerLogout`);
      }

      if (response?.status === 200 && response.data?.role) {
        return response.data.role; // Return the role
      } else {
        console.error("Logout failed or role missing:", response?.data);
        return null;
      }
    } catch (error) {
      console.error("Error during logout request:", error);
      return null;
    }
  };

  // Await the result of logouthandle
  const role = await logouthandle(currentRole||"")
console.log(role+"  role from function logout")
  // Now handle clearing state/localStorage and navigation
  if (role) {
    console.log(" yes role")
    const keysToRemove = [
      "currentRole",
      `${role}_user`,
      `${role}_accessToken`,
      `${role}_refreshToken`,
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    switch (role) {
      case "provider":
        store.dispatch(logoutProvider());
        localStorage.removeItem("persist:provider");
        break;
      case "admin":
        store.dispatch(logoutAdmin());
        localStorage.removeItem("persist:admin");
        break;
      case "customer":
        store.dispatch(customerLogout("customer"));
        localStorage.removeItem("persist:customer");
                localStorage.removeItem("serviceState");

        
        break;
      default:
        break;
    }

    const redirectPath = getRedirectPathFromCurrentRoute();
    window.location.href = redirectPath;
  } else {
    // No role found or API failed → fallback login
    window.location.href = "/";
  }
};
