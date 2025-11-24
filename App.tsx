import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { LiverPrediction } from './pages/LiverPrediction';
import { AuthContextType, User } from './types';

// Auth Context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} HepatoGuard AI. All rights reserved. For Research Use Only.
            </p>
        </div>
    </footer>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Check local storage on load (mock persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('hepato_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    const newUser: User = {
        id: '1', 
        name: 'Alexander Fleming', 
        role: 'physician',
        email 
    };
    setUser(newUser);
    localStorage.setItem('hepato_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hepato_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/prediction" 
                element={
                  <ProtectedRoute>
                    <LiverPrediction />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;