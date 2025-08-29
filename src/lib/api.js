import { axiosInstance } from "./axios";

export const sendMessage = async (msg) => {
  const response = await axiosInstance.post("/chat/message", msg);
  return response.data;
};
