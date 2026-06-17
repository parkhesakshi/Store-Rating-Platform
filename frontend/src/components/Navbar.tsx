import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Star } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 font-bold text-2xl"
          >
            <Star size={28} />
            StoreRating
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600">
              Features
            </a>

            <a href="#stats" className="text-gray-700 hover:text-indigo-600">
              Stats
            </a>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              Register/Login
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-5 flex flex-col gap-4">
            <a href="#features">Features</a>
            <a href="#stats">Stats</a>

            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;