import { useEffect, useMemo, useState } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { useMahasiswa, useUpdateMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { useKelas } from "@/Utils/Hooks/useKelas";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";
import { confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContexts";

const MahasiswaMataKuliah = () => {
  const { user } = useAuthStateContext();
  const { data: mahasiswaResult = { data: [] } } = useMahasiswa();
  const { data: mataKuliah = [] } = useMataKuliah();
  const { data: kelas = [] } = useKelas();
  const { mutateAsync: updateMahasiswa } = useUpdateMahasiswa();
  const mahasiswa = mahasiswaResult.data ?? [];
  const isAdminView = user?.role === "admin";
  const [selectedMahasiswa, setSelectedMahasiswa] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [savedClasses, setSavedClasses] = useState([]);

  const selectedStudent = useMemo(() => {
    if (isAdminView) {
      return mahasiswa.find((item) => String(item.id) === String(selectedMahasiswa)) || null;
    }

    return mahasiswa.find((item) => String(item.id) === String(user?.mahasiswaId)) || null;
  }, [isAdminView, mahasiswa, selectedMahasiswa, user?.mahasiswaId]);

  useEffect(() => {
    if (selectedStudent) {
      const initialSavedClasses = (selectedStudent.selectedKelasIds || selectedStudent.selectedMataKuliahIds || [])
        .map(Number)
        .filter((id) => id !== 3);
      setSelectedClasses(initialSavedClasses);
      setSavedClasses(initialSavedClasses);
    } else {
      setSelectedClasses([]);
      setSavedClasses([]);
    }
  }, [selectedStudent]);

  const handleStudentChange = (e) => {
    setSelectedMahasiswa(e.target.value);
  };

  const selectedClassSks = useMemo(() => {
    return kelas
      .filter((item) => selectedClasses.includes(Number(item.id)))
      .reduce((total, item) => {
        const course = mataKuliah.find((courseItem) => Number(courseItem.id) === Number(item.mataKuliahId));
        return total + Number(course?.sks || 0);
      }, 0);
  }, [kelas, mataKuliah, selectedClasses]);

  const getClassDisplay = (classId) => {
    const classItem = kelas.find((item) => Number(item.id) === Number(classId));
    const course = mataKuliah.find((item) => Number(item.id) === Number(classItem?.mataKuliahId));
    return {
      className: classItem?.namaKelas || `Kelas #${classId}`,
      courseName: course?.nama || "-",
      courseSks: course?.sks || 0,
    };
  };

  const handleClassToggle = (kelasItem) => {
    const classId = Number(kelasItem.id);
    const currentlySelected = selectedClasses.includes(classId);
    const classSks = Number(
      mataKuliah.find((courseItem) => Number(courseItem.id) === Number(kelasItem.mataKuliahId))?.sks || 0
    );
    const newSelected = currentlySelected
      ? selectedClasses.filter((item) => item !== classId)
      : [...selectedClasses, classId];

    const nextSks = kelas
      .filter((item) => newSelected.includes(Number(item.id)))
      .reduce((total, item) => {
        const course = mataKuliah.find((courseItem) => Number(courseItem.id) === Number(item.mataKuliahId));
        return total + Number(course?.sks || 0);
      }, 0);

    if (!currentlySelected && nextSks > 10) {
      toastError("Maksimal total SKS untuk pemilihan kelas adalah 10 SKS");
      return;
    }

    setSelectedClasses(newSelected);
  };

  const handleSubmit = async () => {
    const studentId = selectedStudent?.id;

    if (!studentId) {
      toastError(isAdminView ? "Pilih mahasiswa terlebih dahulu" : "Data mahasiswa tidak ditemukan");
      return;
    }

    if (selectedClassSks > 10) {
      toastError("Maksimal total SKS untuk pemilihan kelas adalah 10 SKS");
      return;
    }

    confirmUpdate(async () => {
      try {
        const finalizedClasses = selectedClasses.map(Number).filter((id) => id !== 3);
        await updateMahasiswa({
          id: studentId,
          data: {
            ...selectedStudent,
            selectedKelasIds: finalizedClasses,
            selectedSks: selectedClassSks,
          },
        });
        setSavedClasses(finalizedClasses);
        toastSuccess("Pilihan kelas berhasil disimpan");
      } catch (error) {
        toastError("Gagal menyimpan pilihan kelas");
      }
    });
  };

  return (
    <Card>
      <Heading as="h3" className="mb-4 text-left">Ambil Kelas</Heading>
      <div className="space-y-4">
        {isAdminView && (
          <div>
            <label className="mb-2 block text-sm font-medium">Pilih Mahasiswa</label>
            <select value={selectedMahasiswa} onChange={handleStudentChange} className="w-full rounded-lg border p-2">
              <option value="">Pilih Mahasiswa</option>
              {mahasiswa.map((item) => (
                <option key={item.id} value={item.id}>{item.nama} ({item.nim})</option>
              ))}
            </select>
          </div>
        )}
        {!isAdminView && selectedStudent && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Anda sedang mengelola kelas untuk <strong>{selectedStudent.nama}</strong>.
          </div>
        )}
        {selectedStudent && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Daftar Mata Kuliah</label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {mataKuliah.length === 0 ? (
                  <p>Belum ada mata kuliah yang tersedia.</p>
                ) : (
                  <ul className="space-y-1">
                    {mataKuliah.map((item) => (
                      <li key={item.id}>• {item.nama} ({item.sks || 0} SKS)</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Pilih Kelas</label>
              <div className="mb-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                Total SKS kelas terpilih: <strong>{selectedClassSks}</strong> / <strong>10</strong>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {kelas.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada kelas yang tersedia.</p>
                ) : (
                  kelas.map((item) => {
                    const isSelected = selectedClasses.includes(item.id);
                    const course = mataKuliah.find((courseItem) => Number(courseItem.id) === Number(item.mataKuliahId));
                    return (
                      <label key={item.id} className={`rounded-lg border p-3 ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleClassToggle(item)}
                          className="mr-2"
                        />
                        <span className="font-medium">{item.namaKelas || `Kelas #${item.id}`}</span>
                        <div className="mt-1 text-sm text-slate-600">
                          {course ? `${course.nama} (${course.sks || 0} SKS)` : "Mata kuliah tidak tersedia"}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <Heading as="h4" className="mb-3 text-left">Daftar Kelas Diambil</Heading>
              {savedClasses.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada kelas yang diambil.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-700">
                  {savedClasses.map((classId) => {
                    const display = getClassDisplay(classId);
                    return (
                      <li key={classId} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                        <span>{display.className}</span>
                        <span className="font-medium">{display.courseName} ({display.courseSks} SKS)</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
        <Button variant="primary" onClick={handleSubmit}>Simpan Pilihan Kelas</Button>
      </div>
    </Card>
  );
};

export default MahasiswaMataKuliah;
