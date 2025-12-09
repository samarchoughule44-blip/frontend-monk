import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Upload, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A3A4A] text-white transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => { navigate("/admin/dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/admin/dashboard") ? "bg-[#5F8F9F]" : "hover:bg-[#5F8F9F]/50"}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              onClick={() => { navigate("/admin/leads"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/admin/leads") ? "bg-[#5F8F9F]" : "hover:bg-[#5F8F9F]/50"}`}
            >
              <Users size={20} />
              Lead Enquiry
            </button>
            <button
              onClick={() => { navigate("/admin/designs/add"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/admin/designs/add") ? "bg-[#5F8F9F]" : "hover:bg-[#5F8F9F]/50"}`}
            >
              <Upload size={20} />
              Project Upload
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 div-cont" style={{ marginLeft: '0' }}>
        <style>{`
          @media (min-width: 576px) {
            .div-cont {
              margin-left: 290px !important;
            }
          }
        `}</style>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold ml-4 md:ml-0">Admin Panel</h1>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
