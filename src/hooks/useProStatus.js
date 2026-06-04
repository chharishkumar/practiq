import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export function useProStatus() {
  const [isGuest, setIsGuest]   = useState(false);
  const [isPro, setIsPro]       = useState(false);
  const [userId, setUserId]     = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        setIsGuest(true);
        setLoading(false);
        return;
      }

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, is_pro, pro_expires_at")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile) {
        setUserName(profile.full_name || session.user.email?.split("@")[0] || "");

        if (profile.is_pro && profile.pro_expires_at) {
          const expires = new Date(profile.pro_expires_at);
          if (expires > new Date()) setIsPro(true);
        }
      }

      setLoading(false);
    };

    check();
  }, []);

  return { isGuest, isPro, userId, userEmail, userName, loading };
}