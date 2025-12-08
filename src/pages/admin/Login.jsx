import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr("Invalid credentials");
      return;
    }

    navigate("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4eee9]">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

        {err && <p className="text-red-600 text-sm mb-2 text-center">{err}</p>}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-ful bg-red-500 text-blue-400 p-2 rounded hover:bg-[#b07048]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
