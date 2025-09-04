import { axiosInstance } from "./axios";

export const sendMessage = async (msg) => {
  const response = await axiosInstance.post("/chat/anonymous", msg);
  return response.data;
};
