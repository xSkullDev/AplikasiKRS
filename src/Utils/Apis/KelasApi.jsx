import axios from "@/Utils/AxiosInstance";

export const getAllKelas = () => axios.get("/kelas");
export const createKelas = (data) => axios.post("/kelas", data);
export const updateKelas = (id, data) => axios.put(`/kelas/${id}`, data);
export const deleteKelas = (id) => axios.delete(`/kelas/${id}`);
