import { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const isAuthenticated = user !== null;
  console.log('auth provider', isAuthenticated);

  // Login: hanya untuk demo login admin manual
  const login = (email, password) => {
    if (email === 'admin@mail.com' && password === 'password') {
      const userData = {
        id: 1,
        email: 'admin@mail.com',
        firstName: 'Administrator',
        lastName: 'Test',
        role: 'admin',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // ✅ Register: menerima nama depan, belakang, email, dan password
  const register = async (email, password, firstName = 'User', lastName = 'Demo') => {
    try {
      // Simulasi delay (seakan-akan memanggil API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now(),
        email,
        password, // di dunia nyata jangan simpan password langsung!
        firstName,
        lastName,
        role: 'user',
      };

      console.log('User registered:', newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
