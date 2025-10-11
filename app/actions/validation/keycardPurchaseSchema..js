import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

export const keycardPurchaseSchema = z
  .object({
    userId: z.string().uuid(),
    type: z.enum(["basic", "renew"]).optional(),
  })
  .superRefine(async (data, ctx) => {
    const { userId, type } = data;

    // Fetch user's keycards
    const { data: keycards, error } = await supabase
      .from("keycards")
      .select("status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Error checking your keycard status.",
      });
      return;
    }

    const latest = keycards?.[0];

    // ✅ If user is buying a new keycard
    if (type === "basic") {
      if (!latest) return; // no previous keycard, allow purchase

      if (latest.status === "active") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You already have an active keycard.",
        });
      } else if (latest.status === "pending") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Your payment is still pending confirmation.",
        });
      } else if (latest.status === "expired") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "You have an expired keycard. Please renew it instead of purchasing again.",
        });
      }
    }

    // 🔁 If user is renewing
    if (type === "renew") {
      if (!latest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You don't have a keycard to renew.",
        });
      } else if (latest.status !== "expired") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You can only renew if your keycard is expired.",
        });
      }
    }
  });
