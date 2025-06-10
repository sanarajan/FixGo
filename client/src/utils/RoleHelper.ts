// RoleHelper.ts

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  STAFF = "staff",
  PROVIDER = "provider",
  WORKER = "worker",
}

// Get role based on URL path
export const getRoleFromPath = (): UserRole => {
  const pathname = window.location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as UserRole;

  switch (firstSegment) {
    case UserRole.ADMIN:
    case UserRole.PROVIDER:
    case UserRole.STAFF:
    case UserRole.WORKER:
      return firstSegment;
    default:
      return UserRole.CUSTOMER;
  }
};

// Uses role from URL path
export const getCurrentUserRole = (): UserRole => {
  return getRoleFromPath();
};

// Redirection when already logged in
export const getDashboardRedirectPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.CUSTOMER]: "/home",
    [UserRole.STAFF]: "/staff/home",
    [UserRole.PROVIDER]: "/provider/dashboard",
    [UserRole.WORKER]: "/worker/home",
  };
  return paths[role] || "/";
};


export const getLastSegmentFromPath = (): string | null => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const lastSegment = segments[segments.length - 1];
  return lastSegment;
};

export const getAccessTokenByUserRole = (role: UserRole): string | null => {
  let tokenKey: string;

  switch (role) {
    case UserRole.ADMIN:
      tokenKey = "admin_accessToken";
      break;
    case UserRole.PROVIDER:
      tokenKey = "provider_accessToken";
      break;
    case UserRole.CUSTOMER:
    default:
      tokenKey = "customer_accessToken";
      break;
  }

  return localStorage.getItem(tokenKey);
};


