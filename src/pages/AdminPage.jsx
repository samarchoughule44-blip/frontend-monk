import { useState } from "react";
import AdminAuth from "@/components/AdminAuth";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [session, setSession] = useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {!session ? (
        <AdminAuth onAuth={setSession} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}
