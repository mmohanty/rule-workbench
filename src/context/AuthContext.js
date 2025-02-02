import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // ✅ Load authentication state from localStorage on page refresh
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
    localStorage.setItem("auth", isAuthenticated);
  }, [isAuthenticated]);

  const login = (credentials, callback) => {
    if (credentials.username === "admin" && credentials.password === "password") {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true"); // ✅ Store login state
      callback(); // Redirect to home
    } else {
      alert("Invalid credentials! Use admin/password.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
