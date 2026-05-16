import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import type { Lead, LeadResponse } from '../types';
import { LeadStatus, LeadSource } from '../types';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import { useDebounce } from '../hooks/useDebounce';
import { 
  Search, 
  Plus, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp,
  Users,
  Target,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
  <div className="premium-card p-6 flex items-center gap-4">
    <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<LeadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  
  const debouncedSearch = useDebounce(search, 500);

  // Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        sort,
      });
      if (status) params.append('status', status);
      if (source) params.append('source', source);

      const response = await api.get(`/leads?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, status, source, sort]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCreateOrUpdate = async (formData: any) => {
    setIsSubmitLoading(true);
    try {
      if (selectedLead) {
        await api.put(`/leads/${selectedLead._id}`, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully');
      }
      setIsFormOpen(false);
      fetchLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted');
        fetchLeads();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Leads" value={data?.total || 0} icon={Users} color="bg-primary-600 shadow-primary-200" />
        <StatCard label="Qualified" value={data?.leads.filter(l => l.status === LeadStatus.QUALIFIED).length || 0} icon={TrendingUp} color="bg-green-500 shadow-green-200" />
        <StatCard label="New Leads" value={data?.leads.filter(l => l.status === LeadStatus.NEW).length || 0} icon={Target} color="bg-blue-500 shadow-blue-200" />
        <StatCard label="Response Rate" value={78} icon={Clock} color="bg-amber-500 shadow-amber-200" />
      </div>

      {/* Main Controls Section */}
      <div className="premium-card p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 dark:text-slate-400 px-3 py-2 cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700" />
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 dark:text-slate-400 px-3 py-2 cursor-pointer"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="">All Sources</option>
                {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <select
              className="bg-slate-100 dark:bg-slate-800 border-none focus:ring-0 text-sm font-medium text-slate-600 dark:text-slate-400 px-4 py-3 rounded-xl cursor-pointer"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <button 
              onClick={handleExport}
              className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Export to CSV"
            >
              <Download size={20} />
            </button>

            <button
              onClick={() => {
                setSelectedLead(null);
                setIsFormOpen(true);
              }}
              className="btn-primary flex items-center gap-2 py-3"
            >
              <Plus size={20} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <LeadTable 
          leads={data?.leads || []} 
          isLoading={isLoading} 
          onEdit={(lead) => {
            setSelectedLead(lead);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />

        {/* Pagination Section */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800 dark:text-white">{data.leads.length}</span> of <span className="font-semibold text-slate-800 dark:text-white">{data.total}</span> leads
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={clsx(
                      "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                      page === i + 1 
                        ? "bg-primary-600 text-white shadow-md shadow-primary-200" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={page === data.pages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadForm
        isOpen={isFormOpen}
        lead={selectedLead}
        isLoading={isSubmitLoading}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
};

export default Dashboard;
