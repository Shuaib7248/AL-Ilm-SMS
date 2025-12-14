import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardStat } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const StatsCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => {
  const Icon = stat.icon;
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{t(stat.label) || stat.label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h3>
        {stat.trend && (
          <div className={`flex items-center mt-2 text-sm gap-1 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="font-medium">{stat.trend}</span>
            <span className="text-slate-400">{t('vsLastMonth')}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${stat.color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};