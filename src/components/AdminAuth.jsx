import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAuth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        onAuth(data.session);
      }
    });
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSession(data.session);
    onAuth(data.session);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    onAuth(null);
  };

  if (session?.user) {
    return (
      <div className="p-4">
        <p className="mb-2">Logged in as: <strong>{session.user.email}</strong></p>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={login} className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>

      <input
        className="w-full p-3 border rounded mb-3"
        placeholder="Admin Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded mb-3"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-primary text-white p-3 rounded">
        Login
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
