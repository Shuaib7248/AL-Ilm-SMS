import React from 'react';
import { 
  Users, 
  Banknote, 
  Bed, 
  BookOpen 
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  students: Student[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const { t } = useLanguage();

  // Calculate real-time stats
  const totalStudents = students.length;
  const boarders = students.filter(s => s.isBoarder).length;
  const totalDue = students.reduce((acc, curr) => acc + curr.fees.amountDue, 0);
  const hifzStudents = students.filter(s => s.madrasaLevel === 'Hifz').length;

  const stats = [
    { label: "totalStudents", value: totalStudents, trend: "12%", trendUp: true, icon: Users, color: "bg-blue-500" },
    { label: "feesPending", value: `₹${totalDue.toLocaleString()}`, trend: "5%", trendUp: false, icon: Banknote, color: "bg-amber-500" },
    { label: "hostelOccupancy", value: boarders, trend: "Full", trendUp: true, icon: Bed, color: "bg-purple-500" },
    { label: "hifzStudents", value: hifzStudents, trend: "8 new", trendUp: true, icon: BookOpen, color: "bg-emerald-500" },
  ];

  // Mock data for charts
  const attendanceData = [
    { name: 'Mon', school: 92, madrasa: 95 },
    { name: 'Tue', school: 94, madrasa: 93 },
    { name: 'Wed', school: 91, madrasa: 96 },
    { name: 'Thu', school: 88, madrasa: 90 },
    { name: 'Fri', school: 85, madrasa: 85 },
  ];

  const feeData = [
    { name: t('paid'), value: students.filter(s => s.fees.status === 'Paid').length },
    { name: t('due'), value: students.filter(s => s.fees.status === 'Due').length },
    { name: t('overdue'), value: students.filter(s => s.fees.status === 'Overdue').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t('weeklyAttendance')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="school" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('school')} />
                <Bar dataKey="madrasa" fill="#10b981" radius={[4, 4, 0, 0]} name={t('madrasa')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t('feeCollection')}</h3>
          <div className="h-72 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {feeData.map((entry, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-slate-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};