import axios from "@/Utils/AxiosInstance";

export const getAllMataKuliah = () => axios.get("/mataKuliah");
export const createMataKuliah = (data) => axios.post("/mataKuliah", data);
export const updateMataKuliah = (id, data) => axios.put(`/mataKuliah/${id}`, data);
export const deleteMataKuliah = (id) => axios.delete(`/mataKuliah/${id}`);
