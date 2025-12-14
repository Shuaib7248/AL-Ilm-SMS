
import React, { useState } from 'react';
import { MOCK_TICKETS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportTicket, UserRole } from '../types';
import { LifeBuoy, Plus, MessageSquare, AlertCircle, CheckCircle, Clock, X, Save } from 'lucide-react';

export const HelpDeskModule: React.FC = () => {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState<'all' | 'open'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'IT' as SupportTicket['category'],
    priority: 'Medium' as SupportTicket['priority'],
    description: ''
  });

  const filteredTickets = activeTab === 'all' ? tickets : tickets.filter(t => t.status === 'Open');

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      raisedBy: 'Current User', // In real app, this comes from auth context
      role: UserRole.TEACHER // Mock role
    };

    setTickets([ticket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: '', category: 'IT', priority: 'Medium', description: '' });
    alert("Support ticket raised successfully!");
  };

  const getPriorityColor = (p: string) => {
     switch(p) {
        case 'High': return 'text-rose-600 bg-rose-50 border-rose-200';
        case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
        default: return 'text-blue-600 bg-blue-50 border-blue-200';
     }
  };

  const getStatusIcon = (s: string) => {
     switch(s) {
        case 'Resolved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
        case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
        default: return <AlertCircle className="w-4 h-4 text-rose-500" />;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-indigo-600" /> {t('helpdesk')}
         </h2>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
         >
            <Plus className="w-4 h-4" /> {t('raiseTicket')}
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="flex border-b border-slate-100">
            <button 
               onClick={() => setActiveTab('all')}
               className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               All Tickets
            </button>
            <button 
               onClick={() => setActiveTab('open')}
               className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'open' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               Open Pending
            </button>
         </div>

         <div className="divide-y divide-slate-100">
            {filteredTickets.map(ticket => (
               <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ticket.category === 'IT' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                     {ticket.category === 'IT' ? 'IT' : 'MT'}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{ticket.subject}</h4>
                        <span className="text-xs text-slate-400">{ticket.date}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        <span className="text-slate-500">• {t('raisedBy')}: {ticket.raisedBy}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                        {getStatusIcon(ticket.status)} {t(ticket.status === 'In Progress' ? 'inProgress' : ticket.status.toLowerCase())}
                     </div>
                     <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                        <MessageSquare className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            ))}
            {filteredTickets.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                    No tickets found.
                </div>
            )}
         </div>
      </div>

      {/* Raise Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">{t('raiseTicket')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRaiseTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('subject')}</label>
                <input 
                  type="text" required
                  placeholder="Brief description of the issue"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTicket.subject}
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('category')}</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newTicket.category}
                    onChange={e => setNewTicket({...newTicket, category: e.target.value as any})}
                  >
                    <option value="IT">IT Support</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Admin">Administration</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('priority')}</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newTicket.priority}
                    onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})}
                  >
                    <option value="Low">{t('low')}</option>
                    <option value="Medium">{t('medium')}</option>
                    <option value="High">{t('high')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
                <textarea 
                  rows={4} required
                  placeholder="Detailed explanation..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                />
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
                  <Save className="w-4 h-4" /> Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
