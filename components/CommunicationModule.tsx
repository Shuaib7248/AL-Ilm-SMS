
import React, { useState } from 'react';
import { MOCK_NOTICES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Notice } from '../types';
import { Megaphone, Calendar, AlertTriangle, Info, Plus, X, Save, Trash2 } from 'lucide-react';

export const CommunicationModule: React.FC = () => {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newNotice, setNewNotice] = useState({
      title: '',
      content: '',
      type: 'General' as Notice['type']
  });

  const getNoticeIcon = (type: string) => {
    switch(type) {
      case 'Urgent': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'Event': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handlePost = (e: React.FormEvent) => {
      e.preventDefault();
      const notice: Notice = {
          id: Date.now().toString(),
          title: newNotice.title,
          content: newNotice.content,
          type: newNotice.type,
          date: new Date().toISOString().split('T')[0],
          issuedBy: 'Admin'
      };
      setNotices([notice, ...notices]);
      setIsModalOpen(false);
      setNewNotice({ title: '', content: '', type: 'General' });
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this notice?')) {
          setNotices(prev => prev.filter(n => n.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-indigo-600" /> {t('noticeBoard')}
        </h2>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> {t('postNotice')}
        </button>
      </div>

      <div className="grid gap-4">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${notice.type === 'Urgent' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                {getNoticeIcon(notice.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                  <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">{notice.date}</span>
                      <button 
                          onClick={() => handleDelete(notice.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete Notice"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
                <p className="text-slate-600 mt-2 leading-relaxed">{notice.content}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-slate-500">Issued By:</span> {notice.issuedBy}
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className={`font-medium ${notice.type === 'Urgent' ? 'text-rose-600' : 'text-slate-500'}`}>{t(notice.type.toLowerCase()) || notice.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('postNotice')}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handlePost} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('noticeTitle')}</label>
                          <input 
                              type="text" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newNotice.title}
                              onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('type')}</label>
                          <select 
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newNotice.type}
                              onChange={e => setNewNotice({...newNotice, type: e.target.value as any})}
                          >
                              <option value="General">{t('general')}</option>
                              <option value="Urgent">{t('urgent')}</option>
                              <option value="Event">{t('event')}</option>
                              <option value="Holiday">{t('holiday')}</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('noticeContent')}</label>
                          <textarea 
                              required
                              rows={4}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newNotice.content}
                              onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsModalOpen(false)}
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
