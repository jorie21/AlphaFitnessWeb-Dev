import { z } from "zod";

// Updated schema: Just validates the shape of the data, no Supabase queries
export const keycardPurchaseSchema = z.object({
  userId: z.string().uuid(), // Ensures userId is a valid UUID
  type: z.enum(["basic", "renew", "vip"]).optional(), // Optional, and must be one of these values
});