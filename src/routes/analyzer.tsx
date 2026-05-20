import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { analyzeLegalSituation, getLegalRights } from "@/lib/groq";
import { Scale, ShieldCheck, Clock, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Gavel, LayoutDashboard, FileText, Search, Mic2, Settings, Globe, Info, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/analyzer")({
  component: AnalyzerPage,
});

const SAMPLES = [
  {
    label: "Unpaid Wages",
    text: "My employer in Bangalore has not paid my salary for the last 2 months. When I ask the HR, they say they have cash flow issues. Now they are threatening to fire me.",
  },
  {
    label: "Tenant Rights",
    text: "My landlord told me to vacate within 7 days without notice. I have a valid rental agreement for 8 more months.",
  },
  {
    label: "E-commerce Fraud",
    text: "I bought a phone online for ₹50,000. It arrived broken, and the seller refuses to refund me.",
  },
];

const STAGES = [
  "Consulting Indian Law Library...",
  "Analyzing provided facts...",
  "Applying relevant statutes...",
  "Generating legal report...",
];

function AnalyzerPage() {
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'rights'>('dashboard');
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!situation.trim() || isLoading) return;
    setIsLoading(true);
    setStage(0);
    setError(null);
    setResult(null);

    try {
      const response = activeView === 'dashboard' 
        ? await analyzeLegalSituation({ data: [{ role: "user", content: situation }] }) as any
        : await getLegalRights({ data: [{ role: "user", content: situation }] }) as any;
      
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      setResult(parsed);
    } catch (e) {
      console.error(e);
      setError("Failed to process situation. Please check your internet or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f0e8] text-[#1a1f2e] font-sans selection:bg-accent/30 overflow-hidden">
      <style>{`
        .grain-bg {
          background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 0);
          background-size: 4px 4px;
        }
      `}</style>
      
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-[#e8e0d0] bg-[#fdfaf5] flex flex-col z-20 shadow-sm shrink-0">
        <div className="p-6 border-b border-[#e8e0d0]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-bold text-lg rounded-sm group-hover:scale-105 transition-transform">L</div>
            <span className="font-serif font-bold text-xl tracking-tight">LexAI</span>
          </Link>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Workspace Alpha</p>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <p className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 italic">Analysis Engine</p>
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveView('dashboard'); setResult(null); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative
                ${activeView === 'dashboard' 
                  ? "bg-[#faf3e0] text-accent font-semibold border-l-2 border-accent" 
                  : "text-muted-foreground hover:bg-[#faf3e0]/50 hover:text-primary"}
              `}
            >
              <LayoutDashboard size={16} />
              Situation Dashboard
            </button>
            <button
              onClick={() => { setActiveView('rights'); setResult(null); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all relative
                ${activeView === 'rights' 
                  ? "bg-[#faf3e0] text-accent font-semibold border-l-2 border-accent" 
                  : "text-muted-foreground hover:bg-[#faf3e0]/50 hover:text-primary"}
              `}
            >
              <ShieldCheck size={16} />
              Know Your Rights
            </button>
          </nav>

          <p className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-10 mb-4 italic">Next Steps</p>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:bg-secondary/20 cursor-not-allowed opacity-60">
              <FileText size={16} />
              Draft Legal Notice
              <span className="ml-auto text-[8px] bg-accent/10 border border-accent/20 text-accent px-1.5 py-0.5 font-bold rounded-sm">PRO</span>
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-muted-foreground hover:bg-secondary/20 cursor-not-allowed opacity-60">
              <Mic2 size={16} />
              AI Oral Hearing
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-[#e8e0d0]">
          <div className="flex items-center gap-3 p-3 bg-white border border-[#e8e0d0] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-xs text-accent">A</div>
            <div className="flex-1">
              <p className="text-[11px] font-bold leading-none">Aryan Mahtha</p>
              <p className="text-[9px] text-[#b5892f] font-bold mt-1 uppercase tracking-wider">Advocate Elite</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto relative grain-bg">
        <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
          
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
               {activeView === 'dashboard' ? 'Module 01' : 'Module 02'}
             </span>
             <div className="h-px bg-accent/20 flex-1" />
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold italic">
               {activeView === 'dashboard' ? 'Strategic Intelligence' : 'Statutory Protection'}
             </span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-4">
            {activeView === 'dashboard' ? 'Situation Analyzer' : 'Know Your Rights Engine'}
          </h1>
          <p className="text-[#6b6560] text-lg max-w-2xl mb-12 leading-relaxed font-sans">
            {activeView === 'dashboard' 
              ? 'Get a high-level strategic overview of your case including risk levels, key facts, and immediate steps.'
              : 'Identify specific Indian Laws, Acts, and Sections that protect you. Plain-language explanations for citizens.'
            }
          </p>

          {/* Input Box */}
          <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm relative mb-12">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold italic">Enter Legal Premise</p>
              <span className="text-[9px] text-accent font-bold uppercase tracking-widest">Confidential Engine</span>
            </div>
            <textarea
              className="w-full min-h-[160px] p-6 bg-[#f5f0e8]/30 border border-[#e8e0d0] text-lg font-serif focus:outline-none focus:border-accent transition-colors resize-none placeholder:italic"
              placeholder="Describe your situation in detail..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
            
            <div className="mt-6 flex flex-wrap gap-2">
              {SAMPLES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSituation(s.text)}
                  className="text-[10px] px-3 py-1.5 border border-[#e8e0d0] text-[#6b6560] hover:bg-[#faf3e0] hover:border-accent hover:text-accent transition-all font-bold uppercase tracking-wider"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[#e8e0d0] flex items-center justify-between">
              <button
                onClick={handleAnalyze}
                disabled={!situation.trim() || isLoading}
                className={`flex items-center gap-3 px-10 py-5 text-sm font-bold transition-all active:scale-95
                  ${isLoading || !situation.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/95 shadow-lg"}
                `}
              >
                {isLoading ? <Scale className="animate-spin text-accent" size={20} /> : <Zap size={20} className="fill-accent text-accent" />}
                {isLoading ? "Consulting Engine..." : "Analyze Legal Premise"}
              </button>
              
              <div className="flex items-center gap-4 text-right">
                 <div>
                   <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Intelligence Layer</p>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Llama-3.3-70B</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Loading View */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white border border-accent/20 p-16 text-center shadow-xl"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Scale className="text-accent animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">Synthesizing Legal Logic</h3>
                <p className="text-accent text-xs font-bold mb-8 uppercase tracking-[0.2em]">{STAGES[stage]}</p>
                <div className="max-w-xs mx-auto h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results View - Dashboard */}
          {result && activeView === 'dashboard' && (
            <div className="lex-result space-y-8 animate-in fade-in duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 bg-white border border-[#e8e0d0] shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold mb-2">Legal Domain</p>
                   <h3 className="font-serif text-xl font-bold text-primary">{result.legalDomain}</h3>
                 </div>
                 <div className="p-6 bg-white border border-[#e8e0d0] shadow-sm flex items-center justify-between">
                   <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6560] font-bold mb-2">Detected Language</p>
                    <h3 className="font-serif text-xl font-bold text-primary">{result.languageDetected}</h3>
                   </div>
                   <Globe size={24} className="text-accent/40" />
                 </div>
                 <div className={`p-6 border shadow-sm flex items-center justify-between
                   ${result.riskLevel === 'High' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}
                 `}>
                   <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60">Risk Level</p>
                    <h3 className={`font-serif text-xl font-bold ${result.riskLevel === 'High' ? 'text-red-700' : 'text-green-700'}`}>{result.riskLevel}</h3>
                   </div>
                   <AlertTriangle size={24} className={result.riskLevel === 'High' ? 'text-red-400' : 'text-green-400'} />
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-6 italic underline decoration-accent decoration-2 underline-offset-4">Core Discrepancies (Key Facts)</p>
                   <ul className="space-y-4">
                     {result.keyFacts?.map((fact: string, i: number) => (
                       <li key={i} className="flex gap-4 text-sm font-semibold text-primary/80">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                         {fact}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
                   <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-6 italic underline decoration-accent decoration-2 underline-offset-4">Suggested Actions</p>
                   <ul className="space-y-5">
                     {result.suggestedActions?.map((action: string, i: number) => (
                       <li key={i} className="flex gap-4 text-xs font-bold leading-relaxed items-start">
                         <span className="w-6 h-6 rounded-sm bg-primary text-white flex items-center justify-center text-[11px] shrink-0">{i+1}</span>
                         {action}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>

              <div className="p-8 bg-primary text-white/90 font-serif text-lg leading-relaxed shadow-lg border-l-8 border-accent">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-4 font-sans">Risk Assessment</p>
                {result.riskExplanation}
                <button 
                  onClick={() => setActiveView('rights')}
                  className="mt-8 flex items-center gap-3 text-xs font-bold text-accent uppercase tracking-widest hover:gap-5 transition-all"
                >
                  View Statutory Protections <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Results View - Rights Engine */}
          {result && activeView === 'rights' && (
            <div ref={resultsRef} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* Use the rich rights engine UI here */}
               <div className="bg-white border border-[#e8e0d0] p-10 shadow-sm border-t-4 border-accent">
                  <div className="flex items-center justify-between mb-8">
                     <span className="px-4 py-1.5 bg-accent/10 text-accent font-bold text-[10px] uppercase tracking-[0.1em] border border-accent/20">Statutory Rights Search: Result Found</span>
                     <Scale size={32} className="text-secondary/50" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4">{result.situationSummary}</h2>
                  <div className="text-lg italic text-[#6b6560] font-serif leading-relaxed mb-8">
                    "{result.rightsOverview}"
                  </div>
                  
                  <div className="grid gap-4 mt-12">
                     <p className="text-[10px] uppercase tracking-[0.3em] text-[#6b6560] font-bold mb-2">Identified Legal Acts</p>
                     {result.laws?.map((law: any) => (
                       <div key={law.id} className="border border-[#e8e0d0] bg-[#fdfaf5]/30">
                          <div className="p-6 flex items-center cursor-pointer" onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}>
                             <div className="w-10 h-10 bg-white border border-[#e8e0d0] flex items-center justify-center font-bold mr-6 text-sm">{law.id}</div>
                             <div className="flex-1">
                               <p className="text-[9px] uppercase font-bold text-accent mb-1 tracking-wider">{law.shortName}</p>
                               <h4 className="font-serif text-xl font-bold text-primary leading-tight">{law.name}</h4>
                             </div>
                             <div className={`px-2 py-1 text-[8px] font-bold uppercase tracking-tighter border mr-6 ${law.relevance === 'primary' ? 'bg-accent text-white border-accent' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {law.relevance}
                             </div>
                             <ChevronDown size={16} className={`transition-transform duration-300 ${expandedLaw === law.id ? 'rotate-180' : ''}`} />
                          </div>
                          <AnimatePresence>
                            {expandedLaw === law.id && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white border-t border-[#e8e0d0]">
                                <div className="p-8 grid md:grid-cols-12 gap-8">
                                   <div className="md:col-span-8">
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4">The Protection</p>
                                      <p className="text-lg font-serif italic text-primary leading-relaxed border-l-4 border-accent/20 pl-6 mb-8">{law.plainExplanation}</p>
                                      <div className="space-y-3">
                                         {law.keyRights?.map((r: string) => (
                                           <div key={r} className="flex gap-4 text-xs font-bold text-primary/70">
                                              <CheckCircle2 size={14} className="text-green-500 shrink-0" /> {r}
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="md:col-span-4 bg-[#fdfaf5] p-6 border border-[#e8e0d0]">
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4">Statute Detail</p>
                                      <div className="flex flex-wrap gap-2 mb-8">
                                         {law.sections?.map((s: string) => <span key={s} className="px-2 py-1 bg-primary text-white text-[9px] font-bold uppercase">{s}</span>)}
                                      </div>
                                      <div className="p-4 bg-white border border-[#e8e0d0]">
                                         <p className="text-[9px] uppercase font-bold text-accent mb-2">Violation Penalty</p>
                                         <p className="text-[11px] font-bold text-primary leading-relaxed italic">{law.penalty}</p>
                                      </div>
                                   </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-6 flex items-center gap-4 mt-8">
              <AlertTriangle className="text-red-600 font-bold" />
              <p className="text-sm text-red-600 font-bold">{error}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
