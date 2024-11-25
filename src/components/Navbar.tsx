import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Video, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">InsightConvo</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/interview" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
              <Video className="h-5 w-5" />
              <span>Interview</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;