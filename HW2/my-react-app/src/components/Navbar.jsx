import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { Mic } from 'lucide-react';

const Navbar = () => {
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
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;