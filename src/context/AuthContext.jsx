import { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Step 2: Create the Authentication Provider component
export function AuthProvider({ children }) {
  // State to track current user and authentication status
    const [user, setUser] = useState(null);

    useEffect(() => {
        // jalankan efek ini hanya sekali saat mount
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(savedUser);
    }, []);

    // Derived state - user is authenticated if user exists
    const isAuthenticated = user !== null;
    console.log('auth provider', isAuthenticated);

    // Login function - in real apps, this would call an API
    const login = (email, password) => {
        // Simple validation for learning purposes
        if (email === 'admin@mail.com' && password === 'password') {
        const userData = {
            id: 1,
            email: 'admin@mail.com',
            firstName: 'Administrator',
            lastName: 'Test',
            role: 'admin',
        };
        setUser(userData);
        localStorage.setItem('user', userData);
        return true; // Login successful
        }
        return false; // Login failed
    };

    // Logout function - clear user data
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Provide authentication state and functions to all children
    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated,
            login,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

// Step 3: Custom hook for easy access to auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}