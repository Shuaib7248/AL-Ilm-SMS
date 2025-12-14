import React from 'react';
import { NavItem, UserRole } from '../types';
import { GraduationCap, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (id: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const { t, dir } = useLanguage();
  
  // Filter nav items based on role
  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(currentRole));
  
  const isRtl = dir === 'rtl';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}
        md:translate-x-0 md:static md:inset-0 shadow-2xl flex flex-col h-full
      `}>
        <div className="flex items-center justify-center h-16 bg-slate-800 border-b border-slate-700 gap-2 flex-shrink-0">
          <GraduationCap className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">Al-Ilm SMS</span>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-400 uppercase font-semibold">{t('currentPortal')}</p>
              <p className="text-sm font-medium text-emerald-400 mt-1">{currentRole}</p>
            </div>

            <nav className="space-y-1">
              {allowedItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all gap-3 duration-200
                      ${isActive 
                        ? 'bg-emerald-600 text-white shadow-lg translate-x-1' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{t(item.id)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-700 bg-slate-900 flex-shrink-0">
            <button 
              onClick={onLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors gap-3"
            >
              <LogOut className="h-5 w-5" />
              {t('signOut')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};