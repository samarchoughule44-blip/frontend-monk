import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import useAdminGuard from "@/hooks/useAdminGuard";

export default function EditDesign() {
  useAdminGuard();

  const { id } = useParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadDesign();
  }, []);

  async function loadDesign() {
    const { data } = await supabase
      .from("designs")
      .select("*")
      .eq("id", id)
      .single();

    setDesign(data);
  }

  async function uploadImage() {
    if (!file) return design.image_url;

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) return design.image_url;

    const { data: publicData } = supabase.storage
      .from("photos")
      .getPublicUrl(path);

    return publicData.publicUrl;
  }

  async function saveChanges(e) {
    e.preventDefault();

    const img = await uploadImage();

    const { error } = await supabase
      .from("designs")
      .update({
        title: design.title,
        category: design.category,
        price_min: design.price_min,
        price_max: design.price_max,
        image_url: img,
      })
      .eq("id", id);

    if (!error) navigate("/admin/designs");
  }

  if (!design) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Design</h1>

      <form onSubmit={saveChanges} className="space-y-4 bg-white shadow p-6 rounded">

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={design.title}
            onChange={(e) => setDesign({ ...design, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={design.category}
            onChange={(e) =>
              setDesign({ ...design, category: e.target.value })
            }
          >
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Full Home</option>
          </select>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-medium mb-1">Min Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={design.price_min}
              onChange={(e) =>
                setDesign({ ...design, price_min: e.target.value })
              }
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Max Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={design.price_max}
              onChange={(e) =>
                setDesign({ ...design, price_max: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Change Image</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <img
          src={file ? URL.createObjectURL(file) : design.image_url}
          className="w-40 h-28 object-cover rounded border"
        />

        <button className="w-full bg-[#c8875e] text-white p-3 rounded hover:bg-[#ad6a47]">
          Save Changes
        </button>
      </form>
    </div>
  );
}
