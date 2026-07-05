import { useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContexts";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useMataKuliah, useCreateMataKuliah, useDeleteMataKuliah, useUpdateMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import MahasiswaMataKuliah from "./MahasiswaMataKuliah";
import MataKuliahModal from "./MataKuliahModal";
import { confirmDelete } from "@/Utils/Helpers/swalHelpers";

const MataKuliah = () => {
  const { user } = useAuthStateContext();
  const permissions = user?.permission ?? [];
  const { data: mataKuliah = [] } = useMataKuliah();
  const { data: mahasiswaResult = { data: [] } } = useMahasiswa();
  const mahasiswa = mahasiswaResult.data ?? [];
  const { mutateAsync: createMataKuliah } = useCreateMataKuliah();
  const { mutateAsync: updateMataKuliah } = useUpdateMataKuliah();
  const { mutateAsync: deleteMataKuliah } = useDeleteMataKuliah();

  const [form, setForm] = useState({ id: null, nama: "", sks: "", deskripsi: "" });
  const [selectedMahasiswa, setSelectedMahasiswa] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMahasiswaToggle = (id) => {
    setSelectedMahasiswa((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setForm({ id: null, nama: "", sks: "", deskripsi: "" });
    setSelectedMahasiswa([]);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      nama: item.nama || "",
      sks: item.sks ?? "",
      deskripsi: item.deskripsi || "",
    });
    setSelectedMahasiswa(item.mahasiswaIds || []);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama) return;

    const payload = {
      nama: form.nama,
      sks: Number(form.sks || 0),
      deskripsi: form.deskripsi,
      mahasiswaIds: selectedMahasiswa,
    };

    if (isEdit && form.id) {
      await updateMataKuliah({ id: form.id, data: payload });
    } else {
      await createMataKuliah(payload);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      await deleteMataKuliah(id);
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Heading as="h2" className="mb-4 text-left">Manajemen Mata Kuliah</Heading>
        <p className="mb-4 text-sm text-slate-600">
          Admin dapat menambahkan mata kuliah baru tanpa batasan SKS. Mahasiswa dapat memilih mata kuliah yang tersedia.
        </p>

        {permissions.includes("mahasiswa.create") && (
          <div className="mb-4 flex justify-end">
            <Button onClick={openAddModal} variant="primary">Tambah Mata Kuliah</Button>
          </div>
        )}
      </Card>

      <Card>
        <Heading as="h3" className="mb-4 text-left">Daftar Mata Kuliah</Heading>
        <div className="space-y-3">
          {mataKuliah.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{item.nama}</div>
                  <div className="text-sm text-slate-600">SKS: {item.sks} • {item.deskripsi || "Tidak ada deskripsi"}</div>
                  <div className="mt-2 text-sm">
                    Tersedia untuk mahasiswa: {item.mahasiswaIds?.length || 0}
                  </div>
                </div>
                <div className="flex gap-2">
                  {permissions.includes("mahasiswa.update") && (
                    <Button size="sm" variant="info" onClick={() => handleEdit(item)}>Edit</Button>
                  )}
                  {permissions.includes("mahasiswa.delete") && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Hapus</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {user?.role !== "admin" && <MahasiswaMataKuliah />}

      <MataKuliahModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={resetForm}
        onSubmit={handleSubmit}
        mahasiswa={mahasiswa}
        selectedMahasiswa={selectedMahasiswa}
        onMahasiswaToggle={handleMahasiswaToggle}
      />
    </div>
  );
};

export default MataKuliah;
