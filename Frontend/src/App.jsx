import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import LoginPage from "./pages/LoginPage";
import InmueblesPage from "./pages/InmueblesPage";
import AdminPropertyDetail from "./pages/AdminPropertyDetail";
import UserPropertyView from "./pages/UserPropertyView";
import AdminPropertyCreate from "./pages/AdminPropertyCreate";
import AdminPropertyImageForm from "./pages/AdminPropertyImageForm";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/inmuebles" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin/inmuebles"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <InmueblesPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inmuebles/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPropertyDetail />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inmuebles/:id/editar"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPropertyCreate mode="edit" />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inmuebles/:id/imagenes/nueva"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPropertyImageForm mode="create" />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inmuebles/:id/imagenes/:imageId/editar"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPropertyImageForm mode="edit" />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inmuebles/nuevo"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPropertyCreate />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inmuebles"
          element={
            <ProtectedRoute>
              <InmueblesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inmuebles/:id"
          element={
            <ProtectedRoute>
              <UserPropertyView />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
