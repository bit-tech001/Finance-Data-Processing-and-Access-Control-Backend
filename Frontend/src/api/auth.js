
import { API } from "./api"; // make sure this path is correct

// 🔐 REGISTER USER
export const registerUser = async (data) => {
  try {
    const response = await API.post("/auth/register", data);
    return response.data; // return backend data
  } catch (error) {
    // 🔥 Better error handling
    throw error?.response?.data || { message: "Registration failed" };
  }
};

// 🔐 LOGIN USER
export const loginUser = async (data) => {
  try {
    const response = await API.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data || { message: "Login failed" };
  }
};