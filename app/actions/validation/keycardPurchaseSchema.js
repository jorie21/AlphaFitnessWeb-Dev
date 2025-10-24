// keycardPurchaseSchema.ts (or wherever it is)
import { z } from "zod";

export const keycardPurchaseSchema = z.object({
  userId: z.string(),                // keep your exact type (uuid if you had it)
  type: z.enum(["basic","renew","vip","check"]), // add "check"
});
