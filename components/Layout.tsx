
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, setActiveRole }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-xl">SH</div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Sahayak</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(UserRole[role])}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeRole === UserRole[role]
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        {children}
      </main>

      {/* Mobile Footer Simulation */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-400">
        &copy; 2024 Sahayak Technologies. Building for Bharat.
      </footer>
    </div>
  );
};

export default Layout;
