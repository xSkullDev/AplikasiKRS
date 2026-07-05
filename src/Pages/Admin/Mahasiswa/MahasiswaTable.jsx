import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContexts";

const MahasiswaTable = ({ data, onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext();
  const permissions = user?.permission ?? [];

  return (
    <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">NIM</th>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mhs, index) => (
                <tr
                  key={mhs.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="py-2 px-4">{mhs.nim}</td>
                  <td className="py-2 px-4">{mhs.nama}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onDetail(mhs.id)}
                    >
                        Detail
                    </Button>
                    {permissions.includes("mahasiswa.update") && (
                      <Button
                      size="sm"
                      variant="warning"
                      onClick={() => onEdit(mhs)}
                      >
                      Edit
                      </Button>
                    )}
                    {permissions.includes("mahasiswa.delete") && (
                      <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(mhs.id)}
                      >
                      Hapus
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  );
};

export default MahasiswaTable;