
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  USTAD = 'USTAD', // Madrasa Teacher
  PARENT = 'PARENT',
  ACCOUNTANT = 'ACCOUNTANT',
  STUDENT = 'STUDENT'
}

export enum MadrasaLevel {
  NAZRA = 'Nazra',
  HIFZ = 'Hifz',
  DARS_E_NIZAMI = 'Dars-e-Nizami'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  LEAVE = 'Leave'
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  classGrade: string; // 5-8
  section: string;
  isBoarder: boolean;
  hostelRoom?: string;
  madrasaLevel: MadrasaLevel;
  hifzProgress?: {
    currentJuz: number;
    completedJuz: number;
    currentSurah: string;
  };
  attendance: {
    school: number; // Percentage
    madrasa: number; // Percentage
  };
  fees: {
    status: 'Paid' | 'Due' | 'Overdue';
    amountDue: number;
  };
  guardianName: string;
  contactEmail: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  contact: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'On Leave';
  attendance: number; // Percentage
}

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  condition: string; // e.g., Fever, Injury
  date: string;
  treatment: string;
  remarks: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // Date
  end?: string;
  type: 'Academic' | 'Holiday' | 'Exam' | 'Event';
  description?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  raisedBy: string;
  role: UserRole;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  category: 'IT' | 'Maintenance' | 'Admin' | 'Academic';
}

export interface MessMenuDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MadrasaLog {
  id: string;
  studentId: string;
  date: string;
  sabaq: string; // New Lesson
  sabaqPara: string; // Recent Revision
  manzil: string; // Old Revision
  quality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  // Progress Snapshot
  currentJuz?: number;
  currentSurah?: string;
  completedJuz?: number;
}

export interface OutingLog {
  id: string;
  studentName: string;
  date: string;
  timeOut: string;
  timeIn?: string;
  purpose: string;
  status: 'Out' | 'Returned';
}

export interface NavItem {
  id: string;
  label: string; // Now acts as a key or fallback
  icon: any;
  roles: UserRole[];
}

export interface DashboardStat {
  label: string; // Now acts as a key
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: any;
  color: string;
}

export type Language = 'en' | 'ur' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

// Phase 2 New Types

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  guardianName: string;
  appliedClass: string;
  madrasaLevel: MadrasaLevel;
  applicationDate: string;
  status: 'Pending' | 'Interview' | 'Approved' | 'Rejected';
  contact: string;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  classGrade: string;
  subjects: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  classGrade: string;
  marks: Record<string, number>;
  total: number;
  percentage: number;
  grade: string;
  rank: number;
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  block: string;
  capacity: number;
  occupied: number;
  occupants: string[]; // Student Names
}

export interface LeaveRequest {
  id: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string; // Added invoice number
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  type: 'Tuition' | 'Hostel' | 'Exam';
}

export interface StaffSalary {
  id: string;
  staffName: string;
  role: string;
  amount: number;
  month: string;
  status: 'Paid' | 'Pending';
}

export interface FeeStructure {
  id: string;
  classGrade: string;
  tuitionFee: number;
  hostelFee: number;
  transportFee: number;
  computerFee: number;
}

export interface FeeWaiver {
  id: string;
  studentId: string;
  studentName: string;
  waiverType: 'Flat' | 'Percentage';
  value: number;
  reason: string;
  date: string;
  approvedBy: string;
}

// Phase 3 Types

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Issued';
  issuedTo?: string;
  dueDate?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  route: string;
  capacity: number;
  studentsCount: number;
  status: 'Active' | 'Maintenance';
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'General' | 'Urgent' | 'Holiday' | 'Event';
  content: string;
  issuedBy: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
