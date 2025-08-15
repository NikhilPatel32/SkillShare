"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, getMyRequests } from '../utils/api';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      fetchPendingRequests();
    }
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const requests = await getMyRequests();
      const pendingCount = requests.filter(req => req.status === 'pending').length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setPendingRequestsCount(0);
    setIsMobileMenuOpen(false);
    router.replace('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white p-4 shadow-md mb-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SkillShare
        </Link>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            {user ? 'Browse Skills' : 'Home'}
          </Link>
          
          {user ? (
            <>
              <Link href="/post-skill" className="text-gray-700 hover:text-blue-600">
                Share Skill
              </Link>
              
              <Link href="/my-skills" className="text-gray-700 hover:text-blue-600">
                My Skills
              </Link>
              
              <Link href="/requests" className="relative text-gray-700 hover:text-blue-600">
                Requests
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                  </span>
                )}
              </Link>
              
              <Link href="/connections" className="text-gray-700 hover:text-blue-600">
                My Connections
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                 {user.name?.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle mobile menu"
        >
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-2 py-1"
              onClick={closeMobileMenu}
            >
              {user ? 'Browse Skills' : 'Home'}
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/post-skill" 
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Share Skill
                </Link>
                
                <Link 
                  href="/my-skills" 
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  My Skills
                </Link>
                
                <Link 
                  href="/requests" 
                  className="relative text-gray-700 hover:text-blue-600 px-2 py-1 flex items-center"
                  onClick={closeMobileMenu}
                >
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  href="/connections" 
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  My Connections
                </Link>
                
                <div className="flex items-center gap-4 px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                   {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-2 text-center"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
