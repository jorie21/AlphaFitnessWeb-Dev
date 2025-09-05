"use server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { registerSchema, loginSchema } from "../validation/registerValidation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { success } from "zod";

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
    agreeTerms:
      formData.get("agreeTerms") === "true" ||
      formData.get("agreeTerms") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "",
    };
  }

  const { username, email, CreatePassword } = parsed.data;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: CreatePassword,
      options: {
        data: {
          username,
          display_name: username,
        },
      },
    });

    if (authError) {
      return { success: false, errors: {}, message: authError.message };
    }

    const userId = authData.user.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        username,
      },
    ]);

    if (insertError) {
      return {
        success: false,
        errors: {}, // Fixed typo: was 'error'
        message: insertError.message,
      };
    }

    revalidatePath("/");

    return {
      success: true,
      errors: {},
      message: "Check your email to verify your account!",
    };
  } catch (error) {
    return { success: false, errors: {}, message: "Unexpected error occurred" };
  }
}

export async function loginUser(prevState, formData) {
  const supabase = createServerSupabaseClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, message: "Validation failed", errors, user: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email , password: parsed.data.password });


  if (error) {
    return { success: false, message: error.message, errors: {} };
  }

  return {
    success: true,
    message: "Login successful!",
    errors: {},
    user: data.user,
  };
}

export async function loginWithGoogle() {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (oAuthError) {
      console.error("Google OAuth error:", oAuthError);
      throw new Error(oAuthError.message);
    }

    // Redirect to Google OAuth
    if (data?.url) {
      redirect(data.url);
    }
  } catch (error) {
    console.error("Google OAuth error:", error);
    // In a real app, you might want to redirect to an error page
    // or handle this more gracefully
    throw error;
  }
}

export async function loginWithFacebook() {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        scopes: "email",
      },
    });

    if (oAuthError) {
      console.error("Facebook OAuth error:", oAuthError);
      throw new Error(oAuthError.message);
    }

    // Redirect to Facebook OAuth
    if (data?.url) {
      redirect(data.url);
    }
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    // In a real app, you might want to redirect to an error page
    // or handle this more gracefully
    throw error;
  }
}
