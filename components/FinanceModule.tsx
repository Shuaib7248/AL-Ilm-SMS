
import React, { useState } from 'react';
import { MOCK_INVOICES, MOCK_SALARIES, MOCK_FEE_STRUCTURES, MOCK_STUDENTS, MOCK_FEE_WAIVERS } from '../constants';
import { FeeInvoice, StaffSalary, FeeWaiver, FeeStructure } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Banknote, FileText, Download, Printer, X, CheckCircle, Table, ArrowRightLeft, Edit, PlayCircle, Eye, Plus, Save, Percent, Tag, Trash2 } from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { t } = useLanguage();
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [selectedSalary, setSelectedSalary] = useState<StaffSalary | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'structure' | 'waivers'>('transactions');
  
  // State for data
  const [invoices, setInvoices] = useState<FeeInvoice[]>(MOCK_INVOICES);
  const [salaries, setSalaries] = useState<StaffSalary[]>(MOCK_SALARIES);
  const [waivers, setWaivers] = useState<FeeWaiver[]>(MOCK_FEE_WAIVERS);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(MOCK_FEE_STRUCTURES);

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isWaiverModalOpen, setIsWaiverModalOpen] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
      studentId: '',
      type: 'Tuition' as FeeInvoice['type'],
      amount: 0,
      dueDate: ''
  });
  
  const [newWaiver, setNewWaiver] = useState({
      studentId: '',
      type: 'Flat' as 'Flat' | 'Percentage',
      value: 0,
      reason: ''
  });

  const handleGenerateInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      const student = MOCK_STUDENTS.find(s => s.id === newInvoice.studentId);
      if (!student) return;

      const inv: FeeInvoice = {
          id: `INV-${Date.now()}`,
          invoiceNumber: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
          studentName: student.name,
          amount: newInvoice.amount,
          dueDate: newInvoice.dueDate,
          status: 'Unpaid',
          type: newInvoice.type
      };
      setInvoices([inv, ...invoices]);
      setIsInvoiceModalOpen(false);
      setNewInvoice({ studentId: '', type: 'Tuition', amount: 0, dueDate: '' });
  };

  const handleRunPayroll = () => {
    // Logic to set all pending salaries to Paid
    setSalaries(prev => prev.map(sal => ({
      ...sal,
      status: 'Paid'
    })));
    setIsPayrollModalOpen(false);
    alert(t('success'));
  };
  
  const handleAddWaiver = (e: React.FormEvent) => {
      e.preventDefault();
      const student = MOCK_STUDENTS.find(s => s.id === newWaiver.studentId);
      if (!student) return;

      const waiver: FeeWaiver = {
          id: Date.now().toString(),
          studentId: student.id,
          studentName: student.name,
          waiverType: newWaiver.type,
          value: newWaiver.value,
          reason: newWaiver.reason,
          date: new Date().toISOString().split('T')[0],
          approvedBy: 'Admin'
      };
      
      setWaivers([waiver, ...waivers]);
      setIsWaiverModalOpen(false);
      setNewWaiver({ studentId: '', type: 'Flat', value: 0, reason: '' });
      alert(t('waiverApplied'));
  };

  const handlePrint = (elementId: string, title: string) => {
    const printContent = document.getElementById(elementId);
    if (printContent) {
        const win = window.open('', '', 'height=800,width=600');
        if (win) {
            win.document.write(`<html><head><title>${title}</title>`);
            win.document.write('<script src="https://cdn.tailwindcss.com"></script>'); 
            win.document.write('<style>body { padding: 40px; background: white; } @media print { body { -webkit-print-color-adjust: exact; } }</style>');
            win.document.write('</head><body>');
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

  const calculateSalaryBreakdown = (amount: number) => {
    const basic = amount * 0.5;
    const hra = amount * 0.3;
    const allowances = amount * 0.2;
    const pf = basic * 0.12;
    const tax = amount > 50000 ? amount * 0.1 : 0;
    return { basic, hra, allowances, pf, tax, net: amount }; 
  };

  return (
    <div className="space-y-6">
      {/* Tab Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="bg-white rounded-lg p-1 inline-flex border border-slate-200 overflow-x-auto max-w-full">
            <button
               onClick={() => setActiveTab('transactions')}
               className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'transactions' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
               }`}
            >
               <ArrowRightLeft className="w-4 h-4" /> {t('transactions')}
            </button>
            <button
               onClick={() => setActiveTab('structure')}
               className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'structure' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
               }`}
            >
               <Table className="w-4 h-4" /> {t('feeStructure')}
            </button>
            <button
               onClick={() => setActiveTab('waivers')}
               className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'waivers' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
               }`}
            >
               <Percent className="w-4 h-4" /> {t('feeWaivers')}
            </button>
         </div>

         {activeTab === 'transactions' && (
            <div className="flex gap-2">
                <button 
                  onClick={() => setIsPayrollModalOpen(true)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                   <PlayCircle className="w-4 h-4" /> {t('runPayroll')}
                </button>
                <button 
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                   <FileText className="w-4 h-4" /> {t('generateInvoice')}
                </button>
            </div>
         )}
         {activeTab === 'waivers' && (
            <button 
                onClick={() => setIsWaiverModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
               <Plus className="w-4 h-4" /> {t('applyWaiver')}
            </button>
         )}
      </div>

      {activeTab === 'transactions' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        {/* Invoices List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-bold text-slate-900">{t('invoices')}</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
             <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                   <tr>
                      <th className="px-4 py-3">{t('studentInfo')}</th>
                      <th className="px-4 py-3">{t('amount')}</th>
                      <th className="px-4 py-3">{t('status')}</th>
                      <th className="px-4 py-3"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {invoices.map(inv => (
                      <tr key={inv.id}>
                         <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{inv.studentName}</div>
                            <div className="text-xs text-slate-500">{inv.type} • Due: {inv.dueDate}</div>
                         </td>
                         <td className="px-4 py-3 font-semibold">₹{inv.amount.toLocaleString()}</td>
                         <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                               {t(inv.status.toLowerCase()) || inv.status}
                            </span>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => setSelectedInvoice(inv)}
                              className="text-slate-400 hover:text-indigo-600"
                              title="Print Receipt"
                            >
                               <Printer className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Payroll List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-bold text-slate-900">{t('payroll')}</h3>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
             <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                   <tr>
                      <th className="px-4 py-3">{t('staffName')}</th>
                      <th className="px-4 py-3">{t('amount')}</th>
                      <th className="px-4 py-3">{t('status')}</th>
                      <th className="px-4 py-3"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {salaries.map(sal => (
                      <tr key={sal.id}>
                         <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{sal.staffName}</div>
                            <div className="text-xs text-slate-500">{sal.role} • {sal.month}</div>
                         </td>
                         <td className="px-4 py-3 font-semibold">₹{sal.amount.toLocaleString()}</td>
                         <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${sal.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                               {t(sal.status.toLowerCase()) || sal.status}
                            </span>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <button 
                                onClick={() => setSelectedSalary(sal)}
                                className="text-slate-400 hover:text-indigo-600"
                                title="View Slip"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'structure' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
             <table className="w-full text-sm text-left rtl:text-right">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                     <tr>
                         <th className="px-6 py-4">{t('classLabel')}</th>
                         <th className="px-6 py-4">{t('tuitionFee')}</th>
                         <th className="px-6 py-4">{t('hostelFee')}</th>
                         <th className="px-6 py-4">{t('transportFee')}</th>
                         <th className="px-6 py-4">{t('computerFee')}</th>
                         <th className="px-6 py-4 font-bold">{t('totalMonthly')}</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {feeStructures.map((fee) => (
                         <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4 font-medium text-slate-900">Class {fee.classGrade}</td>
                             <td className="px-6 py-4 text-slate-600">₹{fee.tuitionFee.toLocaleString()}</td>
                             <td className="px-6 py-4 text-slate-600">₹{fee.hostelFee.toLocaleString()}</td>
                             <td className="px-6 py-4 text-slate-600">₹{fee.transportFee.toLocaleString()}</td>
                             <td className="px-6 py-4 text-slate-600">₹{fee.computerFee.toLocaleString()}</td>
                             <td className="px-6 py-4 font-bold text-indigo-600">
                                 ₹{(fee.tuitionFee + fee.hostelFee + fee.transportFee + fee.computerFee).toLocaleString()}
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      )}

      {activeTab === 'waivers' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
             <table className="w-full text-sm text-left rtl:text-right">
                 <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                     <tr>
                         <th className="px-6 py-4">{t('studentInfo')}</th>
                         <th className="px-6 py-4">{t('waiverType')}</th>
                         <th className="px-6 py-4">{t('waiverAmount')}</th>
                         <th className="px-6 py-4">{t('waiverReason')}</th>
                         <th className="px-6 py-4">Approved By</th>
                         <th className="px-6 py-4">Date</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {waivers.map((w) => (
                         <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4 font-medium text-slate-900">{w.studentName}</td>
                             <td className="px-6 py-4 text-slate-600">{w.waiverType}</td>
                             <td className="px-6 py-4 font-semibold text-emerald-600">
                                 {w.waiverType === 'Flat' ? `₹${w.value.toLocaleString()}` : `${w.value}%`}
                             </td>
                             <td className="px-6 py-4 text-slate-600">{w.reason}</td>
                             <td className="px-6 py-4 text-slate-600">{w.approvedBy}</td>
                             <td className="px-6 py-4 text-slate-500 text-xs">{w.date}</td>
                         </tr>
                     ))}
                     {waivers.length === 0 && (
                         <tr><td colSpan={6} className="text-center py-8 text-slate-400">No waivers found.</td></tr>
                     )}
                 </tbody>
             </table>
         </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('generateInvoice')}</h3>
                      <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleGenerateInvoice} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('studentInfo')}</label>
                          <select 
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newInvoice.studentId}
                              onChange={e => setNewInvoice({...newInvoice, studentId: e.target.value})}
                              required
                          >
                              <option value="">Select Student</option>
                              {MOCK_STUDENTS.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.classGrade}-{s.section})</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('type')}</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                value={newInvoice.type}
                                onChange={e => setNewInvoice({...newInvoice, type: e.target.value as any})}
                            >
                                <option value="Tuition">Tuition</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Exam">Exam</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('amount')}</label>
                            <input 
                                type="number" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newInvoice.amount}
                                onChange={e => setNewInvoice({...newInvoice, amount: parseInt(e.target.value)})}
                            />
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                          <input 
                              type="date" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newInvoice.dueDate}
                              onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsInvoiceModalOpen(false)}
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

      {/* Waiver Modal */}
      {isWaiverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('applyWaiver')}</h3>
                      <button onClick={() => setIsWaiverModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleAddWaiver} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('studentInfo')}</label>
                          <select 
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newWaiver.studentId}
                              onChange={e => setNewWaiver({...newWaiver, studentId: e.target.value})}
                              required
                          >
                              <option value="">Select Student</option>
                              {MOCK_STUDENTS.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.classGrade}-{s.section})</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('waiverType')}</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                value={newWaiver.type}
                                onChange={e => setNewWaiver({...newWaiver, type: e.target.value as any})}
                            >
                                <option value="Flat">{t('flatAmount')}</option>
                                <option value="Percentage">{t('percentage')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('waiverAmount')}</label>
                            <input 
                                type="number" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newWaiver.value}
                                onChange={e => setNewWaiver({...newWaiver, value: parseInt(e.target.value)})}
                            />
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('waiverReason')}</label>
                          <input 
                              type="text" 
                              required
                              placeholder="e.g. Merit, Sibling"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newWaiver.reason}
                              onChange={e => setNewWaiver({...newWaiver, reason: e.target.value})}
                          />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsWaiverModalOpen(false)}
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

      {/* Payroll Modal */}
      {isPayrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                      <Banknote className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('confirmPayroll')}</h3>
                  <p className="text-slate-500 mb-6">{t('payrollConfirmationText')}</p>
                  <div className="flex gap-3 justify-center">
                      <button 
                          onClick={() => setIsPayrollModalOpen(false)}
                          className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
                      >
                          {t('cancel')}
                      </button>
                      <button 
                          onClick={handleRunPayroll}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-200"
                      >
                          {t('confirm')}
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={() => setSelectedInvoice(null)}>
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" /> {t('receipt')}
                 </h3>
                 <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-rose-500">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-8 bg-white" id="printable-receipt">
                 <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 print:border print:border-slate-300">AI</div>
                    <h2 className="text-xl font-bold text-slate-900">Al-Ilm International School</h2>
                    <p className="text-sm text-slate-500">123 Education Lane, Knowledge City</p>
                    <p className="text-sm text-slate-500">Phone: +91 9876543210</p>
                 </div>

                 <div className="border-t border-b border-slate-200 py-4 mb-6">
                    <div className="flex justify-between mb-2">
                       <span className="text-sm text-slate-500">Receipt No:</span>
                       <span className="text-sm font-mono font-bold text-slate-800">REC/{selectedInvoice.id.split('-')[1]}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                       <span className="text-sm text-slate-500">Date:</span>
                       <span className="text-sm font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                       <span className="text-sm text-slate-500">Student:</span>
                       <span className="text-sm font-bold text-slate-800">{selectedInvoice.studentName}</span>
                    </div>
                 </div>

                 <table className="w-full text-sm mb-6">
                    <thead>
                       <tr className="border-b border-slate-200 text-slate-500">
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Amount</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td className="py-2 text-slate-800">{selectedInvoice.type} Fee</td>
                          <td className="py-2 text-right font-medium">₹{selectedInvoice.amount.toLocaleString()}</td>
                       </tr>
                    </tbody>
                    <tfoot>
                       <tr className="border-t border-slate-200">
                          <td className="py-2 font-bold text-slate-900">Total Paid</td>
                          <td className="py-2 text-right font-bold text-indigo-600">₹{selectedInvoice.amount.toLocaleString()}</td>
                       </tr>
                    </tfoot>
                 </table>

                 <div className="flex justify-between items-end mt-12">
                     <div className="text-center">
                        <div className="text-emerald-600 font-bold border-2 border-emerald-600 px-3 py-1 rounded rotate-[-12deg] opacity-80 text-sm">
                           {selectedInvoice.status.toUpperCase()}
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="h-10 border-b border-slate-400 mb-1 w-32"></div>
                        <p className="text-xs text-slate-500">Authorized Signature</p>
                     </div>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2">
                 <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Close</button>
                 <button onClick={() => handlePrint('printable-receipt', 'Receipt')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Printer className="w-4 h-4" /> {t('printReceipt')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {selectedSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={() => setSelectedSalary(null)}>
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-indigo-600" /> {t('salarySlip')}
                 </h3>
                 <button onClick={() => setSelectedSalary(null)} className="text-slate-400 hover:text-rose-500">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-8 bg-white" id="printable-salary">
                 <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 print:border print:border-slate-300">AI</div>
                    <h2 className="text-xl font-bold text-slate-900">Al-Ilm International School</h2>
                    <p className="text-sm text-slate-500">PAYSLIP - {selectedSalary.month.toUpperCase()} 2024</p>
                 </div>

                 <div className="border border-slate-200 rounded-lg p-4 mb-6 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">{t('staffName')}</span>
                            <span className="font-bold text-slate-800">{selectedSalary.staffName}</span>
                        </div>
                         <div className="text-right">
                            <span className="block text-slate-500 text-xs uppercase">Designation</span>
                            <span className="font-bold text-slate-800">{selectedSalary.role}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500 text-xs uppercase">Employee ID</span>
                            <span className="font-mono text-slate-800">{selectedSalary.id}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-500 text-xs uppercase">Pay Date</span>
                            <span className="font-mono text-slate-800">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                 </div>

                 {(() => {
                    const breakdown = calculateSalaryBreakdown(selectedSalary.amount);
                    return (
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="font-bold text-slate-700 text-xs uppercase border-b border-slate-200 pb-2 mb-2">{t('earnings')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-600">{t('basicSalary')}</span> <span className="font-medium">₹{breakdown.basic.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">{t('hra')}</span> <span className="font-medium">₹{breakdown.hra.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">{t('allowances')}</span> <span className="font-medium">₹{breakdown.allowances.toLocaleString()}</span></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 text-xs uppercase border-b border-slate-200 pb-2 mb-2">{t('deductions')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-600">{t('pf')}</span> <span className="font-medium">₹{breakdown.pf.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">{t('tax')}</span> <span className="font-medium">₹{breakdown.tax.toLocaleString()}</span></div>
                                </div>
                            </div>
                        </div>
                    );
                 })()}

                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex justify-between items-center mb-8">
                    <span className="font-bold text-indigo-900">{t('netSalary')}</span>
                    <span className="font-bold text-xl text-indigo-700">₹{selectedSalary.amount.toLocaleString()}</span>
                 </div>

                 <div className="text-right">
                    <div className="h-10 border-b border-slate-400 mb-1 w-32 ml-auto"></div>
                    <p className="text-xs text-slate-500">Finance Manager</p>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2">
                 <button onClick={() => setSelectedSalary(null)} className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Close</button>
                 <button onClick={() => handlePrint('printable-salary', 'Salary Slip')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Printer className="w-4 h-4" /> {t('printSlip')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
