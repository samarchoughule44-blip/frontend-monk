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
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(path, file);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("photos")
      .getPublicUrl(path);

    return publicData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let imageURL = await uploadImage();

    const { error } = await supabase.from("designs").insert([
      {
        title,
        category,
        price_min: priceMin,
        price_max: priceMax,
        image_url: imageURL,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error adding design");
      console.log(error);
      return;
    }

    navigate("/admin/designs");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Design</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded">

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Full Home">Full Home</option>
          </select>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-medium mb-1">Min Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Max Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="w-40 h-28 object-cover rounded border"
          />
        )}

        <button
          className="w-full bg-[#c8875e] text-white p-3 rounded hover:bg-[#ad6a47]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Design"}
        </button>
      </form>
    </div>
  );
}
