
import { Student, MadrasaLevel, UserRole, AdmissionApplication, Exam, HostelRoom, LeaveRequest, FeeInvoice, StaffSalary, Book, Vehicle, Notice, OutingLog, FeeStructure, ExamResult, FeeWaiver, Staff, HealthRecord, CalendarEvent, SupportTicket, MessMenuDay } from './types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Building, 
  Banknote, 
  CalendarCheck,
  FileText,
  UserPlus,
  Library,
  Bus,
  Megaphone,
  Briefcase,
  Activity,
  Calendar,
  LifeBuoy
} from 'lucide-react';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    admissionNumber: 'SMS-2024-001',
    classGrade: '6',
    section: 'A',
    isBoarder: true,
    hostelRoom: 'B-101',
    madrasaLevel: MadrasaLevel.HIFZ,
    hifzProgress: { currentJuz: 4, completedJuz: 3, currentSurah: 'An-Nisa' },
    attendance: { school: 92, madrasa: 95 },
    fees: { status: 'Paid', amountDue: 0 },
    guardianName: 'Bilal Khan',
    contactEmail: 'bilal.k@example.com',
    dob: '2012-05-15',
    bloodGroup: 'B+',
    address: '123 Main St, Mumbai'
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    admissionNumber: 'SMS-2024-002',
    classGrade: '7',
    section: 'B',
    isBoarder: false,
    madrasaLevel: MadrasaLevel.NAZRA,
    attendance: { school: 88, madrasa: 90 },
    fees: { status: 'Due', amountDue: 3500 },
    guardianName: 'Yusuf Ali',
    contactEmail: 'yusuf.a@example.com',
    dob: '2011-08-22',
    bloodGroup: 'O+',
    address: '45 Park Ave, Delhi'
  },
  {
    id: '3',
    name: 'Ibrahim Musa',
    admissionNumber: 'SMS-2024-003',
    classGrade: '5',
    section: 'A',
    isBoarder: true,
    hostelRoom: 'A-205',
    madrasaLevel: MadrasaLevel.HIFZ,
    hifzProgress: { currentJuz: 12, completedJuz: 11, currentSurah: 'Hud' },
    attendance: { school: 98, madrasa: 97 },
    fees: { status: 'Paid', amountDue: 0 },
    guardianName: 'Musa Ibrahim',
    contactEmail: 'musa.i@example.com',
    dob: '2013-01-10',
    bloodGroup: 'A-',
    address: 'Hostel Block A'
  },
  {
    id: '4',
    name: 'Zainab Omar',
    admissionNumber: 'SMS-2024-004',
    classGrade: '8',
    section: 'C',
    isBoarder: false,
    madrasaLevel: MadrasaLevel.DARS_E_NIZAMI,
    attendance: { school: 85, madrasa: 82 },
    fees: { status: 'Overdue', amountDue: 12000 },
    guardianName: 'Omar Farooq',
    contactEmail: 'omar.f@example.com',
    dob: '2010-11-30',
    bloodGroup: 'AB+',
    address: '78 Market Rd, Hyderabad'
  },
  {
    id: '5',
    name: 'Usman Ghani',
    admissionNumber: 'SMS-2024-005',
    classGrade: '6',
    section: 'B',
    isBoarder: true,
    hostelRoom: 'C-302',
    madrasaLevel: MadrasaLevel.HIFZ,
    hifzProgress: { currentJuz: 28, completedJuz: 27, currentSurah: 'Al-Mujadila' },
    attendance: { school: 94, madrasa: 94 },
    fees: { status: 'Paid', amountDue: 0 },
    guardianName: 'Ghani Rahman',
    contactEmail: 'ghani.r@example.com',
    dob: '2012-03-25',
    bloodGroup: 'O-',
    address: 'Hostel Block C'
  }
];

export const MOCK_ADMISSIONS: AdmissionApplication[] = [
  { id: '1', applicantName: 'Yusuf Islam', guardianName: 'Cat Islam', appliedClass: '5', madrasaLevel: MadrasaLevel.NAZRA, applicationDate: '2024-03-10', status: 'Pending', contact: '+91 9876543210' },
  { id: '2', applicantName: 'Sarah Smith', guardianName: 'John Smith', appliedClass: '6', madrasaLevel: MadrasaLevel.HIFZ, applicationDate: '2024-03-08', status: 'Interview', contact: '+91 9876543211' },
  { id: '3', applicantName: 'Omar Abdullah', guardianName: 'Ali Abdullah', appliedClass: '5', madrasaLevel: MadrasaLevel.HIFZ, applicationDate: '2024-03-01', status: 'Approved', contact: '+91 9876543212' },
];

export const MOCK_EXAMS: Exam[] = [
  { id: '1', name: 'Mid-Term 1', date: '2024-04-15', classGrade: '5', subjects: ['Math', 'Science', 'English', 'Arabic'] },
  { id: '2', name: 'Mid-Term 1', date: '2024-04-15', classGrade: '6', subjects: ['Math', 'Science', 'English', 'Arabic'] },
  { id: '3', name: 'Hifz Evaluation', date: '2024-04-20', classGrade: 'All', subjects: ['Hifz', 'Tajweed'] },
];

export const MOCK_EXAM_RESULTS: ExamResult[] = [
  {
    id: '1',
    examId: '2', // Mid-Term 1 Class 6
    studentId: '1',
    studentName: 'Ahmed Khan',
    classGrade: '6',
    marks: { 'Math': 88, 'Science': 92, 'English': 85, 'Arabic': 95 },
    total: 360,
    percentage: 90,
    grade: 'A+',
    rank: 1
  },
  {
    id: '2',
    examId: '2', // Mid-Term 1 Class 6
    studentId: '5',
    studentName: 'Usman Ghani',
    classGrade: '6',
    marks: { 'Math': 78, 'Science': 82, 'English': 80, 'Arabic': 88 },
    total: 328,
    percentage: 82,
    grade: 'A',
    rank: 2
  },
  {
    id: '3',
    examId: '1', // Mid-Term 1 Class 5
    studentId: '3',
    studentName: 'Ibrahim Musa',
    classGrade: '5',
    marks: { 'Math': 95, 'Science': 90, 'English': 88, 'Arabic': 98 },
    total: 371,
    percentage: 92.75,
    grade: 'A+',
    rank: 1
  }
];

export const MOCK_HOSTEL_ROOMS: HostelRoom[] = [
  { id: '1', roomNumber: '101', block: 'A', capacity: 4, occupied: 4, occupants: ['Ahmed Khan', 'Student B', 'Student C', 'Student D'] },
  { id: '2', roomNumber: '102', block: 'A', capacity: 4, occupied: 2, occupants: ['Ibrahim Musa', 'Student F'] },
  { id: '3', roomNumber: '103', block: 'A', capacity: 6, occupied: 0, occupants: [] },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: '1', studentName: 'Ahmed Khan', startDate: '2024-03-20', endDate: '2024-03-22', reason: 'Family Wedding', status: 'Pending' },
  { id: '2', studentName: 'Usman Ghani', startDate: '2024-03-15', endDate: '2024-03-16', reason: 'Medical Checkup', status: 'Approved' },
];

export const MOCK_OUTING_LOGS: OutingLog[] = [
  { id: '1', studentName: 'Ahmed Khan', date: '2024-03-12', timeOut: '17:00', timeIn: '18:30', purpose: 'Market', status: 'Returned' },
  { id: '2', studentName: 'Ibrahim Musa', date: '2024-03-12', timeOut: '16:00', purpose: 'Doctor Visit', status: 'Out' },
];

export const MOCK_INVOICES: FeeInvoice[] = [
  { id: 'INV-001', invoiceNumber: 'INV/2024/001', studentName: 'Ahmed Khan', amount: 4500, dueDate: '2024-04-01', status: 'Paid', type: 'Tuition' },
  { id: 'INV-002', invoiceNumber: 'INV/2024/002', studentName: 'Fatima Zahra', amount: 3500, dueDate: '2024-04-01', status: 'Unpaid', type: 'Tuition' },
];

export const MOCK_SALARIES: StaffSalary[] = [
  { id: 'S-001', staffName: 'Ustad Ali', role: 'Madrasa Teacher', amount: 25000, month: 'March', status: 'Paid' },
  { id: 'S-002', staffName: 'Mr. Sharma', role: 'Math Teacher', amount: 30000, month: 'March', status: 'Pending' },
];

export const MOCK_FEE_STRUCTURES: FeeStructure[] = [
  { id: '1', classGrade: '5', tuitionFee: 3000, hostelFee: 6000, transportFee: 1500, computerFee: 300 },
  { id: '2', classGrade: '6', tuitionFee: 3200, hostelFee: 6000, transportFee: 1500, computerFee: 400 },
  { id: '3', classGrade: '7', tuitionFee: 3500, hostelFee: 6500, transportFee: 1500, computerFee: 500 },
  { id: '4', classGrade: '8', tuitionFee: 3800, hostelFee: 6500, transportFee: 1500, computerFee: 500 },
];

export const MOCK_FEE_WAIVERS: FeeWaiver[] = [
  { id: '1', studentId: '2', studentName: 'Fatima Zahra', waiverType: 'Flat', value: 500, reason: 'Sibling Discount', date: '2024-03-01', approvedBy: 'Principal' },
  { id: '2', studentId: '1', studentName: 'Ahmed Khan', waiverType: 'Percentage', value: 10, reason: 'Merit Scholarship', date: '2024-01-15', approvedBy: 'Admin' }
];

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'Mathematics for Class 6', author: 'R.D. Sharma', isbn: '978-1234567890', category: 'Academic', status: 'Available' },
  { id: '2', title: 'Stories of the Prophets', author: 'Ibn Kathir', isbn: '978-0987654321', category: 'Islamic', status: 'Issued', issuedTo: 'Ahmed Khan', dueDate: '2024-04-05' },
  { id: '3', title: 'Science Encyclopedia', author: 'DK Publishing', isbn: '978-1122334455', category: 'Reference', status: 'Available' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', vehicleNumber: 'KA-01-AB-1234', driverName: 'Ramesh Kumar', driverContact: '+91 9988776655', route: 'Route A (North City)', capacity: 40, studentsCount: 35, status: 'Active' },
  { id: '2', vehicleNumber: 'KA-01-XY-9876', driverName: 'Suresh Singh', driverContact: '+91 9988776644', route: 'Route B (South City)', capacity: 40, studentsCount: 38, status: 'Active' },
];

export const MOCK_NOTICES: Notice[] = [
  { id: '1', title: 'Ramadan Timings', date: '2024-03-10', type: 'Event', content: 'School timings will be 8:00 AM to 1:00 PM during Ramadan.', issuedBy: 'Principal' },
  { id: '2', title: 'Fee Payment Reminder', date: '2024-03-05', type: 'Urgent', content: 'Please clear all outstanding dues before the final exams.', issuedBy: 'Accounts Dept' },
];

// New Mock Data for International Features

export const MOCK_STAFF: Staff[] = [
  { id: '1', name: 'Ustad Ali', role: 'Head Ustad', department: 'Madrasa', contact: '+91 9876543210', email: 'ali@school.com', joinDate: '2020-01-01', status: 'Active', attendance: 98 },
  { id: '2', name: 'Mr. Sharma', role: 'Senior Teacher', department: 'Science', contact: '+91 9876543211', email: 'sharma@school.com', joinDate: '2019-06-15', status: 'Active', attendance: 95 },
  { id: '3', name: 'Mrs. Khan', role: 'Admin', department: 'Administration', contact: '+91 9876543212', email: 'admin@school.com', joinDate: '2021-03-10', status: 'On Leave', attendance: 88 },
];

export const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  { id: '1', studentId: '1', studentName: 'Ahmed Khan', condition: 'Viral Fever', date: '2024-02-15', treatment: 'Paracetamol, Rest advised', remarks: 'Recovered', severity: 'Medium' },
  { id: '2', studentId: '3', studentName: 'Ibrahim Musa', condition: 'Minor Cut', date: '2024-03-05', treatment: 'First Aid', remarks: 'Playing football', severity: 'Low' },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Annual Sports Day', start: '2024-04-10', type: 'Event', description: 'All students must wear sports uniform.' },
  { id: '2', title: 'Eid-ul-Fitr Holiday', start: '2024-04-10', end: '2024-04-13', type: 'Holiday', description: 'School closed.' },
  { id: '3', title: 'Final Exams (Class 8)', start: '2024-04-20', type: 'Exam', description: 'Hall B' },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: '1', subject: 'Smart Board not working', raisedBy: 'Mr. Sharma', role: UserRole.TEACHER, date: '2024-03-11', status: 'Open', priority: 'High', category: 'IT' },
  { id: '2', subject: 'Tap leaking in Hostel C', raisedBy: 'Warden', role: UserRole.ADMIN, date: '2024-03-10', status: 'In Progress', priority: 'Medium', category: 'Maintenance' },
];

export const MOCK_MESS_MENU: MessMenuDay[] = [
  { day: 'Monday', breakfast: 'Bread, Omelette, Milk', lunch: 'Rice, Dal, Chicken Curry', dinner: 'Roti, Mixed Veg, Kheer' },
  { day: 'Tuesday', breakfast: 'Paratha, Curd, Tea', lunch: 'Rice, Sambar, Fish Fry', dinner: 'Roti, Paneer Butter Masala' },
  { day: 'Wednesday', breakfast: 'Idli, Chutney, Coffee', lunch: 'Veg Biryani, Raita', dinner: 'Roti, Chicken Stew' },
  { day: 'Thursday', breakfast: 'Poha, Fruit', lunch: 'Rice, Dal, Egg Curry', dinner: 'Roti, Aloo Gobi' },
  { day: 'Friday', breakfast: 'Puri, Bhaji', lunch: 'Chicken Biryani (Special)', dinner: 'Rice, Dal Fry' },
  { day: 'Saturday', breakfast: 'Upma, Banana', lunch: 'Khichdi, Begun Bhaja', dinner: 'Pizza/Burger (Continental)' },
  { day: 'Sunday', breakfast: 'Halwa Puri', lunch: 'Mutton Pulao', dinner: 'Light Porridge' },
];

export const NAV_ITEMS: import('./types').NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.STUDENT, UserRole.USTAD, UserRole.PARENT] },
  { id: 'admission', label: 'Admission', icon: UserPlus, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
  { id: 'students', label: 'Students (SIS)', icon: Users, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.USTAD] },
  { id: 'staff', label: 'Staff & HR', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
  { id: 'academics', label: 'Academics', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'madrasa', label: 'Madrasa', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.USTAD, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'calendar', label: 'Calendar', icon: Calendar, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.USTAD] },
  { id: 'library', label: 'Library', icon: Library, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.USTAD] },
  { id: 'transport', label: 'Transport', icon: Bus, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.PARENT] },
  { id: 'hostel', label: 'Hostel', icon: Building, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'health', label: 'Health', icon: Activity, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
  { id: 'finance', label: 'Finance', icon: Banknote, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.USTAD, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'communication', label: 'Notices', icon: Megaphone, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.USTAD, UserRole.ACCOUNTANT] },
  { id: 'helpdesk', label: 'Help Desk', icon: LifeBuoy, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.USTAD] },
  { id: 'reports', label: 'Reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
];
