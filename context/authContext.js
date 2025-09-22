"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import tr from "zod/v4/locales/tr.cjs";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current session
  const fetchSession = async () => {
    setLoading(true); // start loading
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error(error.message || "Failed to fetch session.");
        setError(error);
        setLoading(false);
        return null;
      }

      setSession(data.session);
      setUser(data.session?.user || null);
      setError(null);
      console.log("Current session:", data.session);
      return data.session;
    } catch (err) {
      console.error("Session fetch failed:", err);
      toast.error("Unexpected error fetching session.");
      setError(err);
      return null;
    } finally {
      setLoading(false); // always stop loading
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in.");
        setError(error);
        return { data: null, error };
      }

      setSession(data.session);
      setUser(data.user);
      setError(null);

      toast.success("Signed in successfully!");
      return { data, error: null };
    } catch (err) {
      console.error("Sign in failed:", err);
      setError(err);
      toast.error("Unexpected error during sign in.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (username, email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Failed to sign up.");
        setError(error);
        return { data: null, error };
      }


      setError(null);
      toast.success("Account created! Check your email to confirm.");
      return { data, error: null };
    } catch (err) {
      console.error("Sign up failed:", err);
      setError(err);
      toast.error("Unexpected error during sign up.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message || "Failed to sign out.");
        setError(error);
        return { error };
      }

      setSession(null);
      setUser(null);
      setError(null);

      toast("Signed out.");
      return { error: null };
    } catch (err) {
      console.error("Sign out failed:", err);
      setError(err);
      toast.error("Unexpected error during sign out.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed");
        return;
      }

      toast("Redirecting to Google...");
      console.log("OAuth data:", data);
    } catch (err) {
      toast.error(err.message || "Unexpected error during Google sign-in");
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Facebook sign-in failed");
        return;
      }

      toast("Redirecting to Facebook...");
    } catch (error) {
      toast.error(err.message || "Unexpected error during Google sign-in");
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email.");
        return { data: null, error };
      }

      toast.success("Password reset email sent! Check your inbox.");
      return { data, error: null };
    } catch (err) {
      console.error("Password reset failed:", err);
      toast.error("Unexpected error during password reset.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      console.log("Auth state changed:", _event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    // State
    session,
    user,
    loading,
    error,

    // Session functions
    fetchSession,

    // Auth functions

    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    // Legacy
    setSession,
    logOut: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
