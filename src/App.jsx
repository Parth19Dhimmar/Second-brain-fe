import React, { useState } from 'react';
import { Search, Brain, Sparkles, Loader2, AlertCircle } from 'lucide-react';

// API Configuration 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = `${API_BASE_URL}/query`;

const SecondBrainApp = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('API Response:', data); // Debug log
      
      // Handle different response formats
      let answer;
      if (data.answer) {
        answer = data.answer;
      } else if (data.response && typeof data.response === 'object' && data.response.answer) {
        answer = data.response.answer;
      } else if (data.response && typeof data.response === 'string') {
        // Handle case where response itself is the answer string
        answer = data.response;
      } else if (typeof data === 'string') {
        answer = data;
      } else {
        // If all else fails, show error
        throw new Error('Unexpected response format from API');
      }
      
      setResponse(answer);
    } catch (err) {
      setError(err.message || 'Failed to fetch response. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-indigo-600" />
            <h1 className="text-2xl font-semibold text-slate-900">Second Brain</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Knowledge Assistant</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ask anything about your knowledge base
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your personal AI system that understands and retrieves information from your documents,
            notes, and data using advanced RAG technology.
          </p>
        </div>

        {/* Query Section */}
        <div className="mb-8">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your knowledge base..."
                className="w-full pl-12 pr-32 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all bg-white shadow-sm"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <span>Ask</span>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2 ml-1">
              Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Enter</kbd> to submit
            </p>
          </div>
        </div>

        {/* Response Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 animate-slideUp">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {response && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-lg animate-slideUp">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">Answer</h3>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}

        {!response && !error && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to help</h3>
            <p className="text-slate-600">
              Start by asking a question about your knowledge base above
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-slate-600 mb-2">
            Powered by Retrieval-Augmented Generation (RAG)
          </p>
          <p className="text-sm text-slate-500">
            Built with React + Python • Combining vector search with AI generation
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        kbd {
          font-family: ui-monospace, monospace;
          font-size: 0.875em;
        }

        .prose p {
          margin-bottom: 1em;
        }

        .prose p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default SecondBrainApp; 