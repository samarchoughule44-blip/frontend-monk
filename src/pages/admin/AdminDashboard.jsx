import { useEffect, useState } from "react";
import useAdminGuard from "@/hooks/useAdminGuard";
import { supabase } from "@/lib/supabaseClient";
import AdminLayout from "@/components/AdminLayout";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  useAdminGuard();
  const [stats, setStats] = useState({ designs: 0, leads: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: d } = await supabase.from("designs").select("*", { count: "exact", head: true });
    const { count: l } = await supabase.from("leads").select("*", { count: "exact", head: true });
    setStats({ designs: d || 0, leads: l || 0 });
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Designs" value={stats.designs} color="bg-blue-500" />
        <StatCard title="Total Leads" value={stats.leads} color="bg-green-500" />
        <StatCard title="Consultations" value={0} color="bg-orange-500" />
        <StatCard title="Completed" value={0} color="bg-purple-500" />
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className={`${color} text-white p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3`}>
        <LayoutDashboard size={20} />
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
