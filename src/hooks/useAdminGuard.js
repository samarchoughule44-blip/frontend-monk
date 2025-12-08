import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function useAdminGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) navigate("/admin/login");
    }

    check();
  }, []);
}
