//hooks/useServiceStats.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useServiceStats(userId) {
  const [stats, setStats] = useState({
    memberships_count: 0,
    group_classes_count: 0,
    personal_training_count: 0,
    total_purchases: 0,
    months_member: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) {
        setStats({
          memberships_count: 0,
          group_classes_count: 0,
          personal_training_count: 0,
          total_purchases: 0,
          months_member: 0,
        });
        return;
      }

      setLoading(true);
      try {
        // Fetch total purchases
        const { data: statsData, error: statsError } = await supabase
          .from("service_purchase_stats")
          .select(
            "memberships_count, group_classes_count, personal_training_count, total_purchases"
          )
          .eq("user_id", userId)
          .maybeSingle();

        if (statsError) throw statsError;

        // Fetch membership months via RPC
        const { data: monthsData, error: monthsError } = await supabase.rpc(
          "get_membership_months",
          { p_user_id: userId }
        );
        if (monthsError) throw monthsError;

        setStats({
          ...statsData,
          months_member: typeof monthsData === "number" ? monthsData : 0,
        });
      } catch (err) {
        console.error("Error fetching service stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading };
}
