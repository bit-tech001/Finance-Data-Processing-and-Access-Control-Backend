// src/api/dashboardApi.js

import { API } from "./api";

export const getDashboard = () => API.get("/dashboard");