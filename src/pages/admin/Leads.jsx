import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Eye, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import useAdminGuard from "@/hooks/useAdminGuard";

export default function Leads() {
  useAdminGuard();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLead, setSelectedLead] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, sortBy, sortOrder]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/api/leads?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const response = await fetch(`${API}/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await fetch(`${API}/api/leads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-purple-100 text-purple-800",
      converted: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lead Enquiries</h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name <SortIcon field="name" />
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email <SortIcon field="email" />
                    </div>
                  </th>

                  <th className="px-6 py-3">Phone</th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status <SortIcon field="status" />
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Date <SortIcon field="createdAt" />
                    </div>
                  </th>

                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-gray-600">{lead.phone}</td>

                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(lead._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => deleteLead(lead._id)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{lead.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">{lead.email}</p>
              <p className="text-sm text-gray-600 mb-2">{lead.phone}</p>

              <p className="text-xs text-gray-500 mb-3">
                {new Date(lead.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-between items-center">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateLeadStatus(lead._id, e.target.value)
                  }
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="text-blue-600"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
