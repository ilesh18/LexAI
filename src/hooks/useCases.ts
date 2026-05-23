import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Case } from '../lib/firestoreHelpers';

export const useCases = (uid: string | undefined) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    overdue: 0,
    resolved: 0,
  });

  useEffect(() => {
    if (!uid) {
      setCases([]);
      setLoading(false);
      return;
    }

    const casesRef = collection(db, 'users', uid, 'cases');
    const q = query(casesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Case[];

      setCases(casesData);
      
      // Calculate stats
      const now = new Date();
      let active = 0;
      let overdueCount = 0;
      let resolved = 0;

      casesData.forEach((c) => {
        if (c.status === 'resolved') {
          resolved++;
        } else {
          active++;
          // Check if any deadline is overdue
          const hasOverdue = c.deadlines.some(
            (d) => !d.completed && d.dueDate.toDate() < now
          );
          if (hasOverdue) {
            overdueCount++;
            // Note: We could update the case status in Firestore here, 
            // but for now we'll just track it in UI stats.
          }
        }
      });

      setStats({
        total: casesData.length,
        active,
        overdue: overdueCount,
        resolved,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { cases, stats, loading };
};
