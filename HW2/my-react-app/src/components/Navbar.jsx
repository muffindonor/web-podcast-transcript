/**
 * Navbar.jsx
 * Main navigation component for SoundScribe application.
 * Handles user authentication state and provides navigation links.
 * 
 * Features:
 * - Dynamic rendering based on authentication state
 * - Responsive navigation with brand logo
 * - Login/Register buttons for unauthenticated users
 * - Profile and Logout options for authenticated users
 * - Dark mode toggle integration
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import DarkModeToggle from './DarkModeToggle';
import { Mic, LogIn, UserPlus, UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  // Track authentication state
  const [user, setUser] = useState(null);

  /**
   * Set up Firebase authentication listener
   * Updates user state when authentication state changes
   * Cleans up listener on component unmount
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Handles user logout
   * Signs out user from Firebase authentication
   * Handles any potential errors during sign out
   */
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      {/* Brand logo and name */}
      <Link to="/" className="logo">
        <Mic size={24} className="text-blue-500" />
        <span>SoundScribe</span>
        <span className="text-2xl">📝</span>
      </Link>
     
      <div className="nav-links">
        {/* About page link - always visible */}
        <Link
          to="/about"
          className="hover:opacity-80 transition-opacity"
        >
          About Us
        </Link>

        {/* Conditional rendering based on authentication state */}
        {!user ? (
          // Authentication buttons for logged-out users
          <>
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <UserPlus size={18} />
              <span>Register</span>
            </Link>
          </>
        ) : (
          // User menu for authenticated users
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              <UserCircle size={18} />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Dark mode toggle - always visible */}
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;