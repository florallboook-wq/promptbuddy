/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  PromptTone, 
  PromptFormat, 
  PromptTemplate 
} from '../utils/promptBuilder';
import { Sparkles, Layout, Type, MessageSquare, Wand2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface PromptFormProps {
  onSubmit: (data: any) => void;
  className?: string;
}

export default function PromptForm({ onSubmit, className }: PromptFormProps) {
  const [formData, setFormData] = React.useState({
    task: '',
    context: '',
    tone: 'Professional' as PromptTone,
    format: 'Paragraph' as PromptFormat,
    template: 'Text / Writing' as PromptTemplate,
    enhance: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm",
        className
      )}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Layout className="w-4 h-4 text-violet-500" />
          Prompt Type
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'Text / Writing', 'Photo Editing', 'Image Generation', 
            'Code / Dev', 'Research & Analysis', 'Summarization', 
            'Brainstorming', 'Translation'
          ].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, template: t as PromptTemplate }))}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                formData.template === t 
                  ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100 dark:shadow-violet-900/20" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-500"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          Task / Goal
        </label>
        <input
          type="text"
          name="task"
          placeholder="e.g., Analyze gold prices over the last 2 years"
          value={formData.task}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-500" />
          Context (Optional)
        </label>
        <textarea
          name="context"
          placeholder="Add any specific background info or details..."
          value={formData.context}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none resize-none dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-violet-500" />
            Tone
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none dark:text-white"
          >
            <option className="dark:bg-slate-900">Professional</option>
            <option className="dark:bg-slate-900">Casual</option>
            <option className="dark:bg-slate-900">Friendly</option>
            <option className="dark:bg-slate-900">Formal</option>
            <option className="dark:bg-slate-900">Persuasive</option>
            <option className="dark:bg-slate-900">Creative</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layout className="w-4 h-4 text-violet-500" />
            Output Format
          </label>
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none dark:text-white"
          >
            <option className="dark:bg-slate-900">Paragraph</option>
            <option className="dark:bg-slate-900">Bullet Points</option>
            <option className="dark:bg-slate-900">Table</option>
            <option className="dark:bg-slate-900">Email</option>
            <option className="dark:bg-slate-900">Message</option>
            <option className="dark:bg-slate-900">Essay</option>
            <option className="dark:bg-slate-900">Step-by-step</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-900/30">
        <input
          type="checkbox"
          id="enhance"
          name="enhance"
          checked={formData.enhance}
          onChange={handleChange}
          className="w-5 h-5 rounded border-violet-300 dark:border-violet-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
        />
        <label htmlFor="enhance" className="text-sm font-medium text-violet-900 dark:text-violet-300 cursor-pointer flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Auto-enhance prompt (Add depth & expert insights)
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Generate Smart Prompt
      </button>
    </form>
  );
}
