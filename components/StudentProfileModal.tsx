
import React, { useState } from 'react';
import { Student } from '../types';
import { MOCK_INVOICES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { X, User, MapPin, Activity, FileText, IdCard, QrCode, Printer } from 'lucide-react';

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const { t } = useLanguage();
  const [showIdCard, setShowIdCard] = useState(false);

  // Filter invoices for this student
  const studentInvoices = MOCK_INVOICES.filter(inv => inv.studentName === student.name);

  const printIdCard = () => {
    const printContent = document.getElementById('digital-id-card');
    if (printContent) {
        const win = window.open('', '', 'height=600,width=400');
        if (win) {
            win.document.write('<html><head><title>ID Card</title>');
            win.document.write('<script src="https://cdn.tailwindcss.com"></script>'); 
            win.document.write('</head><body class="flex items-center justify-center min-h-screen bg-white">');
            win.document.write(printContent.outerHTML);
            win.document.write('</body></html>');
            win.document.close();
            win.focus();
            // Allow styles to load
            setTimeout(() => {
                win.print();
                win.close();
            }, 500);
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-start text-white flex-shrink-0">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm border-2 border-white/20">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-slate-300 text-sm">ID: {student.admissionNumber}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs border border-emerald-500/30">
                  Class {student.classGrade}-{student.section}
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">
                  {student.isBoarder ? 'Boarder' : 'Day Scholar'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button
              onClick={() => setShowIdCard(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors"
            >
              <IdCard className="w-4 h-4" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-indigo-500" /> {t('personalDetails')}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block">{t('dob')}</label>
                    <p className="text-sm font-medium text-slate-900">{student.dob || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">{t('bloodGroup')}</label>
                    <p className="text-sm font-medium text-slate-900">{student.bloodGroup || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">{t('guardianName')}</label>
                    <p className="text-sm font-medium text-slate-900">{student.guardianName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">{t('contact')}</label>
                    <p className="text-sm font-medium text-slate-900">{student.contactEmail}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block">{t('address')}</label>
                  <p className="text-sm font-medium text-slate-900 flex items-start gap-1">
                    <MapPin className="w-3 h-3 mt-0.5 text-slate-400" />
                    {student.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Activity className="w-5 h-5 text-emerald-500" /> Academic Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">School Attendance</span>
                  <span className="font-bold text-emerald-600">{student.attendance.school}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Madrasa Attendance</span>
                  <span className="font-bold text-emerald-600">{student.attendance.madrasa}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Madrasa Level</span>
                  <span className="font-bold text-indigo-600">{student.madrasaLevel}</span>
                </div>
                {student.hifzProgress && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Hifz Progress</span>
                        <span className="font-bold text-indigo-600">{student.hifzProgress.completedJuz} Juz Completed</span>
                    </div>
                )}
              </div>
            </div>

             {/* Fee History */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText className="w-5 h-5 text-amber-500" /> Recent Transactions
              </h3>
              {studentInvoices.length > 0 ? (
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-slate-500 bg-slate-50">
                      <tr>
                        <th className="px-4 py-2">Invoice No</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                        {studentInvoices.map(inv => (
                           <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                             <td className="px-4 py-2 font-mono text-xs">{inv.invoiceNumber}</td>
                             <td className="px-4 py-2">{inv.dueDate}</td>
                             <td className="px-4 py-2">{inv.type} Fee</td>
                             <td className="px-4 py-2 font-medium">₹{inv.amount.toLocaleString()}</td>
                             <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {inv.status}
                                </span>
                             </td>
                           </tr>
                        ))}
                    </tbody>
                  </table>
              ) : (
                  <p className="text-slate-500 italic text-sm text-center py-4">No recent transactions found.</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ID Card Overlay */}
      {showIdCard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowIdCard(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[320px] overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            <div id="digital-id-card" className="relative h-[500px] flex flex-col m-4 border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden">
               {/* ID Header */}
               <div className="bg-indigo-700 p-4 text-center text-white">
                 <div className="flex justify-center mb-1">
                   <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50">
                      <span className="font-bold text-lg">AI</span>
                   </div>
                 </div>
                 <h3 className="font-bold text-sm tracking-wide">AL-ILM INTERNATIONAL</h3>
                 <p className="text-[10px] opacity-80 uppercase tracking-wider">School Management System</p>
               </div>

               {/* ID Content */}
               <div className="flex-1 p-4 flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                  <div className="w-24 h-24 bg-slate-200 rounded-full border-4 border-white shadow-md mb-3 flex items-center justify-center text-slate-400 overflow-hidden">
                     <div className="text-4xl font-bold text-slate-300">{student.name.charAt(0)}</div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 text-center uppercase leading-tight mb-1">{student.name}</h2>
                  <p className="text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-0.5 rounded-full mb-4 border border-indigo-100">
                    {student.isBoarder ? 'Boarder' : 'Day Scholar'}
                  </p>

                  <div className="w-full space-y-2 text-sm px-2">
                     <div className="flex justify-between border-b border-slate-100 pb-1 border-dashed">
                       <span className="text-slate-500 text-xs uppercase font-medium">ID No</span>
                       <span className="font-bold text-slate-800">{student.admissionNumber}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-1 border-dashed">
                       <span className="text-slate-500 text-xs uppercase font-medium">Class</span>
                       <span className="font-bold text-slate-800">{student.classGrade}-{student.section}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-1 border-dashed">
                       <span className="text-slate-500 text-xs uppercase font-medium">DOB</span>
                       <span className="font-bold text-slate-800">{student.dob || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-1 border-dashed">
                       <span className="text-slate-500 text-xs uppercase font-medium">Blood Group</span>
                       <span className="font-bold text-slate-800">{student.bloodGroup || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-100 pb-1 border-dashed">
                       <span className="text-slate-500 text-xs uppercase font-medium">Emergency</span>
                       <span className="font-bold text-slate-800">{student.contactEmail.split('@')[0]}</span>
                     </div>
                  </div>

                  {/* QR and Footer */}
                  <div className="mt-auto pt-4 w-full flex items-end justify-between">
                     <div className="text-center">
                         <QrCode className="w-14 h-14 text-slate-800" />
                     </div>
                     <div className="text-right">
                        <div className="h-8 w-24 border-b border-slate-800 mb-1">
                          {/* Signature Placeholder */}
                          <span className="font-cursive text-lg text-slate-600 opacity-50 block rotate-[-10deg] translate-y-2">Principal</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase font-medium">Principal Signature</p>
                     </div>
                  </div>
               </div>
               
               {/* ID Bottom */}
               <div className="bg-indigo-900 h-4 w-full flex items-center justify-center">
                  <span className="text-[8px] text-white/50 tracking-[0.2em] uppercase">Valid for Academic Year 2024-25</span>
               </div>
            </div>

            <div className="flex gap-2 p-4 bg-slate-50 border-t border-slate-200">
               <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors" onClick={() => setShowIdCard(false)}>
                  Close
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors" onClick={printIdCard}>
                  <Printer className="w-4 h-4" /> Print
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};