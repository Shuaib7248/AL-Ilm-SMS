
import React, { useState } from 'react';
import { MOCK_EXAMS, MOCK_STUDENTS, MOCK_EXAM_RESULTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, PenTool, FileText, Printer, Trophy, BarChart2 } from 'lucide-react';
import { ExamResult } from '../types';

export const AcademicsModule: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exams' | 'marks' | 'results' | 'report'>('exams');
  const [selectedStudentReport, setSelectedStudentReport] = useState<string>('1');
  const [resultClassFilter, setResultClassFilter] = useState<string>('6');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  
  // Marks Entry State
  const [marksExamClass, setMarksExamClass] = useState('6');
  const [marksExamSubject, setMarksExamSubject] = useState('Math');
  const [studentMarks, setStudentMarks] = useState<Record<string, string>>({}); // studentId -> mark value
  
  // Local state for results to allow updates
  const [results, setResults] = useState<ExamResult[]>(MOCK_EXAM_RESULTS);

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentReport);

  // Filter exams based on selected class
  const filteredExams = MOCK_EXAMS.filter(e => e.classGrade === resultClassFilter || e.classGrade === 'All');

  // Filter results based on selected exam and class
  const filteredResults = results.filter(r => 
    (selectedExamId ? r.examId === selectedExamId : true) && 
    r.classGrade === resultClassFilter
  );

  const handleMarkChange = (studentId: string, value: string) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSaveMarks = () => {
    // Basic implementation: Create or update result entries
    const newResults: ExamResult[] = [];
    const examId = MOCK_EXAMS.find(e => e.classGrade === marksExamClass)?.id || '2'; 
    
    const students = MOCK_STUDENTS.filter(s => s.classGrade === marksExamClass);

    students.forEach(student => {
      const mark = parseInt(studentMarks[student.id] || '0');
      if (mark > 0) {
        // Check if result exists
        const existingResultIndex = results.findIndex(r => r.studentId === student.id && r.examId === examId);
        
        if (existingResultIndex >= 0) {
           const updatedResult = { ...results[existingResultIndex] };
           updatedResult.marks = { ...updatedResult.marks, [marksExamSubject]: mark };
           // Recalculate total/percentage simplified
           const values = Object.values(updatedResult.marks) as number[];
           updatedResult.total = values.reduce((a, b) => a + b, 0);
           updatedResult.percentage = updatedResult.total / (values.length * 100) * 100;
           // Simplified grading
           updatedResult.grade = updatedResult.percentage >= 90 ? 'A+' : updatedResult.percentage >= 80 ? 'A' : 'B';
           
           // Update in local state (immutably)
           setResults(prev => {
              const next = [...prev];
              next[existingResultIndex] = updatedResult;
              return next;
           });
        } else {
           // Create new result
           newResults.push({
             id: Date.now().toString() + Math.random(),
             examId: examId,
             studentId: student.id,
             studentName: student.name,
             classGrade: marksExamClass,
             marks: { [marksExamSubject]: mark },
             total: mark,
             percentage: mark, // assuming 1 subject for now
             grade: mark >= 90 ? 'A+' : mark >= 80 ? 'A' : 'B',
             rank: 0 // Rank calculation would happen after all marks are in
           });
        }
      }
    });

    if (newResults.length > 0) {
      setResults(prev => [...prev, ...newResults]);
    }
    
    alert(t('marksSaved'));
    setStudentMarks({});
  };

  const printReport = () => {
    const printContent = document.getElementById('report-card-content');
    if (printContent) {
        const win = window.open('', '', 'height=800,width=800');
        if (win) {
            win.document.write('<html><head><title>Report Card</title>');
            win.document.write('<script src="https://cdn.tailwindcss.com"></script>'); 
            win.document.write('</head><body class="bg-white p-8">');
            win.document.write(printContent.innerHTML);
            win.document.write('</body></html>');
            win.document.close();
            win.focus();
            setTimeout(() => {
                win.print();
                win.close();
            }, 500);
        }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Nav */}
      <div className="flex space-x-2 border-b border-slate-200 mb-6 rtl:space-x-reverse overflow-x-auto">
          <button 
            onClick={() => setActiveTab('exams')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'exams' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" /> {t('examSchedule')}
          </button>
          <button 
            onClick={() => setActiveTab('marks')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'marks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PenTool className="w-4 h-4" /> {t('marksEntry')}
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'results' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> {t('examResults')}
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'report' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> {t('reportCard')}
          </button>
      </div>

      {activeTab === 'exams' && (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> {t('examSchedule')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_EXAMS.map(exam => (
            <div key={exam.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-800">{exam.name}</h4>
                  <p className="text-sm text-slate-500">{t('classLabel')}: {exam.classGrade}</p>
                </div>
                <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {exam.date}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {exam.subjects.map(sub => (
                  <span key={sub} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {activeTab === 'marks' && (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-emerald-500" /> {t('marksEntry')}
        </h3>
        <div className="space-y-4">
           <div className="flex gap-2 mb-4">
              <select 
                className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm bg-white"
                value={marksExamClass}
                onChange={(e) => setMarksExamClass(e.target.value)}
              >
                  <option value="5">{t('classLabel')} 5</option>
                  <option value="6">{t('classLabel')} 6</option>
                  <option value="7">{t('classLabel')} 7</option>
                  <option value="8">{t('classLabel')} 8</option>
              </select>
              <select 
                className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm bg-white"
                value={marksExamSubject}
                onChange={(e) => setMarksExamSubject(e.target.value)}
              >
                  <option>Math</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>Arabic</option>
              </select>
           </div>
           
           <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left rtl:text-right text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                          <th className="px-4 py-2 font-medium text-slate-600">Student</th>
                          <th className="px-4 py-2 font-medium text-slate-600 text-right rtl:text-left">Marks (100)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {MOCK_STUDENTS.filter(s => s.classGrade === marksExamClass).map(s => (
                          <tr key={s.id}>
                              <td className="px-4 py-2">{s.name}</td>
                              <td className="px-4 py-2 text-right rtl:text-left">
                                  <input 
                                    type="number" 
                                    className="w-16 border border-slate-300 rounded px-2 py-1 text-right focus:ring-2 focus:ring-emerald-500 outline-none" 
                                    placeholder="0" 
                                    value={studentMarks[s.id] || ''}
                                    onChange={(e) => handleMarkChange(s.id, e.target.value)}
                                  />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
           </div>
           <button 
            onClick={handleSaveMarks}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
           >
              {t('saveMarks')}
           </button>
        </div>
      </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between gap-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-600" /> {t('examResults')}
            </h3>
            <div className="flex gap-2">
              <select 
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                value={resultClassFilter}
                onChange={(e) => {
                  setResultClassFilter(e.target.value);
                  setSelectedExamId(''); // Reset exam when class changes
                }}
              >
                <option value="5">{t('classLabel')} 5</option>
                <option value="6">{t('classLabel')} 6</option>
                <option value="7">{t('classLabel')} 7</option>
                <option value="8">{t('classLabel')} 8</option>
              </select>
              <select 
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">{t('selectExam')}</option>
                {filteredExams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-white text-slate-500 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 font-semibold text-center w-16">#</th>
                      <th className="px-6 py-4 font-semibold">{t('studentInfo')}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('totalMarks')}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('percentage')}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('grade')}</th>
                      <th className="px-6 py-4 font-semibold text-center">{t('status')}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredResults.length > 0 ? (
                      filteredResults.sort((a,b) => a.rank - b.rank).map((result) => (
                        <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 text-center">
                              {result.rank === 1 ? (
                                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold mx-auto">1</div>
                              ) : result.rank === 2 ? (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold mx-auto">2</div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold mx-auto">3</div>
                              )}
                           </td>
                           <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{result.studentName}</div>
                              <div className="text-xs text-slate-500">{t('classLabel')} {result.classGrade}</div>
                           </td>
                           <td className="px-6 py-4 text-center font-mono text-slate-700">{result.total}</td>
                           <td className="px-6 py-4 text-center font-mono text-slate-700">{result.percentage.toFixed(1)}%</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                result.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : 
                                result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {result.grade}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                {t('pass')}
                              </span>
                           </td>
                        </tr>
                      ))
                   ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                           <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                           <p>No results found for the selected criteria.</p>
                           <p className="text-xs mt-2">Try adding marks for this class in the "Marks Entry" tab.</p>
                        </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
           {/* Sidebar Selector */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-60 lg:h-auto overflow-y-auto">
              <h3 className="font-bold text-slate-800 mb-4 sticky top-0 bg-white pb-2">Select Student</h3>
              <div className="space-y-2">
                 {MOCK_STUDENTS.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedStudentReport(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedStudentReport === s.id ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                       {s.name}
                    </button>
                 ))}
              </div>
           </div>

           {/* Report Card Preview */}
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-8" id="report-card">
              {selectedStudent && (
                 <div className="overflow-x-auto">
                   <div id="report-card-content" className="border-4 border-double border-slate-200 p-6 relative min-w-[600px] sm:min-w-0 bg-white">
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                         <Trophy className="w-64 h-64" />
                      </div>

                      <div className="text-center border-b border-slate-300 pb-4 mb-6">
                         <h2 className="text-2xl font-serif font-bold text-slate-900">AL-ILM INTERNATIONAL SCHOOL</h2>
                         <p className="text-slate-500 text-sm">ANNUAL REPORT CARD (2023-2024)</p>
                      </div>

                      <div className="flex justify-between text-sm mb-6 font-medium text-slate-700">
                         <div>
                            <p>Name: <span className="font-bold text-slate-900">{selectedStudent.name}</span></p>
                            <p>Class: {selectedStudent.classGrade}-{selectedStudent.section}</p>
                         </div>
                         <div className="text-right">
                            <p>Roll No: {selectedStudent.admissionNumber}</p>
                            <p>DOB: {selectedStudent.dob}</p>
                         </div>
                      </div>

                      <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Academic Performance</h4>
                      <table className="w-full text-sm mb-6 border border-slate-300">
                         <thead className="bg-slate-100">
                            <tr>
                               <th className="border border-slate-300 px-3 py-2 text-left">Subject</th>
                               <th className="border border-slate-300 px-3 py-2 text-center">Max Marks</th>
                               <th className="border border-slate-300 px-3 py-2 text-center">Obtained</th>
                               <th className="border border-slate-300 px-3 py-2 text-center">Grade</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr><td className="border border-slate-300 px-3 py-2">Mathematics</td><td className="border border-slate-300 px-3 py-2 text-center">100</td><td className="border border-slate-300 px-3 py-2 text-center">85</td><td className="border border-slate-300 px-3 py-2 text-center font-bold">A</td></tr>
                            <tr><td className="border border-slate-300 px-3 py-2">Science</td><td className="border border-slate-300 px-3 py-2 text-center">100</td><td className="border border-slate-300 px-3 py-2 text-center">78</td><td className="border border-slate-300 px-3 py-2 text-center font-bold">B+</td></tr>
                            <tr><td className="border border-slate-300 px-3 py-2">English</td><td className="border border-slate-300 px-3 py-2 text-center">100</td><td className="border border-slate-300 px-3 py-2 text-center">92</td><td className="border border-slate-300 px-3 py-2 text-center font-bold">A+</td></tr>
                            <tr><td className="border border-slate-300 px-3 py-2">Social Studies</td><td className="border border-slate-300 px-3 py-2 text-center">100</td><td className="border border-slate-300 px-3 py-2 text-center">88</td><td className="border border-slate-300 px-3 py-2 text-center font-bold">A</td></tr>
                         </tbody>
                      </table>

                      <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Co-Scholastic / Madrasa</h4>
                      <table className="w-full text-sm mb-6 border border-slate-300">
                         <thead className="bg-slate-100">
                            <tr>
                               <th className="border border-slate-300 px-3 py-2 text-left">Activity</th>
                               <th className="border border-slate-300 px-3 py-2 text-center">Grade</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr><td className="border border-slate-300 px-3 py-2">Hifz Progress</td><td className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-600">Excellent</td></tr>
                            <tr><td className="border border-slate-300 px-3 py-2">Discipline</td><td className="border border-slate-300 px-3 py-2 text-center font-bold text-indigo-600">A</td></tr>
                         </tbody>
                      </table>

                      <div className="mt-8 flex justify-between items-end pt-8">
                         <div className="text-center w-32">
                            <div className="border-t border-slate-400 pt-1">Class Teacher</div>
                         </div>
                         <div className="text-center w-32">
                            <div className="border-t border-slate-400 pt-1">Principal</div>
                         </div>
                      </div>
                   </div>
                 </div>
              )}
              <div className="mt-6 flex justify-end">
                 <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors" onClick={printReport}>
                    <Printer className="w-4 h-4" /> Print Report
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};