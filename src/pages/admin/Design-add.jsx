import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import useAdminGuard from "@/hooks/useAdminGuard";

export default function AddDesign() {
  useAdminGuard();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadImage() {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const path = `designs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage.from("photos").upload(path, file);

    if (error) {
      alert("Image upload failed!");
      return null;
    }

    const { data: publicData } = supabase.storage.from("photos").getPublicUrl(path);
    return publicData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const imageURL = await uploadImage();

    const { error } = await supabase.from("projects").insert([
      {
        title,
        category,
        pricing: `${priceMin} - ${priceMax}`,
        thumbnail_url: imageURL,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error adding project");
      console.log(error);
      return;
    }

    navigate("/admin/designs");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">

        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          ➕ Add New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-gray-700 font-medium block mb-1">Project Title</label>
            <input
              className="w-full bg-gray-50 border focus:border-primary p-3 rounded-lg outline-none"
              placeholder="E.g. Luxury Living Room Design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium block mb-1">Category</label>
            <select
              className="w-full bg-gray-50 border focus:border-primary p-3 rounded-lg outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Full Home">Full Home</option>
            </select>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <label className="text-gray-700 font-medium block mb-1">Price Min</label>
              <input
                type="number"
                className="w-full bg-gray-50 border focus:border-primary p-3 rounded-lg outline-none"
                placeholder="₹150000"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                required
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-700 font-medium block mb-1">Price Max</label>
              <input
                type="number"
                className="w-full bg-gray-50 border focus:border-primary p-3 rounded-lg outline-none"
                placeholder="₹450000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-medium block mb-1">Project Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-gray-50 p-3 border rounded-lg"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          {file && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-52 object-cover rounded-xl border"
              />
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-[#ad6a47] transition"
          >
            {loading ? "Saving..." : "Save Project"}
          </button>

        </form>
      </div>
    </div>
  );
}
