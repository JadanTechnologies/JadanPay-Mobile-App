
import React, { useEffect, useState } from 'react';
import { Wifi, Smartphone, Zap, Tv, Globe } from 'lucide-react';
import { SettingsService } from '../services/settingsService';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');
  const [appName, setAppName] = useState('JadanPay');

  useEffect(() => {
    // Load Branding
    SettingsService.getSettings().then(s => {
        if (s.logoUrl) setLogoUrl(s.logoUrl);
        if (s.appName) setAppName(s.appName);
    });

    // Progress Bar Animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 800); // Slightly longer delay to admire the logo
          return 100;
        }
        return prev + 2; // Increment speed
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-green-600 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* 3D Scene Container */}
      <div className="perspective-container w-64 h-64 relative mb-12">
        <div className="w-full h-full relative preserve-3d animate-float">
            
            {/* Core Glowing Sphere / Logo Container */}
            <div className="absolute inset-0 m-auto w-28 h-28 bg-white/10 rounded-full blur-sm shadow-[0_0_50px_rgba(34,197,94,0.6)] animate-pulse z-10 flex items-center justify-center overflow-hidden border-2 border-green-500/50 backdrop-blur-sm">
               {logoUrl ? (
                   <img src={logoUrl} alt="Logo" className="w-full h-full object-cover p-1 rounded-full" />
               ) : (
                   <div className="text-white font-black text-5xl bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent">
                       {appName.charAt(0)}
                   </div>
               )}
            </div>
            
            {/* Orbiting Ring 1 */}
            <div className="absolute inset-0 m-auto w-48 h-48 border border-green-500/30 rounded-full preserve-3d animate-spin-slow">
                <div className="orbit-item" style={{ transform: 'translateY(-24px) translateX(24px) rotateX(90deg)' }}>
                    <div className="bg-black/50 p-2 rounded-full border border-green-500 backdrop-blur-md">
                        <Wifi size={24} className="text-green-400" />
                    </div>
                </div>
                <div className="orbit-item" style={{ transform: 'translateY(24px) translateX(-24px) rotateX(90deg)', top: 'auto', bottom: '0', left: 'auto', right: '0' }}>
                     <div className="bg-black/50 p-2 rounded-full border border-green-500 backdrop-blur-md">
                        <Smartphone size={24} className="text-green-400" />
                    </div>
                </div>
            </div>

            {/* Orbiting Ring 2 (Reverse & Tilted) */}
            <div className="absolute inset-0 m-auto w-60 h-60 border border-blue-500/30 rounded-full preserve-3d animate-spin-reverse" style={{ transform: 'rotateX(70deg) rotateY(20deg)' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full border border-blue-500 backdrop-blur-md animate-spin-slow">
                    <Zap size={24} className="text-blue-400" />
                </div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black/50 p-2 rounded-full border border-blue-500 backdrop-blur-md animate-spin-slow">
                    <Tv size={24} className="text-blue-400" />
                </div>
            </div>

             {/* Orbiting Ring 3 (Globe) */}
            <div className="absolute inset-0 m-auto w-32 h-32 border border-white/10 rounded-full preserve-3d animate-spin-slow" style={{ transform: 'rotateX(45deg) rotateY(-45deg)' }}>
                 <div className="absolute top-0 right-0 bg-black/50 p-1.5 rounded-full border border-white/20 backdrop-blur-md">
                    <Globe size={16} className="text-white" />
                </div>
            </div>

        </div>
      </div>

      {/* App Name & Loading */}
      <div className="relative z-10 text-center space-y-6">
         <h1 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
            {appName}
         </h1>
         <p className="text-gray-400 text-xs font-medium tracking-[0.2em] uppercase">Secure Mobile Payments</p>
         
         {/* Progress Bar */}
         <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden mx-auto relative">
            <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_#22c55e]"
                style={{ width: `${progress}%` }}
            ></div>
         </div>
         <p className="text-green-500/80 font-mono text-[10px]">{progress}%</p>
      </div>

    </div>
  );
};
