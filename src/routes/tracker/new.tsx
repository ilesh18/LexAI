import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { createCase, LEGAL_DOMAINS, getSmartPresets } from '@/lib/firestoreHelpers';
import { Reveal } from '@/components/site/Reveal';
import { ChevronLeft, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/tracker/new')({
  component: NewCasePage,
});

import { Layout } from '@/components/site/Layout';

function NewCasePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    legalDomain: 'Consumer',
    description: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const presets = getSmartPresets(formData.legalDomain);
      await createCase(user.uid, {
        ...formData,
        deadlines: presets as any,
      });
      toast.success('Case tracker created successfully!');
      navigate({ to: '/tracker' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create case tracker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F0E8] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate({ to: '/tracker' })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#D4AF37] mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>

          <Reveal>
            <div className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="bg-[#1A1A1A] p-8 text-white">
                <h1 className="text-3xl font-serif font-bold">New Case Tracker</h1>
                <p className="text-gray-400 mt-2">Initialize your legal tracking with smart presets.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                      Case Title
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Unpaid wages — Ramesh Sharma"
                      className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 focus:border-[#D4AF37] focus:outline-none transition-all font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                      Legal Domain
                    </label>
                    <select
                      value={formData.legalDomain}
                      onChange={e => setFormData({ ...formData, legalDomain: e.target.value })}
                      className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                    >
                      {LEGAL_DOMAINS.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#D4AF37] font-medium">
                      <Sparkles size={12} />
                      Auto-populates standard deadlines for {formData.legalDomain}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                      Short Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Briefly describe the context of this case..."
                      className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : <><Save size={18} /> Initialize Tracker</>}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
