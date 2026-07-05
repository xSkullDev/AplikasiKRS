import Button from "@/Pages/Admin/Components/Button";

const MataKuliahModal = ({
  isOpen,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
  mahasiswa,
  selectedMahasiswa,
  onMahasiswaToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</h2>
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-red-500">
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Nama Mata Kuliah</label>
              <input
                name="nama"
                value={form.nama}
                onChange={onChange}
                className="w-full rounded-lg border p-2"
                placeholder="Contoh: Pemrograman Mobile"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Jumlah SKS (opsional)</label>
              <input
                name="sks"
                type="number"
                min="0"
                value={form.sks}
                onChange={onChange}
                className="w-full rounded-lg border p-2"
                placeholder="Opsional"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={onChange}
              className="w-full rounded-lg border p-2"
              rows="3"
              placeholder="Deskripsi mata kuliah"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Pilih Mahasiswa yang Bisa Mengambil</label>
            <div className="grid gap-2 md:grid-cols-2">
              {mahasiswa.map((item) => (
                <label key={item.id} className="rounded-lg border p-3">
                  <input
                    type="checkbox"
                    checked={selectedMahasiswa.includes(item.id)}
                    onChange={() => onMahasiswaToggle(item.id)}
                    className="mr-2"
                  />
                  {item.nama} ({item.nim})
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="danger" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MataKuliahModal;
