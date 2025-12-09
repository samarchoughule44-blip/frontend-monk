import useAdminGuard from "@/hooks/useAdminGuard";
import AdminLayout from "@/components/AdminLayout";

export default function Leads() {
  useAdminGuard();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Lead Enquiries</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600">No leads available</p>
      </div>
    </AdminLayout>
  );
}
