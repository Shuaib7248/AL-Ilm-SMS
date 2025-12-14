
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Download, BarChart2, PieChart, Calendar, X, Printer, Eye } from 'lucide-react';
import { MOCK_STUDENTS, MOCK_INVOICES, MOCK_EXAM_RESULTS } from '../constants';

export const ReportsModule: React.FC = () => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reports = [
    { id: 1, name: t('academicReports'), category: 'Academic', date: '2024-03-01', icon: BarChart2, color: 'text-indigo-600 bg-indigo-100' },
    { id: 2, name: t('financialReports'), category: 'Finance', date: '2024-03-01', icon: PieChart, color: 'text-emerald-600 bg-emerald-100' },
    { id: 3, name: t('attendanceReports'), category: 'Attendance', date: '2024-03-01', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
  ];

  const getReportData = (category: string) => {
    switch (category) {
      case 'Academic':
        return {
          headers: ['Student Name', 'Class', 'Total Marks', 'Grade', 'Rank'],
          data: MOCK_EXAM_RESULTS.map(r => [r.studentName, r.classGrade, r.total, r.grade, r.rank])
        };
      case 'Finance':
        return {
          headers: ['Invoice No', 'Student', 'Type', 'Amount', 'Status'],
          data: MOCK_INVOICES.map(i => [i.invoiceNumber, i.studentName, i.type, `₹${i.amount}`, i.status])
        };
      case 'Attendance':
        return {
          headers: ['Student Name', 'Class', 'School Attendance %', 'Madrasa Attendance %'],
          data: MOCK_STUDENTS.map(s => [s.name, s.classGrade, `${s.attendance.school}%`, `${s.attendance.madrasa}%`])
        };
      default:
        return { headers: [], data: [] };
    }
  };

  const handleView = (report: any) => {
    const data = getReportData(report.category);
    setSelectedReport({ ...report, ...data });
    setIsModalOpen(true);
  };

  const handleDownload = (report: any) => {
    const { headers, data } = getReportData(report.category);
    const csvContent = [
      headers.join(','),
      ...data.map((row: any[]) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.name.replace(/\s+/g, '_')}_${report.date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
     const printContent = document.getElementById('report-table-content');
     if (printContent) {
         const win = window.open('', '', 'height=800,width=800');
         if (win) {
             win.document.write('<html><head><title>Report Print</title>');
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-slate-700" />
          {t('reportsCenter')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    {report.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{report.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{t('generatedDate')}: {report.date}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(report)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-4 h-4" /> {t('download')}
                  </button>
                  <button 
                    onClick={() => handleView(report)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> {t('view')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report View Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedReport.name}</h3>
                <p className="text-sm text-slate-500">{t('generatedDate')}: {selectedReport.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Print">
                    <Printer className="w-5 h-5" />
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6" id="report-table-content">
               <div className="mb-4 text-center print:block hidden">
                   <h1 className="text-2xl font-bold">{selectedReport.name}</h1>
                   <p className="text-sm text-slate-500">Al-Ilm International School</p>
               </div>
               <table className="w-full text-left text-sm border-collapse">
                 <thead>
                   <tr className="bg-slate-50 border-b border-slate-200">
                     {selectedReport.headers.map((header: string, index: number) => (
                       <th key={index} className="px-6 py-3 font-semibold text-slate-700">{header}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {selectedReport.data.map((row: any[], rowIndex: number) => (
                     <tr key={rowIndex} className="hover:bg-slate-50">
                       {row.map((cell: any, cellIndex: number) => (
                         <td key={cellIndex} className="px-6 py-3 text-slate-600">{cell}</td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
