// Utils/Hooks/useKelas.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createKelas, deleteKelas, getAllKelas, updateKelas } from "@/Utils/Apis/KelasApi";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";

export const useKelas = () =>
  useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
    select: (res) => res?.data ?? [],
  });

export const useCreateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil dibuat");
    },
    onError: () => toastError("Gagal membuat kelas"),
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil diperbarui");
    },
    onError: () => toastError("Gagal memperbarui kelas"),
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus kelas"),
  });
};