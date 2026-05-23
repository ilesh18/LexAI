import React from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, ChevronRight } from 'lucide-react';
import { Case } from '../../lib/firestoreHelpers';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface CaseCardProps {
  caseData: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData }) => {
  const getCaseStatus = () => {
    if (caseData.status === 'resolved') return 'resolved';
    
    const now = new Date();
    const activeDeadlines = caseData.deadlines.filter(d => !d.completed);
    
    if (activeDeadlines.length === 0) return 'on-track';
    
    const nextDeadline = activeDeadlines.reduce((earliest, current) => {
      return current.dueDate.toDate() < earliest.dueDate.toDate() ? current : earliest;
    });

    const dueDate = nextDeadline.dueDate.toDate();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'due-soon';
    return 'on-track';
  };

  const status = getCaseStatus();
  const nextDeadline = caseData.deadlines.filter(d => !d.completed).sort((a,b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime())[0];

  return (
    <Link 
      to="/tracker/$caseId" 
      params={{ caseId: caseData.id! }}
      className="group block bg-white rounded-xl border border-border p-5 hover:shadow-md transition-all hover:border-[#D4AF37]/50"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
            {caseData.legalDomain}
          </span>
          <h3 className="mt-2 text-lg font-serif font-bold text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {caseData.title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-3">
        {nextDeadline ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="text-[#D4AF37]" />
            <span>Next: {nextDeadline.label}</span>
            <span className="text-xs ml-auto font-medium">
              {formatDistanceToNow(nextDeadline.dueDate.toDate(), { addSuffix: true })}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">No upcoming deadlines</div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {caseData.deadlines.filter(d => d.completed).length}/{caseData.deadlines.length} Tasks Done
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
          View Details <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
};
