import React, { useEffect, useState } from "react";
import useAdminGuard from "@/hooks/useAdminGuard";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  useAdminGuard();

  const [stats, setStats] = useState({
    designs: 0,
    leads: 0,
    consultations: 0,
    completed: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: d } = await supabase.from("designs").select("*", { count: "exact", head: true });
    const { count: l } = await supabase.from("leads").select("*", { count: "exact", head: true });
    const { count: c } = await supabase.from("consultations").select("*", { count: "exact", head: true });
    const { count: cp } = await supabase.from("completed_projects").select("*", { count: "exact", head: true });

    setStats({ designs: d, leads: l, consultations: c, completed: cp });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Designs" value={stats.designs} />
        <Card title="Total Leads" value={stats.leads} />
        <Card title="Consultations" value={stats.consultations} />
        <Card title="Completed Projects" value={stats.completed} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
