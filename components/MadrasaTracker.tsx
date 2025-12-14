
import React, { useState, useEffect } from 'react';
import { Student, MadrasaLevel, MadrasaLog } from '../types';
import { BookOpen, CheckCircle, Save, History, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MadrasaTrackerProps {
  students: Student[];
}

export const MadrasaTracker: React.FC<MadrasaTrackerProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { t } = useLanguage();

  // Local state for logs to simulate backend persistence
  const [logs, setLogs] = useState<MadrasaLog[]>([
    { id: '1', studentId: '1', date: '2024-03-10', sabaq: 'Surah Nuh: 1-5', sabaqPara: 'Page 560', manzil: 'Juz 1', quality: 'Good', currentJuz: 4, currentSurah: 'Nuh' },
    { id: '2', studentId: '1', date: '2024-03-09', sabaq: 'Surah Al-Maarij: 35-End', sabaqPara: 'Page 559', manzil: 'Juz 30', quality: 'Excellent', currentJuz: 4, currentSurah: 'Al-Maarij' }
  ]);

  // Form State
  const [form, setForm] = useState({
    sabaq: '',
    sabaqPara: '',
    manzil: '',
    currentJuz: 0,
    currentSurah: '',
    completedJuz: 0,
    quality: 'Good' as MadrasaLog['quality']
  });

  // Filter only Madrasa students
  const madrasaStudents = students.filter(s => s.madrasaLevel !== MadrasaLevel.NAZRA || s.madrasaLevel === MadrasaLevel.NAZRA);

  useEffect(() => {
    if (selectedStudent && selectedStudent.hifzProgress) {
        setForm(prev => ({
            ...prev,
            currentJuz: selectedStudent.hifzProgress!.currentJuz,
            currentSurah: selectedStudent.hifzProgress!.currentSurah,
            completedJuz: selectedStudent.hifzProgress!.completedJuz
        }));
    } else {
        // Reset or set default for non-hifz students if selected
        setForm(prev => ({ ...prev, currentJuz: 0, currentSurah: '', completedJuz: 0 }));
    }
  }, [selectedStudent]);

  const handleLogSubmit = () => {
    if (!selectedStudent) return;

    const newLog: MadrasaLog = {
      id: Date.now().toString(),
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      sabaq: form.sabaq,
      sabaqPara: form.sabaqPara,
      manzil: form.manzil,
      quality: form.quality,
      currentJuz: form.currentJuz,
      currentSurah: form.currentSurah,
      completedJuz: form.completedJuz
    };

    setLogs([newLog, ...logs]);
    
    // Update local student display (Mock update)
    if (selectedStudent.hifzProgress) {
        selectedStudent.hifzProgress.currentJuz = form.currentJuz;
        selectedStudent.hifzProgress.currentSurah = form.currentSurah;
        selectedStudent.hifzProgress.completedJuz = form.completedJuz;
    }

    // Reset fields except position tracking fields which usually persist or increment
    setForm(prev => ({ ...prev, sabaq: '', sabaqPara: '', manzil: '' }));
    alert(t('saveLog') + ' Successful!');
  };

  const studentLogs = logs.filter(l => l.studentId === selectedStudent?.id);

  const getQualityColor = (quality: string) => {
    switch(quality) {
        case 'Excellent': return 'text-emerald-600 bg-emerald-100';
        case 'Good': return 'text-blue-600 bg-blue-100';
        case 'Average': return 'text-amber-600 bg-amber-100';
        case 'Poor': return 'text-rose-600 bg-rose-100';
        default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-8rem)]">
      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-96 lg:h-auto">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">{t('halqahStudents')}</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {madrasaStudents.map(student => (
            <div 
              key={student.id}
              onClick={() => { setSelectedStudent(student); }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${selectedStudent?.id === student.id ? 'bg-emerald-50 border-emerald-200 border shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.madrasaLevel} • {t('class')} {student.classGrade}</p>
                </div>
                {student.hifzProgress && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {t('juz')} {student.hifzProgress.currentJuz}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[500px]">
        {selectedStudent ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500">{t('madrasaRecord')}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" /> {t('currentSabaq')}
                  </h4>
                  <p className="text-2xl font-bold text-blue-900 truncate">
                    {selectedStudent.hifzProgress?.currentSurah || 'N/A'}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {t('juz')} {selectedStudent.hifzProgress?.currentJuz || 0}
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" /> {t('completed')}
                  </h4>
                  <p className="text-2xl font-bold text-amber-900">
                    {selectedStudent.hifzProgress?.completedJuz || 0} <span className="text-sm font-normal text-amber-700">{t('juz')}</span>
                  </p>
                  <div className="w-full bg-amber-200 h-2 rounded-full mt-3">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${((selectedStudent.hifzProgress?.completedJuz || 0) / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Daily Tracker Form */}
              <div className="mb-8 border border-emerald-100 rounded-xl bg-emerald-50/50 p-5">
                 <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <Save className="w-5 h-5" /> {t('dailyTracker')}
                 </h3>
                 
                 {/* Section 1: Performance */}
                 <div className="mb-4">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-200 pb-1">{t('performance')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('sabaq')} (New Lesson)</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                placeholder="e.g. Surah Yasin 1-10"
                                value={form.sabaq}
                                onChange={(e) => setForm({...form, sabaq: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('sabaqPara')} (Revision)</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                placeholder="e.g. Last 5 pages"
                                value={form.sabaqPara}
                                onChange={(e) => setForm({...form, sabaqPara: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('manzil')} (Old Revision)</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                placeholder="e.g. Juz 1"
                                value={form.manzil}
                                onChange={(e) => setForm({...form, manzil: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-slate-600 mb-1">{t('quality')}</label>
                             <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={form.quality}
                                onChange={(e) => setForm({...form, quality: e.target.value as any})}
                             >
                                <option value="Excellent">{t('excellent')}</option>
                                <option value="Good">{t('good')}</option>
                                <option value="Average">{t('average')}</option>
                                <option value="Poor">{t('poor')}</option>
                             </select>
                        </div>
                    </div>
                 </div>

                 {/* Section 2: Progress Updates */}
                 <div className="mb-4">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase mb-3 border-b border-emerald-200 pb-1">{t('progressUpdate')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t('currentSurah')}</label>
                             <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={form.currentSurah}
                                onChange={(e) => setForm({...form, currentSurah: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-slate-600 mb-1">{t('juz')}</label>
                             <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={form.currentJuz}
                                onChange={(e) => setForm({...form, currentJuz: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-slate-600 mb-1">{t('juzCompleted')}</label>
                             <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                value={form.completedJuz}
                                onChange={(e) => setForm({...form, completedJuz: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                 </div>

                 <div className="flex justify-end">
                    <button 
                        onClick={handleLogSubmit}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <Save className="w-4 h-4" /> {t('saveLog')}
                    </button>
                 </div>
              </div>

              {/* History Log */}
              <div className="mb-6">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-500" /> {t('recentLogs')}
                 </h3>
                 <div className="space-y-3">
                    {studentLogs.length > 0 ? studentLogs.map(log => (
                        <div key={log.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                     <Calendar className="w-3 h-3" /> {log.date}
                                  </div>
                                  {(log.currentSurah || log.currentJuz) && (
                                      <div className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block">
                                          {log.currentSurah} • Juz {log.currentJuz}
                                      </div>
                                  )}
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityColor(log.quality)}`}>
                                 {t(log.quality.toLowerCase()) || log.quality}
                              </span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2 border-t border-slate-100">
                              <div>
                                 <span className="text-xs text-slate-400 uppercase font-bold block">{t('sabaq')}</span>
                                 <span className="text-slate-800 font-medium">{log.sabaq}</span>
                              </div>
                              <div>
                                 <span className="text-xs text-slate-400 uppercase font-bold block">{t('sabaqPara')}</span>
                                 <span className="text-slate-800">{log.sabaqPara || '-'}</span>
                              </div>
                              <div>
                                 <span className="text-xs text-slate-400 uppercase font-bold block">{t('manzil')}</span>
                                 <span className="text-slate-800">{log.manzil || '-'}</span>
                              </div>
                           </div>
                        </div>
                    )) : (
                        <p className="text-slate-400 italic text-sm">No recent logs found.</p>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p>{t('selectStudent')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
