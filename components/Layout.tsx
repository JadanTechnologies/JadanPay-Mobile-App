
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Home, History, LogOut, Briefcase, User as UserIcon, LayoutDashboard, Settings, Users, MessageSquare, Lock, Megaphone, CreditCard, LifeBuoy, Bell } from 'lucide-react';
import { SettingsService } from '../services/settingsService';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, onTabChange, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [appName, setAppName] = useState('JadanPay');

  useEffect(() => {
      SettingsService.getSettings().then(s => {
          setAppName(s.appName);
      });
  }, []);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => {
    const isActive = activeTab === id;
    return (
        <button
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-all duration-300 relative ${
            isActive ? 'text-green-600 dark:text-green-400 scale-105' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
             <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-medium">{label}</span>
          {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-green-600 rounded-full"></div>}
        </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black font-sans transition-colors duration-300">
      
      {/* Mobile Header (App Bar) */}
      <header className="flex-none bg-white dark:bg-black px-4 pt-12 pb-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-600/20">
                    {appName.charAt(0)}
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{appName}</h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Hello, {user.name.split(' ')[0]}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <button className="relative p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
                 </button>
                 <div className="relative" onClick={() => onTabChange('profile')}>
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff`} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                    />
                 </div>
            </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 scroll-smooth no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation Bar (Mobile Native Style) */}
      <nav className="flex-none fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-2 py-2 pb-safe z-30 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto w-full">
           {user.role === UserRole.ADMIN ? (
              <>
                <NavItem id="admin" icon={LayoutDashboard} label="Admin" />
                <NavItem id="admin-users" icon={Users} label="Users" />
                <NavItem id="admin-payments" icon={CreditCard} label="Pay" />
                <NavItem id="admin-settings" icon={Settings} label="Settings" />
                <button onClick={handleLogoutClick} className="flex flex-col items-center justify-center w-full py-1 gap-1 text-red-500 opacity-60">
                    <LogOut size={22} />
                    <span className="text-[10px]">Exit</span>
                </button>
              </>
           ) : (
              <>
                <NavItem id="dashboard" icon={Home} label="Home" />
                <NavItem id="history" icon={History} label="History" />
                
                {/* Center Action Button (Floating) */}
                <div className="relative -top-6">
                    <button 
                        onClick={() => onTabChange('dashboard')} 
                        className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-600/40 border-4 border-gray-50 dark:border-black hover:scale-105 active:scale-95 transition-all"
                    >
                        <CreditCard size={24} />
                    </button>
                </div>

                <NavItem id="support" icon={LifeBuoy} label="Help" />
                <NavItem id="profile" icon={UserIcon} label="Profile" />
              </>
           )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-2xl p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sign Out</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Are you sure you want to sign out of the app?</p>
            <div className="flex gap-3">
                <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm"
                >
                    Cancel
                </button>
                <button 
                    onClick={confirmLogout}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200"
                >
                    Sign Out
                </button>
            </div>
            </div>
        </div>
      )}

    </div>
  );
};
