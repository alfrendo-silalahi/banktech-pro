import { useState } from "react";

export const Navbar = () => {
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
      <nav className="top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 transition-colors">
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

          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              BankTech Pro
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by Group 5
            </p>
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
              Musharof
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
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                  Profile
                </a>
                <a
                  href="#logout"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Optional Sidebar */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md z-40 transition">
          <div className="p-6 text-lg font-bold text-gray-800 dark:text-white">
            Sidebar Menu
          </div>
          <ul className="px-6 space-y-2">
            <li>
              <a
                href="#dashboard"
                className="block py-2 hover:text-blue-600 text-gray-700 dark:text-gray-200"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#settings"
                className="block py-2 hover:text-blue-600 text-gray-700 dark:text-gray-200"
              >
                Settings
              </a>
            </li>
          </ul>
        </aside>
      )}
    </>
  );
};

export default Navbar;
