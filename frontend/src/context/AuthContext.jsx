/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null); // Holds user data (e.g., id, name, role)
    const [loading, setLoading] = useState(true);
  const [themeDark,setThemeDark] = useState(false)



  // Check for a token in localStorage to persist login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const theme = localStorage.getItem("themeDark");
    if (theme !== null && theme !== undefined && theme !== "") {
      try {
        setThemeDark(JSON.parse(theme));
      } catch {
        /* ignore */
      }
    } else if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ) {
      setThemeDark(true);
    }
    if (token && userData) {
      try {
        setAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (credentials) => {
    setAuthenticated(true);
    setUser(credentials)
    console.log("login called", credentials)

  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    setUser(null);
    setAuthenticated(false)
  };

  const themeChange = () => {
    localStorage.setItem("themeDark", JSON.stringify(!themeDark));
    setThemeDark(!themeDark);
  };

  return (
    <AuthContext.Provider value={{authenticated, user, login, logout, loading,themeChange,themeDark }}>
      {children}
    </AuthContext.Provider>
  );
};
