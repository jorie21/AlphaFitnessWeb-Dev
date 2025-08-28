import {z} from "zod"

export const registerSchema = z.object({
    username: z.string().min(3, {message: "Atleast Min 3 character"}),
    email: z.string().email({message: "Enter Valid Email"}),
    CreatePassword: z.string().min(8, {message: "Password must be 8 character long"}),
    ConfirmPassword: z.string().min(8, {message: "Password must be 8 character long"}),
    agreeTerms: z.boolean().refine(val => val, {message:  "You must agree to the Terms of Service and Privacy Policy"})
}).refine((data) => data.CreatePassword === data.ConfirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})