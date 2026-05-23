import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Deadline } from '../../lib/firestoreHelpers';
import { format } from 'date-fns';

interface DeadlineItemProps {
  deadline: Deadline;
  onToggle: () => void;
}

export const DeadlineItem: React.FC<DeadlineItemProps> = ({ deadline, onToggle }) => {
  const isOverdue = !deadline.completed && deadline.dueDate.toDate() < new Date();
  
  return (
    <div 
      className={`relative pl-8 pb-8 transition-opacity ${deadline.completed ? 'opacity-60' : 'opacity-100'}`}
    >
      {/* Line */}
      <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-border" />
      
      {/* Icon */}
      <button 
        onClick={onToggle}
        className={`absolute left-0 top-0 z-10 p-0.5 rounded-full bg-white transition-colors ${
          deadline.completed ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-[#D4AF37]'
        }`}
      >
        {deadline.completed ? (
          <CheckCircle2 size={24} />
        ) : (
          <Circle size={24} className="hover:fill-[#F5F0E8]" />
        )}
      </button>

      <div className={`p-4 rounded-xl border ${
        deadline.completed 
          ? 'bg-gray-50 border-gray-200' 
          : isOverdue 
            ? 'bg-red-50 border-red-200' 
            : 'bg-white border-border'
      } shadow-sm transition-all`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className={`font-bold ${deadline.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {deadline.label}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>Due: {format(deadline.dueDate.toDate(), 'PPP')}</span>
              {isOverdue && (
                <span className="flex items-center gap-1 text-red-600 font-bold ml-2">
                  <AlertCircle size={12} /> Overdue
                </span>
              )}
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${
            deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
            deadline.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {deadline.priority}
          </span>
        </div>
      </div>
    </div>
  );
};
