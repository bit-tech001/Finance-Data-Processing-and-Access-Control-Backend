import { useState, useEffect, useMemo } from "react";
import { setAuthToken } from "../utils/setAuthToken.js";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  // ✅ Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // Sync the API utility immediately on first load
      setAuthToken(token); 
      return { token, role, isAuthenticated: true };
    }
    return null;
  });

  // ✅ Sync Axios headers whenever the user state changes
  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
    } else {
      setAuthToken(null);
    }
  }, [user]);

  // 🔐 LOGIN
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setUser({
      token: data.token,
      role: data.role,
      isAuthenticated: true
    });
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Explicitly clear the user state which triggers the useEffect
    setUser(null);
  };

  // Memoize the value to prevent unnecessary re-renders of consuming components
  const value = useMemo(() => ({
    user,
    login,
    logout
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

