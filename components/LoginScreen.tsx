
import React from 'react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, ArrowRight, UserCog, BookOpen, Users, Calculator, Baby, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLanguage();

  const roles = [
    { role: UserRole.ADMIN, icon: UserCog, color: 'bg-slate-100 text-slate-600', hover: 'hover:border-slate-500 hover:bg-slate-50' },
    { role: UserRole.TEACHER, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600', hover: 'hover:border-indigo-500 hover:bg-indigo-50' },
    { role: UserRole.USTAD, icon: BookOpen, color: 'bg-emerald-100 text-emerald-600', hover: 'hover:border-emerald-500 hover:bg-emerald-50' },
    { role: UserRole.ACCOUNTANT, icon: Calculator, color: 'bg-amber-100 text-amber-600', hover: 'hover:border-amber-500 hover:bg-amber-50' },
    { role: UserRole.PARENT, icon: Users, color: 'bg-purple-100 text-purple-600', hover: 'hover:border-purple-500 hover:bg-purple-50' },
    { role: UserRole.STUDENT, icon: Baby, color: 'bg-blue-100 text-blue-600', hover: 'hover:border-blue-500 hover:bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Branding */}
        <div className="p-8 bg-indigo-600 text-center md:w-5/12 flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Al-Ilm SMS</h1>
          <p className="text-indigo-200 text-sm leading-relaxed mb-6">
            Enterprise-Grade School & Madrasa Management System
          </p>
          <div className="text-xs text-indigo-300 mt-auto">
            v2.0.0 &copy; 2024
          </div>
        </div>
        
        {/* Right Side - Roles */}
        <div className="p-8 md:w-7/12 bg-white">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('welcomeBack')}</h2>
          <p className="text-slate-500 mb-8 text-sm">{t('loginSubtitle')}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => onLogin(item.role)}
                  className={`flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl transition-all duration-200 group ${item.hover}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm group-hover:text-slate-900 capitalize">
                    {t(item.role.toLowerCase()) || item.role}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Need help? Contact <a href="#" className="text-indigo-600 hover:underline">Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
