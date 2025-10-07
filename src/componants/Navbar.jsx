import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const defaultAvatar = '/local-assets/default-avatar.png'; // fallback image

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const [localPhoto, setLocalPhoto] = useState('');
  const navigate = useNavigate();

  // Load profile data from localStorage on first load and when it changes
  useEffect(() => {
    const loadProfileData = () => {
      if (user) {
        const userKey = `userProfile_${user.uid}`;
        try {
          const storedProfile = localStorage.getItem(userKey);
          if (storedProfile) {
            const profileData = JSON.parse(storedProfile);
            if (profileData.photoURL) {
              setLocalPhoto(profileData.photoURL);
            } else {
              setLocalPhoto(''); // Clear if no photo
            }
          } else {
            setLocalPhoto(''); // Clear if no data
          }
        } catch (error) {
          console.log('No local profile data found, using default avatar');
          setLocalPhoto('');
        }
      } else {
        setLocalPhoto(''); // Clear when no user
      }
    };

    // Load initially
    loadProfileData();

    // Listen for storage changes (when profile is updated from another tab/window)
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('userProfile_')) {
        loadProfileData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleProfileUpdate = () => {
      loadProfileData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  useEffect(() => {
    console.log('Navbar: Auth state changed', { user, loading, error });
    if (error) console.error('Navbar: Auth error', error);

    // Clear profile photo when user logs out
    if (!user && !loading) {
      setLocalPhoto('');
      console.log('Navbar: User logged out, cleared profile photo');
    }
  }, [user, loading, error]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/signin');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
            Brain Buzz
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/quiz"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Quiz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/room"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Room
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/compiler"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              Compiler
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => document.body.classList.toggle('dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              <span className="text-lg">🌓</span>
            </button>

            <div className="relative group">
              <img
                src={localPhoto || user?.photoURL || defaultAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer transition-all hover:scale-110 shadow-md"
              />

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 border border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <span>👤</span> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Link
                      to="/signin"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <span>🔐</span> Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <span>✨</span> Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span className="text-lg">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
