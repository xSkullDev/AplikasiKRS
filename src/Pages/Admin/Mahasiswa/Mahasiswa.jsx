import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContexts";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { confirmUpdate, confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";
import { useMahasiswa, useStoreMahasiswa, useUpdateMahasiswa, useDeleteMahasiswa } from "@/Utils/Hooks/useMahasiswa";

const Mahasiswa = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: null, nim: "", nama: "" });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [search, setSearch] = useState("");

    const { user } = useAuthStateContext();

    // const { data: mahasiswa = [] } = useMahasiswa();
    const {
      data: result = { data: [], total: 0 },
      isLoading: isLoadingMahasiswa,
    } = useMahasiswa({
      q: search,
      _sort: sortBy,
      _order: sortOrder,
      _page: page,
      _limit: limit,
    });

    const { data: mahasiswa = [] } = result;
    const totalCount = result.total;
    const totalPages = Math.ceil(totalCount / limit);

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    const { mutateAsync: store } = useStoreMahasiswa();
    const { mutateAsync: update } = useUpdateMahasiswa();
    const { mutateAsync: remove } = useDeleteMahasiswa();

    const permissions = user?.permission ?? [];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleEdit = (mhs) => {
        setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        confirmDelete(async () => {
          try {
            await remove(id);
          } catch (error) {
            toastError("Gagal menghapus data mahasiswa");
          }
        });
    };

    const addMahasiswa = async (newData) => {
      try {
        const payload = {
          nim: newData.nim,
          nama: newData.nama,
          selectedKelasIds: [],
          selectedSks: 0,
        };

        await store(payload);
        return true;
      } catch (error) {
        toastError("Gagal menambahkan data mahasiswa");
        return false;
      }
    };

    const editMahasiswa = async (updatedData) => {
      try {
        await update({
          id: updatedData.id,
          data: {
            nim: updatedData.nim,
            nama: updatedData.nama,
          },
        });
        return true;
      } catch (error) {
        toastError("Gagal memperbarui data mahasiswa");
        return false;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!form.nim || !form.nama) {
        toastError("NIM dan Nama wajib diisi");
        return;
      }

      if (isEdit) {
        confirmUpdate(async () => {
          const success = await editMahasiswa(form);
          if (success) {
            toastSuccess("Data berhasil diperbarui");
            setForm({ id: null, nim: "", nama: "" });
            setIsEdit(false);
            setIsModalOpen(false);
          }
        });
      } else {
        const exists = mahasiswa.find((m) => m.nim === form.nim);
        if (exists) {
          return;
        }
        const success = await addMahasiswa(form);
        if (success) {
          setForm({ id: null, nim: "", nama: "" });
          setIsEdit(false);
          setIsModalOpen(false);
        }
      }
    };

    const openAddModal = () => {
        setIsModalOpen(true);
        setForm({ id: null, nim: "", nama: "" });
        setIsEdit(false);
    };

  return (
    <>
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
        {permissions.includes("mahasiswa.create") && (
          <Button onClick={openAddModal} variant="primary">Tambah Mahasiswa</Button>
        )}
    </div>

    {permissions.includes("mahasiswa.read") && (
      <>
        <div className="flex flex-wrap gap-2 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Cari nama/NIM..."
          className="border px-3 py-1 rounded flex-grow"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Sort By Field */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="name">Sort by Nama</option>
          <option value="nim">Sort by NIM</option>
          <option value="max_sks">Sort by Max SKS</option>
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        
        {/* Per Page */}
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={25}>25 / halaman</option>
        </select>
      </div>
            
            <MahasiswaTable
              data={mahasiswa}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
              isLoading={isLoadingMahasiswa}
      />
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">
          Halaman {page} dari {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      </>
    )}
    
    </Card>
    {isModalOpen && (
      <MahasiswaModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
		)}
    </>
    
  );
};

export default Mahasiswa;