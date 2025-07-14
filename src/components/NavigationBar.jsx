import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";


export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 transition-colors">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-white" />
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-white" />
              <span className="block w-5 h-0.5 bg-gray-800 dark:bg-white" />
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="src/assets/LOGO.svg"
                alt="BankTech Pro Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                BankTech Pro
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by Group 5
              </p>
            </div>
          </div>
        </div>

        {/* Right: Mode & Profile */}
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800"
            title="Toggle Dark Mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium text-gray-800 dark:text-white flex items-center"
            >
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
              <svg
                className="w-4 h-4 ml-1 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white border-t dark:border-gray-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-5 z-30 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="src/assets/LOGO.svg"
                alt="BankTech Pro Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                BankTech Pro
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by Group 5
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <a
              href="#transactions"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">Transactions</span>
            </a>
            
            <a
              href="#transfer"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="font-medium">Transfer Money</span>
            </a>
            
            <a
              href="#categories"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium">Categories</span>
            </a>
            
              <Link
                to="/activitylog"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Activity Log</span>
              </Link>

            {/* <a
              href="#activity"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Activity Log</span>
            </a> */}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Version 1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
