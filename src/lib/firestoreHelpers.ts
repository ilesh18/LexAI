import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

export interface Deadline {
  id?: string;
  label: string;
  dueDate: Timestamp;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Case {
  id?: string;
  title: string;
  legalDomain: string;
  description: string;
  status: 'active' | 'resolved' | 'overdue';
  createdAt: any;
  deadlines: Deadline[];
  notes: string;
}

export const LEGAL_DOMAINS = [
  'Labour',
  'Consumer',
  'RTI',
  'Civil',
  'Criminal',
  'Other'
];

export const getSmartPresets = (domain: string): Partial<Deadline>[] => {
  const now = new Date();
  
  switch (domain) {
    case 'Consumer':
      return [
        { label: 'File within 2 years of incident', dueDate: Timestamp.fromDate(new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)), completed: false, priority: 'high' }
      ];
    case 'RTI':
      return [
        { label: 'First appeal within 30 days of rejection', dueDate: Timestamp.fromDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)), completed: false, priority: 'high' }
      ];
    case 'Labour':
      return [
        { label: 'Application within 3 years', dueDate: Timestamp.fromDate(new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)), completed: false, priority: 'medium' }
      ];
    case 'Legal Notice':
      return [
        { label: 'Reply expected within 15–30 days', dueDate: Timestamp.fromDate(new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)), completed: false, priority: 'high' }
      ];
    default:
      return [];
  }
};

export const createCase = async (uid: string, caseData: Partial<Case>) => {
  const casesRef = collection(db, 'users', uid, 'cases');
  return addDoc(casesRef, {
    ...caseData,
    status: 'active',
    createdAt: serverTimestamp(),
    deadlines: caseData.deadlines || [],
    notes: caseData.notes || '',
  });
};

export const updateCase = async (uid: string, caseId: string, updates: Partial<Case>) => {
  const caseRef = doc(db, 'users', uid, 'cases', caseId);
  return updateDoc(caseRef, updates);
};

export const deleteCase = async (uid: string, caseId: string) => {
  const caseRef = doc(db, 'users', uid, 'cases', caseId);
  return deleteDoc(caseRef);
};

export const addDeadline = async (uid: string, caseId: string, deadline: Deadline, existingDeadlines: Deadline[]) => {
  const caseRef = doc(db, 'users', uid, 'cases', caseId);
  return updateDoc(caseRef, {
    deadlines: [...existingDeadlines, deadline]
  });
};

export const toggleDeadline = async (uid: string, caseId: string, deadlineIndex: number, existingDeadlines: Deadline[]) => {
  const updatedDeadlines = [...existingDeadlines];
  updatedDeadlines[deadlineIndex].completed = !updatedDeadlines[deadlineIndex].completed;
  
  const caseRef = doc(db, 'users', uid, 'cases', caseId);
  return updateDoc(caseRef, {
    deadlines: updatedDeadlines
  });
};
