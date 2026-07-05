import { useEffect, useState } from "react";

const KelasModal = ({ isOpen, onClose, onSubmit, form, onChange, mataKuliah, dosenList, mahasiswaList }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Buat Kelas</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Mata Kuliah</label>
            <select name="mataKuliahId" value={form.mataKuliahId} onChange={onChange} className="w-full rounded-lg border p-2">
              <option value="">Pilih Mata Kuliah</option>
              {mataKuliah.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Dosen</label>
            <select name="dosenId" value={form.dosenId} onChange={onChange} className="w-full rounded-lg border p-2">
              <option value="">Pilih Dosen</option>
              {dosenList.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-200 px-4 py-2">Batal</button>
          <button type="button" onClick={onSubmit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default KelasModal;
