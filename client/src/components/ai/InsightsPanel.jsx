import React, { useEffect, useState } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { getAIInsights } from '../../api';

const InsightsPanel = () => {
  const [insights, setInsights] = useState('Loading insights...');
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await getAIInsights();
      setInsights(res.data.insights);
    } catch {
      setInsights('Failed to generate insights. Ensure OpenAI API is configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="glass-card mb-8 border-t-2 border-amber-500/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="text-amber-400" size={20} />
          AI Executive Insights
        </h3>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="text-slate-400 hover:text-white transition-colors"
          title="Regenerate Insights"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-amber-500' : ''} />
        </button>
      </div>
      
      <div className="relative z-10 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {loading ? (
          <div className="flex items-center gap-3 animate-pulse text-amber-200/70">
            <Lightbulb size={16} className="animate-bounce" /> Analyzing database patterns...
          </div>
        ) : (
          insights
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
