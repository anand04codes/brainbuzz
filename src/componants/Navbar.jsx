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
    <header className="flex justify-between items-center px-6 py-3 shadow-md bg-white dark:bg-gray-900 text-[var(--text)]">
      <Link to="/" className="text-xl font-bold text-[var(--primary)]">Brain Buzz</Link>

      <nav className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium hover:underline">Home</Link>
        <Link to="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
        <Link to="/quiz" className="text-sm font-medium hover:underline">Quiz</Link>
        <Link to="/room" className="text-sm font-medium hover:underline">Room</Link>
        <Link to="/compiler" className="text-sm font-medium hover:underline">Compiler</Link>

        <button
          onClick={() => document.body.classList.toggle('dark')}
          className="text-sm font-medium hover:underline"
        >
          🌓
        </button>

        <div className="relative group">
          <img
            src={localPhoto || user?.photoURL || defaultAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border cursor-pointer transition"
          />

          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all z-50">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
