import React, { useState } from 'react';
import { MOCK_ADMISSIONS } from '../constants';
import { AdmissionApplication, MadrasaLevel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { FilePlus, List, CheckCircle, XCircle, Calendar, Save, Clock } from 'lucide-react';

export const AdmissionRegister: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('list');
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(MOCK_ADMISSIONS);

  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    classGrade: '5',
    madrasaLevel: MadrasaLevel.NAZRA,
    guardian: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: AdmissionApplication = {
      id: (Date.now()).toString(),
      applicantName: `${form.firstName} ${form.lastName}`,
      guardianName: form.guardian,
      appliedClass: form.classGrade,
      madrasaLevel: form.madrasaLevel,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      contact: form.contact
    };
    
    setAdmissions([newApp, ...admissions]);
    alert(t('success'));
    setForm({
        firstName: '',
        lastName: '',
        dob: '',
        classGrade: '5',
        madrasaLevel: MadrasaLevel.NAZRA,
        guardian: '',
        contact: ''
    });
    setActiveTab('list');
  };

  const handleStatusChange = (id: string, newStatus: AdmissionApplication['status']) => {
    setAdmissions(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-100';
      case 'Rejected': return 'text-rose-600 bg-rose-100';
      case 'Interview': return 'text-purple-600 bg-purple-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white rounded-lg p-1 inline-flex border border-slate-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
            activeTab === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" /> {t('applicationsList')}
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
            activeTab === 'new' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FilePlus className="w-4 h-4" /> {t('newApplication')}
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">{t('applicantName')}</th>
                  <th className="px-6 py-4">{t('classLabel')}</th>
                  <th className="px-6 py-4">{t('madrasaLevel')}</th>
                  <th className="px-6 py-4">{t('applyDate')}</th>
                  <th className="px-6 py-4">{t('contact')}</th>
                  <th className="px-6 py-4">{t('status')}</th>
                  <th className="px-6 py-4 text-right rtl:text-left">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{app.applicantName}</p>
                        <p className="text-xs text-slate-500">{t('guardianName')}: {app.guardianName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.appliedClass}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.madrasaLevel}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.applicationDate}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {t(app.status.toLowerCase()) || app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left flex items-center justify-end gap-2">
                       {app.status === 'Pending' && (
                         <>
                           <button 
                             onClick={() => handleStatusChange(app.id, 'Interview')}
                             className="text-purple-500 hover:bg-purple-50 p-1.5 rounded transition-colors"
                             title={t('interview')}
                           >
                             <Calendar className="w-5 h-5"/>
                           </button>
                           <button 
                             onClick={() => handleStatusChange(app.id, 'Approved')}
                             className="text-emerald-500 hover:bg-emerald-50 p-1.5 rounded transition-colors"
                             title={t('approved')}
                           >
                             <CheckCircle className="w-5 h-5"/>
                           </button>
                           <button 
                             onClick={() => handleStatusChange(app.id, 'Rejected')}
                             className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors"
                             title={t('rejected')}
                           >
                             <XCircle className="w-5 h-5"/>
                           </button>
                         </>
                       )}
                       {app.status === 'Interview' && (
                         <>
                           <button 
                             onClick={() => handleStatusChange(app.id, 'Approved')}
                             className="text-emerald-500 hover:bg-emerald-50 p-1.5 rounded transition-colors"
                             title={t('approved')}
                           >
                             <CheckCircle className="w-5 h-5"/>
                           </button>
                           <button 
                             onClick={() => handleStatusChange(app.id, 'Rejected')}
                             className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-colors"
                             title={t('rejected')}
                           >
                             <XCircle className="w-5 h-5"/>
                           </button>
                         </>
                       )}
                       {(app.status === 'Approved' || app.status === 'Rejected') && (
                          <span className="text-xs text-slate-400 italic">No actions</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'new' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('newApplication')}</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('applicantName')}</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="First Name" 
                        value={form.firstName}
                        onChange={e => setForm({...form, firstName: e.target.value})}
                    />
                     <input 
                        type="text" 
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={e => setForm({...form, lastName: e.target.value})}
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('dob')}</label>
                <input 
                    type="date" 
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={form.dob}
                    onChange={e => setForm({...form, dob: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('classLabel')}</label>
                <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={form.classGrade}
                    onChange={e => setForm({...form, classGrade: e.target.value})}
                >
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('madrasaLevel')}</label>
                <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={form.madrasaLevel}
                    onChange={e => setForm({...form, madrasaLevel: e.target.value as MadrasaLevel})}
                >
                  {Object.values(MadrasaLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('guardianName')}</label>
                <input 
                    type="text" 
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={form.guardian}
                    onChange={e => setForm({...form, guardian: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact')}</label>
                <input 
                    type="tel" 
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="+91..." 
                    value={form.contact}
                    onChange={e => setForm({...form, contact: e.target.value})}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                <Save className="w-4 h-4" /> {t('submitApplication')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};