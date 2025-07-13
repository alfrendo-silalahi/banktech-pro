import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "banktech-pro__token";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  // Ambil token dari localStorage saat pertama load
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) setToken(savedToken);
  }, []);

  // Login: simpan token dan redirect ke dashboard
  const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
    navigate("/dashboard");
  };

  // Register: untuk simulasi, return true/false
  const register = async (email, password, firstName, lastName) => {
    // Simulasi call API
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyToken = `token-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, dummyToken);
        setToken(dummyToken);
        resolve(true);
      }, 1000); // Delay 1 detik seperti loading
    });
  };

  // Logout: hapus token
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate("/signin");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        register, // tambahkan register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
