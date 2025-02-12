import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // ✅ Load authentication state from localStorage on page refresh
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
    localStorage.setItem("auth", isAuthenticated);
    const storedUser = localStorage.getItem("user"); // Assuming user is stored in localStorage
    if (storedUser) {
      setUser("admin");
    }
  }, [isAuthenticated]);

  const login = (credentials, callback) => {
    if (credentials.username === "admin" && credentials.password === "password") {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true"); // ✅ Store login state
      localStorage.setItem("user", "admin"); // ✅ Store login state
      setUser(credentials.username);
      callback(); // Redirect to home
    } else {
      alert("Invalid credentials! Use admin/password.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
