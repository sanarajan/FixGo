// export const getCurrentUserRole = (): string | null => {
//     return localStorage.getItem("currentRole");
//   };
  
import { getRoleFromPath } from "./RoleHelper";

export const getCurrentUserRole = (): string | null => {
  return getRoleFromPath();
};

export const getRedirectPathFromCurrentRoute = (): string => {
  const role = getRoleFromPath();

  switch (role) {
    case "admin":
      return "/admin";
    case "provider":
      return "/provider";
    case "customer":
      return "/";
    default:
      return "/";
  }
};
