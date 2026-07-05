import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './App.css';

import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";

import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Kelas from "@/Pages/Admin/Kelas/Kelas";
import MataKuliah from "@/Pages/Admin/MataKuliah/MataKuliah";
import PageNotFound from "@/Pages/Error/PageNotFound";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Utils/Contexts/AuthContexts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role === "admin" ? "dashboard" : "matakuliah" : "dashboard"} />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAdmin>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute requireAdmin>
                <Mahasiswa />
              </ProtectedRoute>
            ),
          },
          {
            path: ":id",
            element: (
              <ProtectedRoute requireAdmin>
                <MahasiswaDetail />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "kelas",
        element: (
          <ProtectedRoute requireAdmin>
            <Kelas />
          </ProtectedRoute>
        ),
      },
      {
        path: "matakuliah",
        element: (
          <ProtectedRoute>
            <MataKuliah />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);