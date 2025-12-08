import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import useAdminGuard from "@/hooks/useAdminGuard";
import { Link } from "react-router-dom";

export default function Designs() {
  useAdminGuard();

  const [designs, setDesigns] = useState([]);

  useEffect(() => load(), []);

  async function load() {
    const { data } = await supabase.from("designs").select("*").order("id", { ascending: false });
    setDesigns(data || []);
  }

  async function remove(id) {
    await supabase.from("designs").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Designs</h1>
        <Link to="/admin/designs/add" className="bg-[#c8875e] text-white px-3 py-2 rounded">
          + Add Design
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {designs.map((d) => (
          <div key={d.id} className="bg-white shadow rounded overflow-hidden">
            <img src={d.image_url} className="h-40 w-full object-cover" />
            <div className="p-3">
              <h2 className="font-semibold">{d.title}</h2>
              <p className="text-sm text-gray-500">{d.category}</p>

              <div className="flex gap-2 mt-3">
                <Link
                  to={`/admin/designs/edit/${d.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(d.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
