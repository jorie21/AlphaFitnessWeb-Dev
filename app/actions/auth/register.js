"use server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { registerSchema } from "../validation/registerValidation";
import { revalidatePath } from "next/cache";

export async function registerUser(prevState, formData) {
  const supabase = createServerSupabaseClient();
  

  const isReset = formData.get("_reset") === "true";
  if (isReset) {
    return { success: false, errors: {}, message: "" };
  }
    
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    CreatePassword: formData.get("CreatePassword"),
    ConfirmPassword: formData.get("ConfirmPassword"),
    agreeTerms: formData.get("agreeTerms") === "true" || formData.get("agreeTerms") === "on"
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors, message: "" };
  }

  const { username, email, CreatePassword } = parsed.data;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: CreatePassword,
      options: {
        data: {  
          username,
          display_name: username
        } 
      }
    });
    
    if (authError) {
      return { success: false, errors: {}, message: authError.message };
    }
    
    const userId = authData.user.id;

    const {error: insertError} = await supabase.from('users').insert([{
      id: userId,
      email,
      username,
    }])

    if (insertError) {
      return {
        success: false, 
        errors: {}, // Fixed typo: was 'error'
        message: insertError.message
      }
    }

    revalidatePath('/')

    return { success: true, errors: {}, message: "Account created successfully!" };

  } catch (error) {
    return { success: false, errors: {}, message: "Unexpected error occurred" };
  }
}