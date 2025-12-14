
import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Student, AttendanceStatus, MadrasaLevel } from '../types';
import { CalendarCheck, Sun, Moon, BookOpen, Save, Filter } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { t } = useLanguage();
  const [activeContext, setActiveContext] = useState<'school' | 'madrasa' | 'hostel'>('school');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filters
  const [filterClass, setFilterClass] = useState<string>('6');
  const [filterSection, setFilterSection] = useState<string>('A');
  const [filterLevel, setFilterLevel] = useState<string>(MadrasaLevel.HIFZ);
  const [filterBlock, setFilterBlock] = useState<string>('A');

  // Local state to track attendance changes before saving
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const getFilteredStudents = () => {
    return MOCK_STUDENTS.filter(student => {
      switch (activeContext) {
        case 'school':
          return student.classGrade === filterClass && student.section === filterSection;
        case 'madrasa':
          return student.madrasaLevel === filterLevel;
        case 'hostel':
          return student.isBoarder && (student.hostelRoom?.startsWith(filterBlock) || false);
        default:
          return false;
      }
    });
  };

  const filteredStudents = getFilteredStudents();
  
  const presentCount = Object.values(attendanceState).filter(s => s === AttendanceStatus.PRESENT).length;
  const absentCount = Object.values(attendanceState).filter(s => s === AttendanceStatus.ABSENT).length;

  const handleSave = () => {
    // API call would go here
    if (Object.keys(attendanceState).length === 0) {
      alert("No changes to save.");
      return;
    }
    alert(`Attendance saved for ${Object.keys(attendanceState).length} students on ${date}!`);
    setAttendanceState({});
  };

  const statusColors = {
    [AttendanceStatus.PRESENT]: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
    [AttendanceStatus.ABSENT]: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200',
    [AttendanceStatus.LATE]: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
    [AttendanceStatus.LEAVE]: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600" />
            {t('markAttendance')}
          </h2>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Context Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 mb-6 rtl:space-x-reverse overflow-x-auto">
          <button 
            onClick={() => setActiveContext('school')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeContext === 'school' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sun className="w-4 h-4" /> {t('schoolAttendance')}
          </button>
          <button 
            onClick={() => setActiveContext('madrasa')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeContext === 'madrasa' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" /> {t('madrasaAttendance')}
          </button>
          <button 
            onClick={() => setActiveContext('hostel')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeContext === 'hostel' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Moon className="w-4 h-4" /> {t('hostelAttendance')}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600 mr-2">Filters:</span>
          
          {activeContext === 'school' && (
            <>
               <select 
                 className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
                 value={filterClass}
                 onChange={(e) => setFilterClass(e.target.value)}
               >
                 <option value="5">{t('classLabel')} 5</option>
                 <option value="6">{t('classLabel')} 6</option>
                 <option value="7">{t('classLabel')} 7</option>
                 <option value="8">{t('classLabel')} 8</option>
               </select>
               <select 
                 className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
                 value={filterSection}
                 onChange={(e) => setFilterSection(e.target.value)}
               >
                 <option value="A">Section A</option>
                 <option value="B">Section B</option>
                 <option value="C">Section C</option>
               </select>
            </>
          )}
          {activeContext === 'madrasa' && (
             <select 
               className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
               value={filterLevel}
               onChange={(e) => setFilterLevel(e.target.value)}
             >
               {Object.values(MadrasaLevel).map(level => (
                 <option key={level} value={level}>{level}</option>
               ))}
             </select>
          )}
          {activeContext === 'hostel' && (
             <select 
               className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
               value={filterBlock}
               onChange={(e) => setFilterBlock(e.target.value)}
             >
               <option value="A">Block A</option>
               <option value="B">Block B</option>
               <option value="C">Block C</option>
             </select>
          )}
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">{t('studentInfo')}</th>
                  {activeContext === 'school' && <th className="px-6 py-4">{t('class')}</th>}
                  {activeContext === 'hostel' && <th className="px-6 py-4">{t('room')}</th>}
                  {activeContext === 'madrasa' && <th className="px-6 py-4">{t('madrasaLevel')}</th>}
                  <th className="px-6 py-4 text-center">{t('attendance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                   const currentStatus = attendanceState[student.id];
                   
                   return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm mr-3 rtl:mr-0 rtl:ml-3">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.admissionNumber}</p>
                          </div>
                        </div>
                      </td>
                      
                      {activeContext === 'school' && (
                        <td className="px-6 py-4 text-sm text-slate-600">{student.classGrade}-{student.section}</td>
                      )}
                      {activeContext === 'hostel' && (
                        <td className="px-6 py-4 text-sm text-slate-600">{student.hostelRoom || 'N/A'}</td>
                      )}
                      {activeContext === 'madrasa' && (
                        <td className="px-6 py-4 text-sm text-slate-600">{student.madrasaLevel}</td>
                      )}

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {[AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.LEAVE].map((status) => {
                            const isSelected = currentStatus === status;
                            const label = t(status.toLowerCase());
                            const colorClass = statusColors[status];
                            
                            return (
                              <button
                                key={status}
                                onClick={() => handleMark(student.id, status)}
                                className={`
                                  px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                                  ${isSelected ? colorClass + ' shadow-sm ring-1 ring-offset-1 ring-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                `}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Filter className="w-12 h-12 mb-2 opacity-20" />
            <p>No students found for the selected filters.</p>
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600">
             <span className="font-medium text-slate-900">{t('attendanceSummary')}:</span> {filteredStudents.length} Students 
             {Object.keys(attendanceState).length > 0 && (
                <span className="ml-2">
                   ({presentCount} Present, {absentCount} Absent)
                </span>
             )}
          </div>
          <button 
             onClick={handleSave}
             disabled={Object.keys(attendanceState).length === 0}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
             <Save className="w-4 h-4" /> {t('saveAttendance')}
          </button>
        </div>
      </div>
    </div>
  );
};