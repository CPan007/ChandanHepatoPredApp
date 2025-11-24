import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../App';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-medical-600 p-1.5 rounded-lg flex-shrink-0">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">CHASEEE</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight pt-0.5 block">
                  Chandan Healthcare AI Smart Engine for Empowering Experience
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <UserIcon className="h-4 w-4" />
                  <span>Dr. {user.name}</span>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              location.pathname !== '/login' && (
                <Link to="/login">
                  <Button variant="primary">Physician Login</Button>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};