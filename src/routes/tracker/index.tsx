import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useCases } from '@/hooks/useCases';
import { CaseCard } from '@/components/tracker/CaseCard';
import { Plus, LayoutGrid, ListFilter, Search } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';

export const Route = createFileRoute('/tracker/')({
  component: TrackerDashboard,
});

import { Layout } from '@/components/site/Layout';

function TrackerDashboard() {
  const { user } = useAuth();
  const { cases, stats, loading } = useCases(user?.uid);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F0E8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <Reveal>
              <div>
                <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Case Tracker</h1>
                <p className="mt-2 text-muted-foreground">Manage your legal errands and deadlines efficiently.</p>
              </div>
            </Reveal>
            
            <Link
              to="/tracker/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              <Plus size={18} /> Add New Case
            </Link>
          </div>

          {/* Stats Bar */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Cases', value: stats.total, color: 'text-[#1A1A1A]' },
                { label: 'Active', value: stats.active, color: 'text-[#D4AF37]' },
                { label: 'Overdue', value: stats.overdue, color: 'text-red-600' },
                { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                  <p className={`mt-2 text-3xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Filters/Search (Visual Only for now) */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search cases..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-sm hover:bg-gray-50">
                <ListFilter size={16} /> Filter
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg border border-border p-1">
              <button className="p-1.5 rounded bg-gray-100"><LayoutGrid size={16} /></button>
            </div>
          </div>

          {/* Cases Grid */}
          {cases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((c, idx) => (
                <Reveal key={c.id} delay={idx * 0.05}>
                  <CaseCard caseData={c} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-border p-20 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8] text-[#D4AF37] mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold">No cases tracking yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Start tracking your first legal case to never miss a deadline.</p>
              <Link
                to="/tracker/new"
                className="inline-flex items-center justify-center rounded-lg border-2 border-[#D4AF37] px-6 py-2 text-sm font-bold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
