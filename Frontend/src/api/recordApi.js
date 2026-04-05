// src/api/recordApi.js

import { API } from "./api";

export const getRecords = () => API.get("/records");

export const createRecord = (data) =>
  API.post("/records", data);

export const updateRecord = (id, data) =>
  API.put(`/records/${id}`, data);

export const deleteRecord = (id) =>
  API.delete(`/records/${id}`);