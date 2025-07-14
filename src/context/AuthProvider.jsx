import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { onAuthChange } from "../firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil token dari localStorage saat pertama load
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Auto redirect based on auth state
      if (firebaseUser) {
        // User is logged in
        if (location.pathname === "/signin" || location.pathname === "/") {
          navigate("/dashboard");
        }
      } else {
        // User is not logged in
        const allowedPaths = ["/signin", "/signup", "/seeder"];
        if (!allowedPaths.includes(location.pathname)) {
          navigate("/signin");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const login = (firebaseUser) => {
    setUser(firebaseUser);
    console.log("firebase user", firebaseUser);
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Clear user state immediately
      setUser(null);

      // Sign out from Firebase
      const { signOutUser } = await import("../firebase/auth");
      await signOutUser();

      // Clear any localStorage data
      localStorage.clear();

      // Force navigate to signin
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if Firebase signout fails
      setUser(null);
      localStorage.clear();
      navigate("/signin", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
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
