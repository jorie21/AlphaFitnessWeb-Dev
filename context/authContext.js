"use client";
import { createContext, useContext, useState } from "react";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const { data } = supabase.auth.getSession();
    setSession(data.session);
  };

  const logOut = () => {
    setSession(null);
  };

  const SignIn = () => {

    
  };
  const SignUp = () => {
    
  };

  return (
    <AuthContext.Provider value={{ session, fetchSession, logOut, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
