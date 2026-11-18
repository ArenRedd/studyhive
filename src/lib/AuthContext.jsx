import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const getInitialAuthState = () => {
  try {
    return localStorage.getItem('studyhive_auth') === 'true';
  } catch {
    return false;
  }
};

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('studyhive_user');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { email: 'student@annauniv.edu', name: 'Student' };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);
  const [user, setUser] = useState(getInitialUser);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'studyhive', public_settings: {} });

  useEffect(() => {
    const isAuth = getInitialAuthState();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setUser(getInitialUser());
    }
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem('studyhive_auth', 'true');
      const u = userData || { email: 'student@annauniv.edu', name: 'Student' };
      localStorage.setItem('studyhive_user', JSON.stringify(u));
      setUser(u);
    } catch {}
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      localStorage.removeItem('studyhive_auth');
      localStorage.removeItem('studyhive_user');
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const checkUserAuth = async () => {
    setIsAuthenticated(getInitialAuthState());
    return getInitialAuthState();
  };

  const checkAppState = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        login,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
