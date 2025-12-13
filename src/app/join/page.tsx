"use client";


import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "/Users/quint/Documents/GitHub/playoff-fantasy-football/lib/supabaseClient";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Checking invite...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("No invite token provided.");
      return;
    }

    async function joinLeague() {
      // Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You must log in first.");
        return;
      }

      // Check if token exists and not used
      const { data: inviteData, error: inviteError } = await supabase
        .from("invites")
        .select("*")
        .eq("token", token)
        .eq("used", false)
        .single();

      if (inviteError || !inviteData) {
        setMessage("Invalid or already used invite.");
        return;
      }

      const leagueId = inviteData.league_id;

      // Add user to league_users
      const { error: joinError } = await supabase
        .from("league_users")
        .insert([{ league_id: leagueId, user_id: user.id }]);

      if (joinError) {
        setMessage("Failed to join league. Try again.");
        return;
      }

      // Mark invite as used
      await supabase
        .from("invites")
        .update({ used: true })
        .eq("id", inviteData.id);

      setMessage("Successfully joined league! Redirecting...");
      setTimeout(() => {
        router.push(`/league/${leagueId}`);
      }, 2000);
    }

    joinLeague();
  }, [searchParams, router]);

  return <div className="p-8 text-center">{message}</div>;
}