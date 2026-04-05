
import { API } from "./api.js";

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};
