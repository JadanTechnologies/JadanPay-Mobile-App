
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Support } from './components/Support';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSettings } from './components/AdminSettings';
import { AdminUsers } from './components/AdminUsers';
import { AdminSupport } from './components/AdminSupport';
import { AdminStaff } from './components/AdminStaff';
import { AdminCommunication } from './components/AdminCommunication';
import { AdminPayments } from './components/AdminPayments';
import { ResellerZone } from './components/ResellerZone';
import { LandingPage } from './components/LandingPage';
import { UserProfile } from './components/UserProfile';
import { SplashScreen } from './components/SplashScreen';
import { User, UserRole } from './types';
import { MockDB } from './services/mockDb';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTxId, setSelectedTxId] = useState<string | undefined>(undefined);
  const [showLanding, setShowLanding] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Theme initialization
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Session Check
  useEffect(() => {
      const savedUserId = localStorage.getItem('JADANPAY_CURRENT_USER_ID');
      if (savedUserId && !user) {
          MockDB.getUsers().then(users => {
              const found = users.find(u => u.id === savedUserId);
              if (found) {
                  setUser(found);
                  setShowLanding(false);
              }
          });
      }
  }, []);

  const handleRefreshUser = async () => {
    if(!user) return;
    const updatedUserList = await MockDB.getUsers();
    const currentUser = updatedUserList.find(u => u.id === user.id);
    if(currentUser) setUser(currentUser);
  };

  const handleViewReceipt = (txId: string) => {
    setSelectedTxId(txId);
    setActiveTab('history');
  };

  const handleAuthSuccess = (u: User) => {
      setUser(u);
      localStorage.setItem('JADANPAY_CURRENT_USER_ID', u.id);
      if (u.role === UserRole.ADMIN) {
          setActiveTab('admin');
      } else {
          setActiveTab('dashboard');
      }
      setShowLanding(false);
  };

  if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // --- Mobile App Wrapper ---
  // Limits width on desktop to simulate phone, full width on mobile
  return (
    <div className="w-full h-full md:max-w-md md:mx-auto bg-white dark:bg-black md:shadow-2xl md:border-x border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {!user ? (
            showLanding ? (
                <LandingPage 
                    onGetStarted={() => setShowLanding(false)} 
                    onLogin={() => setShowLanding(false)}
                    toggleTheme={() => setIsDarkMode(!isDarkMode)}
                    isDarkMode={isDarkMode}
                />
            ) : (
                <Auth 
                    onAuthSuccess={handleAuthSuccess} 
                    onBack={() => setShowLanding(true)}
                />
            )
        ) : (
            <Layout 
                user={user} 
                activeTab={activeTab} 
                onTabChange={(tab) => { setActiveTab(tab); setSelectedTxId(undefined); }}
                onLogout={() => {
                    setUser(null);
                    localStorage.removeItem('JADANPAY_CURRENT_USER_ID');
                    setActiveTab('dashboard'); 
                    setShowLanding(true); 
                }}
            >
               {activeTab === 'dashboard' && (user.role === UserRole.ADMIN ? <AdminDashboard /> : <Dashboard user={user} refreshUser={handleRefreshUser} onViewReceipt={handleViewReceipt} />)}
               {activeTab === 'history' && <History user={user} highlightId={selectedTxId} />}
               {activeTab === 'profile' && <UserProfile user={user} onUpdate={handleRefreshUser} />}
               {activeTab === 'support' && <Support user={user} />}
               
               {/* Admin Routes */}
               {activeTab === 'admin' && <AdminDashboard />}
               {activeTab === 'admin-users' && <AdminUsers />}
               {activeTab === 'admin-payments' && <AdminPayments />}
               {activeTab === 'admin-settings' && <AdminSettings />}
               
               {/* Fallbacks */}
               {activeTab === 'reseller' && <ResellerZone />}
            </Layout>
        )}
    </div>
  );
}
