import axiosClient from '../api/axiosClient';

export const getUserProfile = async () => {
  const response = await axiosClient.get('/user/profile');
  return response.data;
};
