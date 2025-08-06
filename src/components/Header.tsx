import React from 'react';
import { Recycle, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onDashboard?: () => void;
  onBackToHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onDashboard, 
  onBackToHome 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={onBackToHome}>
            <div className="flex-shrink-0 flex items-center">
              <Recycle className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">GreenLoop</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={onDashboard}
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onLogin}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-emerald-600">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600">
                Contact
              </a>
              {currentUser ? (
                <>
                  <button
                    onClick={onDashboard}
                    className="text-left text-emerald-600 font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-left text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="text-left text-gray-700"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onLogin}
                    className="text-left bg-emerald-600 text-white px-4 py-2 rounded-lg w-fit"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;