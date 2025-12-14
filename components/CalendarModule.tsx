
import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { CalendarEvent } from '../types';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, X, Save } from 'lucide-react';

export const CalendarModule: React.FC = () => {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Event' as CalendarEvent['type'],
    description: ''
  });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.start === dateStr);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.date,
        type: newEvent.type,
        description: newEvent.description
    };
    setEvents([...events, event]);
    setIsModalOpen(false);
    setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], type: 'Event', description: '' });
    alert("Event added to calendar!");
  };

  const getEventTypeColor = (type: string) => {
      switch(type) {
          case 'Holiday': return 'bg-rose-100 text-rose-800 border-rose-200';
          case 'Exam': return 'bg-amber-100 text-amber-800 border-amber-200';
          default: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" /> {t('calendar')}
         </h2>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
         >
            <Plus className="w-4 h-4" /> Add Event
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Calendar Grid */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-900">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
               <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-lg">←</button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-lg">→</button>
               </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-slate-500">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
               {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
               {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                  
                  return (
                     <div key={day} className={`min-h-[80px] border rounded-lg p-1 ${isToday ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'}`}>
                        <div className={`text-right text-xs mb-1 ${isToday ? 'font-bold text-indigo-700' : 'text-slate-500'}`}>{day}</div>
                        <div className="space-y-1">
                           {dayEvents.map(ev => (
                              <div key={ev.id} className={`text-[10px] truncate px-1 py-0.5 rounded border ${getEventTypeColor(ev.type)}`} title={ev.title}>
                                 {ev.title}
                              </div>
                           ))}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Upcoming List */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Clock className="w-5 h-5 text-indigo-500" /> {t('upcomingEvents')}
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[500px]">
               {events.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map(ev => (
                  <div key={ev.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                     <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                        <span className="text-xs font-bold uppercase">{new Date(ev.start).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold">{new Date(ev.start).getDate()}</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{ev.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{ev.description}</p>
                        <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getEventTypeColor(ev.type)}`}>
                           {t(ev.type.toLowerCase()) || ev.type}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Add New Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input 
                  type="text" required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('type')}</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                  >
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Exam">Exam</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
                <textarea 
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
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
