
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { MadrasaTracker } from './components/MadrasaTracker';
import { AdmissionRegister } from './components/AdmissionRegister';
import { AcademicsModule } from './components/AcademicsModule';
import { HostelModule } from './components/HostelModule';
import { FinanceModule } from './components/FinanceModule';
import { AttendanceModule } from './components/AttendanceModule';
import { ReportsModule } from './components/ReportsModule';
import { LibraryModule } from './components/LibraryModule';
import { TransportModule } from './components/TransportModule';
import { CommunicationModule } from './components/CommunicationModule';
import { StaffModule } from './components/StaffModule';
import { HealthModule } from './components/HealthModule';
import { CalendarModule } from './components/CalendarModule';
import { HelpDeskModule } from './components/HelpDeskModule';
import { LoginScreen } from './components/LoginScreen';
import { MOCK_STUDENTS } from './constants';
import { UserRole, Language } from './types';
import { Bell, Search, Menu, Globe, ChevronRight } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { language, setLanguage, t, dir } = useLanguage();

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setActiveTab('dashboard');
  };

  if (!currentRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={MOCK_STUDENTS} />;
      case 'students':
        return <StudentList students={MOCK_STUDENTS} />;
      case 'madrasa':
        return <MadrasaTracker students={MOCK_STUDENTS} />;
      case 'admission':
        return <AdmissionRegister />;
      case 'academics':
        return <AcademicsModule />;
      case 'hostel':
        return <HostelModule />;
      case 'finance':
        return <FinanceModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'reports':
        return <ReportsModule />;
      case 'library':
        return <LibraryModule />;
      case 'transport':
        return <TransportModule />;
      case 'communication':
        return <CommunicationModule />;
      case 'staff':
        return <StaffModule />;
      case 'health':
        return <HealthModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'helpdesk':
        return <HelpDeskModule />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <h2 className="text-2xl font-bold mb-2 text-slate-300">{t('moduleUnderConstruction')}</h2>
            <p>{t('comingSoon', { module: t(activeTab) || activeTab })}</p>
          </div>
        );
    }
  };

  const isRtl = dir === 'rtl';

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans" dir={dir}>
      <Sidebar 
        currentRole={currentRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center text-sm text-slate-500 gap-2">
               <span className="font-medium hover:text-indigo-600 cursor-pointer">Home</span>
               <ChevronRight className="w-4 h-4" />
               <span className="font-semibold text-indigo-600 capitalize">{t(activeTab) || activeTab.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Language Switcher */}
            <div className="relative">
               <button 
                 onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                 className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
               >
                 <Globe className="h-4 w-4" />
                 <span className="uppercase font-medium">{language}</span>
               </button>
               
               {isLangMenuOpen && (
                 <>
                   <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                   <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20`}>
                      <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">English</button>
                      <button onClick={() => { setLanguage('ur'); setIsLangMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-[Inter]">اردو (Urdu)</button>
                      <button onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-[Inter]">العربية (Arabic)</button>
                   </div>
                 </>
               )}
            </div>

            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-700">Admin User</p>
                  <p className="text-xs text-slate-500 uppercase">{currentRole}</p>
               </div>
               <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                 AD
               </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
