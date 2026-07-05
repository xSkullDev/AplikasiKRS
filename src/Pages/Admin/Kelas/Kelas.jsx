import { useMemo, useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContexts";
import { useCreateKelas, useDeleteKelas, useKelas, useUpdateKelas } from "@/Utils/Hooks/useKelas";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/swalHelpers";

const initialForm = {
  id: null,
  mataKuliahId: "",
  dosenId: "",
  mahasiswaIds: [],
};

const Kelas = () => {
  const { user } = useAuthStateContext();
  const permissions = user?.permission ?? [];
  const { data: kelas = [] } = useKelas();
  const { data: mataKuliah = [] } = useMataKuliah();
  const { data: mahasiswaResult = { data: [], total: 0 } } = useMahasiswa();
  const mahasiswa = mahasiswaResult.data ?? [];
  const { mutateAsync: createKelas } = useCreateKelas();
  const { mutateAsync: updateKelas } = useUpdateKelas();
  const { mutateAsync: deleteKelas } = useDeleteKelas();

  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");

  const dosenList = [
    { id: 1, nama: "Dr. Sari", maxSks: 24 },
    { id: 2, nama: "Prof. Bima", maxSks: 20 },
  ];

  const selectedMataKuliah = mataKuliah.find((item) => item.id === Number(form.mataKuliahId));

  const selectedMahasiswa = useMemo(() => {
    return mahasiswa.filter((item) => form.mahasiswaIds.includes(item.id));
  }, [form.mahasiswaIds, mahasiswa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMahasiswaToggle = (id) => {
    setForm((prev) => {
      const exists = prev.mahasiswaIds.includes(id);
      const newIds = exists ? prev.mahasiswaIds.filter((item) => item !== id) : [...prev.mahasiswaIds, id];
      return { ...prev, mahasiswaIds: newIds };
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setIsEdit(false);
    setMessage("");
  };

  const validateForm = () => {
    if (!form.mataKuliahId || !form.dosenId || form.mahasiswaIds.length === 0) {
      setMessage("Pilih mata kuliah, dosen, dan minimal 1 mahasiswa");
      return false;
    }

    const duplicateCourse = kelas.some((item) => Number(item.mataKuliahId) === Number(form.mataKuliahId) && Number(item.id) !== Number(form.id));
    if (duplicateCourse) {
      setMessage("Satu mata kuliah hanya boleh ditugaskan ke satu dosen dalam satu kelas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      mataKuliahId: Number(form.mataKuliahId),
      dosenId: Number(form.dosenId),
      mahasiswaIds: form.mahasiswaIds.map(Number),
      namaKelas: selectedMataKuliah?.nama || "Kelas",
    };

    const saveAction = async () => {
      try {
        if (isEdit) {
          await updateKelas({ id: form.id, data: payload });
        } else {
          await createKelas(payload);
        }
        resetForm();
      } catch (error) {
        toastError("Gagal menyimpan kelas");
      }
    };

    if (isEdit) {
      confirmUpdate(saveAction);
    } else {
      await saveAction();
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      mataKuliahId: item.mataKuliahId,
      dosenId: item.dosenId,
      mahasiswaIds: item.mahasiswaIds || [],
    });
    setIsEdit(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await deleteKelas(id);
      } catch (error) {
        toastError("Gagal menghapus kelas");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <Heading as="h2" className="mb-4 text-left">Pengelolaan Kelas</Heading>
        <p className="mb-4 text-sm text-slate-600">
          Pilih mata kuliah, dosen, dan mahasiswa yang ingin dimasukkan ke kelas ini. Tidak ada batasan SKS untuk pengelolaan kelas.
        </p>

        {message && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Mata Kuliah</label>
              <select name="mataKuliahId" value={form.mataKuliahId} onChange={handleChange} className="w-full rounded-lg border p-2">
                <option value="">Pilih Mata Kuliah</option>
                {mataKuliah.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} ({item.sks} SKS)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Dosen</label>
              <select name="dosenId" value={form.dosenId} onChange={handleChange} className="w-full rounded-lg border p-2">
                <option value="">Pilih Dosen</option>
                {dosenList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} (Maks. {item.maxSks} SKS)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Mahasiswa yang akan masuk ke kelas</label>
            <div className="grid gap-2 md:grid-cols-2">
              {mahasiswa.map((item) => {
                const isSelected = form.mahasiswaIds.includes(item.id);
                const takenSks = Number(item.sks || 0);
                return (
                  <label key={item.id} className={`rounded-lg border p-3 ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleMahasiswaToggle(item.id)} className="mr-2" />
                    <span className="font-medium">{item.nama}</span>
                    <div className="mt-1 text-sm text-slate-600">
                      NIM: {item.nim}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <div>Jumlah mahasiswa terpilih: <strong>{form.mahasiswaIds.length}</strong></div>
            {selectedMataKuliah && <div>Mata kuliah terpilih: <strong>{selectedMataKuliah.nama}</strong></div>}
            {selectedMahasiswa.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedMahasiswa.map((student) => (
                  <div key={student.id}>{student.nama} ({student.nim})</div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">{isEdit ? "Perbarui Kelas" : "Simpan Kelas"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>Reset</Button>
          </div>
        </form>
      </Card>

      <Card>
        <Heading as="h3" className="mb-4 text-left">Daftar Kelas</Heading>
        <div className="space-y-3">
          {kelas.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{item.namaKelas || `Kelas #${item.id}`}</div>
                <div className="text-sm text-slate-600">
                  Mata Kuliah ID: {item.mataKuliahId} • Dosen ID: {item.dosenId} • Mahasiswa: {item.mahasiswaIds?.length || 0}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="info" onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Hapus</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Kelas;
