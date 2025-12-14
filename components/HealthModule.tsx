
import React, { useState } from 'react';
import { MOCK_HEALTH_RECORDS, MOCK_STUDENTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { HealthRecord } from '../types';
import { Activity, Plus, Search, HeartPulse, FileText, Save, X } from 'lucide-react';

export const HealthModule: React.FC = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState<HealthRecord[]>(MOCK_HEALTH_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newRecord, setNewRecord] = useState({
      studentId: '',
      condition: '',
      treatment: '',
      severity: 'Low' as HealthRecord['severity'],
      remarks: ''
  });

  const handleAddRecord = (e: React.FormEvent) => {
      e.preventDefault();
      const student = MOCK_STUDENTS.find(s => s.id === newRecord.studentId);
      if(!student) return;

      const record: HealthRecord = {
          id: Date.now().toString(),
          studentId: student.id,
          studentName: student.name,
          date: new Date().toISOString().split('T')[0],
          condition: newRecord.condition,
          treatment: newRecord.treatment,
          severity: newRecord.severity,
          remarks: newRecord.remarks
      };
      setRecords([record, ...records]);
      setIsModalOpen(false);
      setNewRecord({ studentId: '', condition: '', treatment: '', severity: 'Low', remarks: '' });
  };

  const getSeverityColor = (severity: string) => {
      switch(severity) {
          case 'High': return 'bg-rose-100 text-rose-800 border-rose-200';
          case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
          default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-500" /> {t('healthRecords')}
         </h2>
         <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium"
         >
           <Plus className="w-4 h-4" /> {t('addRecord')}
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {records.map(rec => (
             <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
                 <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-bold text-slate-900">{rec.studentName}</h3>
                         <span className={`px-2 py-0.5 rounded text-xs border font-medium ${getSeverityColor(rec.severity)}`}>
                             {t(rec.severity.toLowerCase()) || rec.severity}
                         </span>
                     </div>
                     <p className="text-sm text-slate-600 mb-2"><span className="font-medium">{t('condition')}:</span> {rec.condition}</p>
                     <p className="text-sm text-slate-500"><span className="font-medium">{t('treatment')}:</span> {rec.treatment}</p>
                 </div>
                 <div className="md:text-right flex flex-col justify-between">
                     <span className="text-xs text-slate-400">{rec.date}</span>
                     <p className="text-sm text-slate-500 italic mt-2">"{rec.remarks}"</p>
                 </div>
             </div>
         ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('addRecord')}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleAddRecord} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('studentInfo')}</label>
                          <select 
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newRecord.studentId}
                              onChange={e => setNewRecord({...newRecord, studentId: e.target.value})}
                              required
                          >
                              <option value="">Select Student</option>
                              {MOCK_STUDENTS.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.classGrade})</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">{t('condition')}</label>
                              <input 
                                  type="text" required
                                  placeholder="e.g. Fever"
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  value={newRecord.condition}
                                  onChange={e => setNewRecord({...newRecord, condition: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">{t('severity')}</label>
                              <select 
                                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                  value={newRecord.severity}
                                  onChange={e => setNewRecord({...newRecord, severity: e.target.value as any})}
                              >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('treatment')}</label>
                          <input 
                              type="text" required
                              placeholder="e.g. First aid given"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newRecord.treatment}
                              onChange={e => setNewRecord({...newRecord, treatment: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                          <textarea 
                              rows={2}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newRecord.remarks}
                              onChange={e => setNewRecord({...newRecord, remarks: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                              {t('cancel')}
                          </button>
                          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-2">
                              <Save className="w-4 h-4" /> {t('save')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
