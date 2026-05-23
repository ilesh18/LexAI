import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/site/Layout';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Case, toggleDeadline, addDeadline, updateCase, deleteCase } from '@/lib/firestoreHelpers';
import { StatusBadge } from '@/components/tracker/StatusBadge';
import { DeadlineItem } from '@/components/tracker/DeadlineItem';
import { Reveal } from '@/components/site/Reveal';
import { ChevronLeft, Plus, CheckCircle2, Trash2, Calendar, FileText, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const Route = createFileRoute('/tracker/$caseId')({
  component: CaseDetailPage,
});

function CaseDetailPage() {
  const { user } = useAuth();
  const { caseId } = useParams({ from: '/tracker/$caseId' });
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [newDeadline, setNewDeadline] = useState({ label: '', dueDate: '' });
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);

  useEffect(() => {
    if (!user || !caseId) return;

    const caseRef = doc(db, 'users', user.uid, 'cases', caseId);
    const unsubscribe = onSnapshot(caseRef, (snapshot) => {
      if (snapshot.exists()) {
        setCaseData({ id: snapshot.id, ...snapshot.data() } as Case);
      } else {
        toast.error('Case not found');
        navigate({ to: '/tracker' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, caseId]);

  const handleToggle = async (idx: number) => {
    if (!user || !caseData) return;
    try {
      await toggleDeadline(user.uid, caseId, idx, caseData.deadlines);
    } catch (error) {
      toast.error('Failed to update deadline');
    }
  };

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !caseData || !newDeadline.label || !newDeadline.dueDate) return;

    try {
      await addDeadline(user.uid, caseId, {
        label: newDeadline.label,
        dueDate: Timestamp.fromDate(new Date(newDeadline.dueDate)),
        completed: false,
        priority: 'medium'
      }, caseData.deadlines);
      setNewDeadline({ label: '', dueDate: '' });
      setIsAddingDeadline(false);
      toast.success('Deadline added');
    } catch (error) {
      toast.error('Failed to add deadline');
    }
  };

  const handleResolve = async () => {
    if (!user || !caseData) return;
    try {
      await updateCase(user.uid, caseId, { status: 'resolved' });
      toast.success('Case marked as resolved');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this case tracker?')) return;
    if (!user) return;
    try {
      await deleteCase(user.uid, caseId);
      toast.success('Case tracker deleted');
      navigate({ to: '/tracker' });
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSaveNotes = async (val: string) => {
    if (!user) return;
    try {
      await updateCase(user.uid, caseId, { notes: val });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div></div>;
  if (!caseData) return null;

  const sortedDeadlines = [...caseData.deadlines].sort((a,b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime());


  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F0E8] py-12 px-4 shadow-inner">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate({ to: '/tracker' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors"
            >
              <ChevronLeft size={16} /> Dashboard
            </button>
            <div className="flex gap-2">
            <button 
                onClick={handleResolve}
                className="px-4 py-2 text-xs font-bold bg-white border border-border rounded-lg text-green-600 hover:bg-green-50"
              >
                Mark Resolved
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete Case"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                      {caseData.legalDomain}
                    </span>
                    <StatusBadge status={caseData.status === 'resolved' ? 'resolved' : 'on-track'} />
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">{caseData.title}</h1>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{caseData.description}</p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                      <Calendar className="text-[#D4AF37]" size={20} /> Timeline & Deadlines
                    </h2>
                    <button 
                      onClick={() => setIsAddingDeadline(true)}
                      className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Deadline
                    </button>
                  </div>

                  <div className="space-y-4">
                    {isAddingDeadline && (
                      <form onSubmit={handleAddDeadline} className="mb-8 p-4 bg-[#F5F0E8] rounded-xl border border-border animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input
                            autoFocus
                            required
                            placeholder="Task label..."
                            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                            value={newDeadline.label}
                            onChange={e => setNewDeadline({ ...newDeadline, label: e.target.value })}
                          />
                          <input
                            required
                            type="date"
                            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                            value={newDeadline.dueDate}
                            onChange={e => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setIsAddingDeadline(false)} className="px-3 py-1 text-xs text-muted-foreground">Cancel</button>
                          <button type="submit" className="px-4 py-1 text-xs bg-[#D4AF37] text-white rounded-lg font-bold">Add</button>
                        </div>
                      </form>
                    )}

                    {sortedDeadlines.length > 0 ? (
                      <div className="mt-4">
                        {sortedDeadlines.map((d, idx) => (
                          <DeadlineItem 
                            key={idx} 
                            deadline={d} 
                            onToggle={() => handleToggle(caseData.deadlines.findIndex(x => x === d))} 
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground text-sm">No deadlines set for this case.</p>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-[#D4AF37]" /> Case Notes
                  </h3>
                  <textarea
                    className="w-full h-64 bg-[#F5F0E8] rounded-xl p-4 text-sm focus:outline-none resize-none border border-transparent focus:border-[#D4AF37]/30 transition-all italic text-gray-700"
                    placeholder="Record case findings, lawyer names, or session details here..."
                    defaultValue={caseData.notes}
                    onBlur={(e) => handleSaveNotes(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 text-right">Auto-saves on blur</p>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-4 text-[#D4AF37]">
                    <Bookmark size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Reminders</h3>
                  </div>
                  <ul className="space-y-4 text-xs">
                    <li className="flex gap-2">
                      <span className="text-[#D4AF37] font-bold">1</span>
                      <span className="text-gray-300">Push notifications are sent 7, 3, and 1 day before each deadline.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D4AF37] font-bold">2</span>
                      <span className="text-gray-300">Keep your contact details updated in profile to receive SMS alerts.</span>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
