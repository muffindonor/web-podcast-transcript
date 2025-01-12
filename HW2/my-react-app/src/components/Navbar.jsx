import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import DarkModeToggle from './DarkModeToggle';
import { Mic, LogIn, UserPlus, UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Mic size={24} className="text-blue-500" />
        <span>SoundScribe</span>
        <span className="text-2xl">📝</span>
      </Link>
     
      <div className="nav-links">
        <Link
          to="/about"
          className="hover:opacity-80 transition-opacity"
        >
          About Us
        </Link>

        {!user ? (
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

        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;