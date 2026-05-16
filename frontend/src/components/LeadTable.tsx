import React from 'react';
import type { Lead } from '../types';
import { LeadStatus, UserRole } from '../types';
import { Edit2, Trash2, ExternalLink, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const styles = {
    [LeadStatus.NEW]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    [LeadStatus.CONTACTED]: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    [LeadStatus.QUALIFIED]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    [LeadStatus.LOST]: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider", styles[status])}>
      {status}
    </span>
  );
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, isLoading }) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Mail size={32} />
        </div>
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm">Try adjusting your filters or add a new lead.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
            <th className="px-6 py-2">Lead Information</th>
            <th className="px-6 py-2">Status</th>
            <th className="px-6 py-2">Source</th>
            <th className="px-6 py-2">Created Date</th>
            <th className="px-6 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-transparent">
          {leads.map((lead) => (
            <tr key={lead._id} className="premium-card group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary-600 font-bold">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <ExternalLink size={14} className="text-slate-400" />
                  {lead.source}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(lead)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  {user?.role === UserRole.ADMIN && (
                    <button 
                      onClick={() => onDelete(lead._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
