import AdminRoute from "@/components/auth/AdminRoute";

export default function AdminLayout({ children }) {
  return (
    <AdminRoute>
      {children}
    </AdminRoute>
  );
}