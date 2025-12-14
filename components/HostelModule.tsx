
import React, { useState } from 'react';
import { MOCK_HOSTEL_ROOMS, MOCK_LEAVE_REQUESTS, MOCK_OUTING_LOGS, MOCK_STUDENTS, MOCK_MESS_MENU } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { OutingLog, LeaveRequest } from '../types';
import { Bed, LogOut, Check, X, ClipboardList, Clock, ArrowRight, Save, Trash2, Utensils } from 'lucide-react';

export const HostelModule: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rooms' | 'leave' | 'outing' | 'mess'>('rooms');
  
  // State for data handling
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [outingLogs, setOutingLogs] = useState<OutingLog[]>(MOCK_OUTING_LOGS);
  
  const [isOutingModalOpen, setIsOutingModalOpen] = useState(false);
  const [newOuting, setNewOuting] = useState({
      studentName: '',
      purpose: '',
      timeOut: ''
  });

  const handleAddOuting = (e: React.FormEvent) => {
      e.preventDefault();
      const log: OutingLog = {
          id: Date.now().toString(),
          studentName: newOuting.studentName,
          date: new Date().toISOString().split('T')[0],
          timeOut: newOuting.timeOut,
          purpose: newOuting.purpose,
          status: 'Out'
      };
      setOutingLogs([log, ...outingLogs]);
      setIsOutingModalOpen(false);
      setNewOuting({ studentName: '', purpose: '', timeOut: '' });
  };

  const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
      setLeaveRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: status } : req
      ));
  };
  
  const handleReturnOuting = (id: string) => {
      setOutingLogs(prev => prev.map(log => 
          log.id === id ? { ...log, status: 'Returned', timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : log
      ));
  };

  const boarders = MOCK_STUDENTS.filter(s => s.isBoarder);

  return (
    <div className="space-y-6">
      {/* Tab Nav */}
      <div className="bg-white rounded-lg p-1 inline-flex border border-slate-200 shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'rooms' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bed className="w-4 h-4" /> {t('roomView')}
        </button>
        <button
          onClick={() => setActiveTab('mess')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'mess' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" /> {t('messMenu')}
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'leave' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LogOut className="w-4 h-4" /> {t('leaveRequests')}
        </button>
        <button
          onClick={() => setActiveTab('outing')}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'outing' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> {t('outingRegister')}
        </button>
      </div>

      {/* Rooms Overview */}
      {activeTab === 'rooms' && (
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_HOSTEL_ROOMS.map(room => {
             const isFull = room.occupied >= room.capacity;
             const percentage = (room.occupied / room.capacity) * 100;
             
             return (
              <div key={room.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800">{t('room')} {room.roomNumber} <span className="text-slate-400 font-normal">({t('block')} {room.block})</span></h4>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isFull ? t('full') : t('vacant')}
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                
                <div className="text-xs text-slate-500 mb-3">
                   {room.occupied} / {room.capacity} {t('occupied')}
                </div>

                <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                   {room.occupants.map((name, i) => (
                      <div key={i} title={name} className="h-8 w-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs text-indigo-700 font-bold cursor-help">
                         {name.charAt(0)}
                      </div>
                   ))}
                   {Array.from({length: room.capacity - room.occupied}).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8 w-8 rounded-full bg-slate-50 border-2 border-slate-200 border-dashed"></div>
                   ))}
                </div>
              </div>
             );
          })}
        </div>
      </section>
      )}

      {/* Mess Menu */}
      {activeTab === 'mess' && (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left rtl:text-right text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 font-bold text-slate-700">Day</th>
                        <th className="px-6 py-4 font-medium text-slate-600">{t('breakfast')}</th>
                        <th className="px-6 py-4 font-medium text-slate-600">{t('lunch')}</th>
                        <th className="px-6 py-4 font-medium text-slate-600">{t('dinner')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_MESS_MENU.map((menu, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-indigo-700">{menu.day}</td>
                            <td className="px-6 py-4 text-slate-600">{menu.breakfast}</td>
                            <td className="px-6 py-4 text-slate-600">{menu.lunch}</td>
                            <td className="px-6 py-4 text-slate-600">{menu.dinner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
      )}

      {/* Leave Requests */}
      {activeTab === 'leave' && (
      <section>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left rtl:text-right text-sm">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('studentInfo')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('date')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('reason')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('status')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600 text-right rtl:text-left">{t('actions')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {leaveRequests.map(req => (
                 <tr key={req.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-medium text-slate-900">{req.studentName}</td>
                   <td className="px-6 py-4 text-slate-600">{req.startDate} to {req.endDate}</td>
                   <td className="px-6 py-4 text-slate-600">{req.reason}</td>
                   <td className="px-6 py-4">
                     <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                         req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                         req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                         'bg-amber-100 text-amber-800'
                     }`}>
                       {t(req.status.toLowerCase()) || req.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right rtl:text-left">
                     {req.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                           <button 
                                onClick={() => handleLeaveAction(req.id, 'Approved')}
                                className="p-1.5 hover:bg-emerald-100 bg-emerald-50 text-emerald-600 rounded transition-colors" title="Approve"
                           >
                               <Check className="w-4 h-4"/>
                           </button>
                           <button 
                                onClick={() => handleLeaveAction(req.id, 'Rejected')}
                                className="p-1.5 hover:bg-rose-100 bg-rose-50 text-rose-600 rounded transition-colors" title="Reject"
                           >
                               <X className="w-4 h-4"/>
                           </button>
                        </div>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </section>
      )}

      {/* Outing Register */}
      {activeTab === 'outing' && (
      <section>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{t('outingRegister')}</h3>
              <button 
                onClick={() => setIsOutingModalOpen(true)}
                className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-900 transition-colors"
              >
                + {t('newOuting')}
              </button>
           </div>
           <table className="w-full text-left rtl:text-right text-sm">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('studentInfo')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('timeOut')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('timeIn')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('purpose')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600">{t('status')}</th>
                 <th className="px-6 py-4 font-medium text-slate-600 text-right">{t('actions')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {outingLogs.map(log => (
                 <tr key={log.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-medium text-slate-900">
                     {log.studentName}
                     <div className="text-xs text-slate-400">{log.date}</div>
                   </td>
                   <td className="px-6 py-4 text-slate-600 font-mono">
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> {log.timeOut}</span>
                   </td>
                   <td className="px-6 py-4 text-slate-600 font-mono">
                     {log.timeIn ? (
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> {log.timeIn}</span>
                     ) : (
                       <span className="text-slate-400">-</span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-slate-600">{log.purpose}</td>
                   <td className="px-6 py-4">
                     {log.status === 'Out' ? (
                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">
                         <ArrowRight className="w-3 h-3" /> {t('out')}
                       </span>
                     ) : (
                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                         <Check className="w-3 h-3" /> {t('returned')}
                       </span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-right">
                       {log.status === 'Out' && (
                           <button 
                                onClick={() => handleReturnOuting(log.id)}
                                className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors"
                           >
                               Mark Returned
                           </button>
                       )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </section>
      )}

      {/* New Outing Modal */}
      {isOutingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('newOuting')}</h3>
                      <button onClick={() => setIsOutingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleAddOuting} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('studentInfo')}</label>
                          <select 
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newOuting.studentName}
                              onChange={e => setNewOuting({...newOuting, studentName: e.target.value})}
                              required
                          >
                              <option value="">Select Student</option>
                              {boarders.map(s => (
                                  <option key={s.id} value={s.name}>{s.name} ({s.hostelRoom})</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('timeOut')}</label>
                          <input 
                              type="time" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newOuting.timeOut}
                              onChange={e => setNewOuting({...newOuting, timeOut: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('purpose')}</label>
                          <input 
                              type="text" 
                              required
                              placeholder="e.g. Market, Hospital"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newOuting.purpose}
                              onChange={e => setNewOuting({...newOuting, purpose: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsOutingModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                              {t('cancel')}
                          </button>
                          <button 
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
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
