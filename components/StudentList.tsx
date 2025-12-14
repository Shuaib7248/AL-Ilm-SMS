import React, { useState } from 'react';
import { Student, MadrasaLevel } from '../types';
import { Search, Filter, MoreVertical, FileDown, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StudentProfileModal } from './StudentProfileModal';

interface StudentListProps {
  students: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { t } = useLanguage();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || student.classGrade === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Name', 'Admission No', 'Class', 'Section', 'Madrasa Level', 'Type', 'Fee Status', 'Contact'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => [
        `"${s.name}"`,
        `"${s.admissionNumber}"`,
        s.classGrade,
        s.section,
        s.madrasaLevel,
        s.isBoarder ? 'Boarder' : 'Day Scholar',
        s.fees.status,
        `"${s.contactEmail}"`
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'students_list.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800';
      case 'Due': return 'bg-amber-100 text-amber-800';
      case 'Overdue': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTranslatedStatus = (status: string) => {
    return t(status.toLowerCase()) || status;
  }

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="All">{t('allClasses')}</option>
              <option value="5">{t('class')} 5</option>
              <option value="6">{t('class')} 6</option>
              <option value="7">{t('class')} 7</option>
              <option value="8">{t('class')} 8</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none rtl:left-3 rtl:right-auto" />
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 font-medium"
          >
            <FileDown className="h-4 w-4" />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="px-6 py-4">{t('studentInfo')}</th>
              <th className="px-6 py-4">{t('class')}</th>
              <th className="px-6 py-4">{t('madrasa')}</th>
              <th className="px-6 py-4">{t('type')}</th>
              <th className="px-6 py-4">{t('feeStatus')}</th>
              <th className="px-6 py-4 text-right rtl:text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm mr-3 rtl:mr-0 rtl:ml-3">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.admissionNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {t('class')} {student.classGrade}-{student.section}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {student.madrasaLevel}
                  {student.madrasaLevel === MadrasaLevel.HIFZ && (
                    <span className="block text-xs text-slate-400">{t('juz')} {student.hifzProgress?.currentJuz}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${student.isBoarder ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {student.isBoarder ? t('boarding') : t('day')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.fees.status)}`}>
                    {getTranslatedStatus(student.fees.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right rtl:text-left">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          <p>No students found matching your criteria.</p>
        </div>
      )}
    </div>

    {selectedStudent && (
      <StudentProfileModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />
    )}
    </>
  );
};