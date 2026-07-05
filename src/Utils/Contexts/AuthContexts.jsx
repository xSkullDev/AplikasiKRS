import { createContext, useContext, useState } from "react";

const AuthStateContext = createContext({
  user: null,
  setUser: () => {},
});

const normalizeUser = (user) => {
  if (!user) return null;
  const permissions = user.permission ?? ([]);

  return {
    ...user,
    permission:
      permissions.length > 0
        ? permissions
        : user.role === "admin"
        ? [
            "mahasiswa.page",
            "mahasiswa.read",
            "mahasiswa.create",
            "mahasiswa.update",
            "mahasiswa.delete",
          ]
        : [],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(normalizeUser(JSON.parse(localStorage.getItem("user"))));

  const setUser = (user) => {
    const normalized = normalizeUser(user);
    _setUser(normalized);

    if (normalized) {
      localStorage.setItem("user", JSON.stringify(normalized));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthStateContext.Provider value={{ user, setUser }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => useContext(AuthStateContext);