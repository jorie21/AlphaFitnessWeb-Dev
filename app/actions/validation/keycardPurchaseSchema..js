import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

export const keycardPurchaseSchema = z.object({
  userId: z.string().uuid(),
}).superRefine(async (data, ctx) => {
  const { userId } = data;

  // Fetch keycards for this user
  const { data: keycards, error } = await supabase
    .from("keycards")
    .select("status")
    .eq("user_id", userId);

  if (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Error checking your keycard status.",
    });
    return;
  }

  if (keycards && keycards.length > 0) {
    const keycardStatus = keycards.find(
      (k) =>
        k.status === "active" ||
        k.status === "pending" ||
        k.status === "expired"
    )?.status;

    if (keycardStatus === "active") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You already have an active keycard.",
      });
    } else if (keycardStatus === "pending") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Your payment is still pending confirmation.",
      });
    } else if (keycardStatus === "expired") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You have an expired keycard. Please renew it instead of purchasing again.",
      });
    }
  }
});
