/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import PromptForm from './components/PromptForm';
import PromptOutput from './components/PromptOutput';
import { buildPrompt } from './utils/promptBuilder';
import { PREBUILT_PROMPTS, CATEGORY_ICONS, PROMPT_CATEGORIES, TOOLS_AND_EXTENSIONS, TOOL_CATEGORIES, TOOL_CATEGORY_ICONS } from './constants';
import { Sparkles, Zap, ShieldCheck, Globe, ChevronRight, Copy, ExternalLink, Search, Terminal, Wrench, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

const Typewriter = ({ text, delay = 0.08 }: { text: string; delay?: number }) => {
  const [key, setKey] = React.useState(0);
  
  React.useEffect(() => {
    // Calculate duration: typing time + 3 seconds pause
    const totalDuration = (text.length * delay + 3) * 1000;
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, totalDuration);
    return () => clearInterval(interval);
  }, [text, delay]);

  const letters = text.split("");
  return (
    <span key={key} className="inline-flex items-baseline">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{
            duration: 0.05,
            delay: index * delay,
            ease: "easeIn",
          }}
          className="overflow-hidden whitespace-nowrap"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-1 w-[3px] h-[0.8em] bg-indigo-600 dark:bg-indigo-400 inline-block translate-y-[0.1em]"
      />
    </span>
  );
};

export default function App() {
  const [generatedPrompt, setGeneratedPrompt] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeToolCategory, setActiveToolCategory] = React.useState<string | null>(null);
  const [toolTypeFilter, setToolTypeFilter] = React.useState<string>('All');
  const [toolPriceFilter, setToolPriceFilter] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [toolSearchQuery, setToolSearchQuery] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleGenerate = (data: any) => {
    const prompt = buildPrompt(data);
    setGeneratedPrompt(prompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPrebuilt = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    Object.entries(PREBUILT_PROMPTS).forEach(([category, prompts]) => {
      prompts.forEach(p => {
        if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
          results.push({ ...p, category });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const filteredTools = React.useMemo(() => {
    let results = TOOLS_AND_EXTENSIONS;

    // Filter by Category
    if (activeToolCategory && !toolSearchQuery.trim()) {
      results = results.filter(t => t.category === activeToolCategory);
    }

    // Filter by Type
    if (toolTypeFilter !== 'All') {
      results = results.filter(t => t.type.includes(toolTypeFilter));
    }

    // Filter by Price
    if (toolPriceFilter !== 'All') {
      results = results.filter(t => t.freeType.includes(toolPriceFilter));
    }

    // Filter by Search
    if (toolSearchQuery.trim()) {
      const query = toolSearchQuery.toLowerCase();
      results = results.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    return results;
  }, [toolSearchQuery, activeToolCategory, toolTypeFilter, toolPriceFilter]);

  const toolTypes = React.useMemo(() => {
    const types = new Set<string>();
    TOOLS_AND_EXTENSIONS.forEach(t => {
      if (t.type.includes('/')) {
        t.type.split('/').forEach(s => types.add(s.trim()));
      } else {
        types.add(t.type);
      }
    });
    return ['All', ...Array.from(types)].sort();
  }, []);

  const priceTypes = ['All', 'Free', 'Freemium', 'Paid'];

  return (
    <div>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">PromptBuddy</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#generator" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Generator</a>
            <a href="#library" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Library</a>
            <a href="#tools" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Tools & Extensions</a>
          </nav>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero & Generator Section */}
          <div id="generator" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-48">
            
            {/* Left Column: Hero & Info */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight"
                >
                  Master the Art of <span className="text-violet-600 dark:text-violet-400"><Typewriter text="AI Prompting." /></span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md"
                >
                  Generate high-quality, structured, and intelligent prompts for any AI model. Save time and get better results with built-in intelligence.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Structured Output</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Every prompt follows industry-standard frameworks for maximum clarity.</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Multi-Template</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">From business analysis to creative writing, we've got you covered.</p>
                </div>
              </div>
            </div>

            {/* Right Column: App Interface */}
            <div className="lg:col-span-7 space-y-8">
              <PromptForm onSubmit={handleGenerate} />
              <PromptOutput prompt={generatedPrompt} />
            </div>

          </div>

          {/* Library Section */}
          <div id="library" className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Prompt Library</h2>
              <p className="text-slate-600 dark:text-slate-400">Explore our collection of pre-built, high-performance prompts for every situation.</p>
              
              <div className="relative max-w-md mx-auto mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm dark:text-white"
                />
              </div>
            </div>

            {/* Categories Grid */}
            {!searchQuery && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {PROMPT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={cn(
                      "p-6 rounded-2xl border transition-all text-left space-y-3 group",
                      activeCategory === cat 
                        ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100 dark:shadow-violet-900/20" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors",
                      activeCategory === cat ? "bg-white/20" : "bg-slate-50 dark:bg-slate-800 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/30"
                    )}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{cat}</h3>
                      <p className={cn(
                        "text-xs mt-1",
                        activeCategory === cat ? "text-violet-100" : "text-slate-400 dark:text-slate-500"
                      )}>
                        {PREBUILT_PROMPTS[cat].length} Prompts
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Prompts Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {(searchQuery ? filteredPrompts : (activeCategory ? PREBUILT_PROMPTS[activeCategory] : null))?.map((p: any) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-md uppercase tracking-wider">
                          {p.category || activeCategory}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{p.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
                      
                      {/* Prompt Preview */}
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 relative group/prompt">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prompt Preview</span>
                        </div>
                        <p className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 italic">
                          {p.prompt}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
                      <button 
                        onClick={() => handleCopyPrebuilt(p.prompt, p.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                          copiedId === p.id 
                            ? "bg-violet-500 text-white" 
                            : "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700"
                        )}
                      >
                        {copiedId === p.id ? (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Prompt
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setGeneratedPrompt(p.prompt);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                        title="View in Generator"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {searchQuery && filteredPrompts?.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No prompts found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Tools & Extensions Section */}
      <section id="tools" className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-bold mb-6 tracking-wide uppercase"
            >
              <Wrench className="w-4 h-4" />
              Ecosystem
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Tools & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600">Extensions</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Supercharge your workflow with the best AI add-ons, automation tools, and productivity extensions.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 max-w-4xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search tools..."
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm dark:text-white"
                />
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={toolTypeFilter}
                  onChange={(e) => setToolTypeFilter(e.target.value)}
                  className="flex-1 md:flex-none px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  <option value="All">All Types</option>
                  {toolTypes.filter(t => t !== 'All').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select 
                  value={toolPriceFilter}
                  onChange={(e) => setToolPriceFilter(e.target.value)}
                  className="flex-1 md:flex-none px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  <option value="All">All Pricing</option>
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeToolCategory || toolTypeFilter !== 'All' || toolPriceFilter !== 'All') && !toolSearchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {activeToolCategory && (
                <button 
                  onClick={() => setActiveToolCategory(null)}
                  className="px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-violet-200 transition-colors"
                >
                  {activeToolCategory} ✕
                </button>
              )}
              {toolTypeFilter !== 'All' && (
                <button 
                  onClick={() => setToolTypeFilter('All')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                >
                  Type: {toolTypeFilter} ✕
                </button>
              )}
              {toolPriceFilter !== 'All' && (
                <button 
                  onClick={() => setToolPriceFilter('All')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                >
                  Price: {toolPriceFilter} ✕
                </button>
              )}
              <button 
                onClick={() => {
                  setActiveToolCategory(null);
                  setToolTypeFilter('All');
                  setToolPriceFilter('All');
                }}
                className="text-xs text-slate-400 hover:text-violet-600 underline underline-offset-4"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Tool Categories Grid */}
          {!toolSearchQuery && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {TOOL_CATEGORIES.map((cat) => {
                const count = TOOLS_AND_EXTENSIONS.filter(t => t.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveToolCategory(activeToolCategory === cat ? null : cat)}
                    className={cn(
                      "p-6 rounded-2xl border transition-all text-left space-y-3 group",
                      activeToolCategory === cat 
                        ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100 dark:shadow-violet-900/20" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors",
                      activeToolCategory === cat ? "bg-white/20" : "bg-slate-50 dark:bg-slate-800 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/30"
                    )}>
                      {TOOL_CATEGORY_ICONS[cat] || "🛠️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{cat}</h3>
                      <p className={cn(
                        "text-xs mt-1",
                        activeToolCategory === cat ? "text-violet-100" : "text-slate-400 dark:text-slate-500"
                      )}>
                        {count} Tools
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tools Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTools?.map((tool, idx) => (
                <motion.div
                  key={`${tool.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-md uppercase tracking-wider">
                        {tool.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider">
                        {tool.type}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-2">{tool.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tool.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-medium">Best For:</span>
                        <span className="text-slate-600 dark:text-slate-300">{tool.bestFor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-medium">Pricing:</span>
                        <span className="text-slate-600 dark:text-slate-300">{tool.freeType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <a 
                      href={tool.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold transition-all"
                    >
                      Visit Tool <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {(toolSearchQuery && filteredTools?.length === 0) && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Made with 💜 by Dhanashree Bhadsale · PromptBuddy · Copy freely and use anywhere
          </p>
        </div>
      </footer>
    </div>
  </div>
);
}

