export const login = async (email, password) => {
  const validCredentials = [
    {
      email: "admin@mail.com",
      password: "admin123",
      permission: ["mahasiswa.page", "mahasiswa.read", "mahasiswa.create", "mahasiswa.update", "mahasiswa.delete"],
      role: "admin",
      name: "Admin",
    },
    {
      email: "admin@example.com",
      password: "password",
      permission: ["mahasiswa.page", "mahasiswa.read", "mahasiswa.create", "mahasiswa.update", "mahasiswa.delete"],
      role: "admin",
      name: "Admin",
    },
    {
      email: "mahasiswa@mail.com",
      password: "mahasiswa123",
      permission: ["matakuliah.read", "matakuliah.take"],
      role: "mahasiswa",
      name: "Andi",
      mahasiswaId: 1123,
    },
  ];

  const match = validCredentials.find(
    (account) => account.email === email && account.password === password
  );

  if (match) {
    return {
      email: match.email,
      name: match.name,
      role: match.role,
      permission: match.permission,
      mahasiswaId: match.mahasiswaId,
    };
  }

  throw new Error("Email atau password salah");
};
