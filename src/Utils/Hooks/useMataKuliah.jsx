// Utils/Hooks/useMataKuliah.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMataKuliah, deleteMataKuliah, getAllMataKuliah, updateMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";

export const useMataKuliah = () =>
  useQuery({
    queryKey: ["mata-kuliah"],
    queryFn: getAllMataKuliah,
    select: (res) => res?.data ?? [],
  });

export const useCreateMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mata kuliah."),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mata kuliah."),
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};