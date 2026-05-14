import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('fm_token');
    const storedUser = localStorage.getItem('fm_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (tokenVal, userVal) => {
    setToken(tokenVal);
    setUser(userVal);
    localStorage.setItem('fm_token', tokenVal);
    localStorage.setItem('fm_user', JSON.stringify(userVal));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fm_token');
    localStorage.removeItem('fm_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
