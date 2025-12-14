
import React, { useState } from 'react';
import { MOCK_STAFF } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Staff } from '../types';
import { Briefcase, Phone, Mail, UserPlus, Search, Filter, Trash2, Edit, X, Save } from 'lucide-react';

export const StaffModule: React.FC = () => {
  const { t } = useLanguage();
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    department: '',
    contact: '',
    email: ''
  });
  
  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department,
      contact: newStaff.contact,
      email: newStaff.email,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      attendance: 100 // Default for new staff
    };

    setStaff([staffMember, ...staff]);
    setIsModalOpen(false);
    setNewStaff({ name: '', role: '', department: '', contact: '', email: '' });
    alert("Staff member added successfully!");
  };

  const handleDeleteStaff = (id: string) => {
    if(confirm('Are you sure you want to remove this staff member?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> {t('addStaff')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-slate-900 flex items-center gap-2">
             <Briefcase className="w-5 h-5 text-indigo-500" /> {t('staffDirectory')}
           </h3>
           <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
             {staff.length} Members
           </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-600">{t('staffName')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('role')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('department')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('contact')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('status')}</th>
                <th className="px-6 py-4 font-medium text-slate-600 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                           {s.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-medium text-slate-900">{s.name}</p>
                           <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.role}</td>
                  <td className="px-6 py-4 text-slate-600">{s.department}</td>
                  <td className="px-6 py-4 text-slate-600">
                     <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {s.contact}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {t(s.status === 'Active' ? 'active' : 'onLeave')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 p-1"><Edit className="w-4 h-4" /></button>
                    <button 
                      onClick={() => handleDeleteStaff(s.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">{t('addStaff')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('staffName')}</label>
                <input 
                  type="text" required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('role')}</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Teacher"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('department')}</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Science"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newStaff.department}
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('contact')}</label>
                  <input 
                    type="tel" required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newStaff.contact}
                    onChange={e => setNewStaff({...newStaff, contact: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2"
                >
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
