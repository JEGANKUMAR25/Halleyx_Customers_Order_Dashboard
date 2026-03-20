import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { generateChartWidget } from '../../api';

const ChartGenerator = ({ onAddWidget }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await generateChartWidget(prompt);
      if (res.data?.widget) {
        onAddWidget(res.data.widget);
        setPrompt('');
      } else {
        setError('Failed to generate chart. Please try rephrasing.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card mb-8 border-t-2 border-indigo-500/50 bg-gradient-to-r from-indigo-900/10 to-blue-900/10">
      <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/30">
          <Sparkles className="text-indigo-400" size={24} />
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-lg font-bold text-white mb-1">AI Chart Generator</h3>
          <p className="text-sm text-slate-400 mb-3 md:mb-0">Describe the data you want to see, and AI will build the widget for you automatically.</p>
        </div>
        
        <form onSubmit={handleGenerate} className="w-full md:w-auto flex-1 max-w-lg relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Show me total revenue by country as a pie chart'"
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-4 pr-32 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin"/> : 'Generate'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2 absolute -bottom-6">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChartGenerator;
