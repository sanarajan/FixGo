import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  } catch (e) {
    return true; // treat errors as expired
  }
};

export const getCurrentToken = (): string | null => {
  const role = localStorage.getItem("currentRole");
  console.log("role"+ role)
  if (!role) return null;
  return localStorage.getItem(`${role}_accessToken`);
};
