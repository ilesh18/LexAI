import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'overdue' | 'due-soon' | 'on-track' | 'resolved';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const configs = {
    overdue: { 
      label: 'Overdue', 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-200',
      dot: 'bg-red-600'
    },
    'due-soon': { 
      label: 'Due Soon', 
      bg: 'bg-amber-50', 
      text: 'text-amber-700', 
      border: 'border-amber-200',
      dot: 'bg-amber-600'
    },
    'on-track': { 
      label: 'On Track', 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200',
      dot: 'bg-green-600'
    },
    resolved: { 
      label: 'Resolved', 
      bg: 'bg-gray-50', 
      text: 'text-gray-700', 
      border: 'border-gray-200',
      dot: 'bg-gray-600'
    },
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
};
