import React, { useEffect, useState } from 'react';
import { generateOllamaResponse } from '../services/ollama';
import { RefreshCw, AlertTriangle, FileText, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AnalysisResult = ({ text, analysis, setAnalysis, settings }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyze = async () => {
        if (!text || !settings.ollamaModel) return;

        setLoading(true);
        setError(null);
        try {
            // Prompt Engineering for Medical Report
            const prompt = `
        You are a friendly and empathetic medical assistant. 
        Analyze the following medical report and explain it clearly for a patient.
        
        Please format your response using Markdown with the following structure:

        # 🏥 Report Summary
        [A brief, 1-2 sentence summary of what this report is about]

        # 🔍 Key Findings
        - **[Finding Name]**: [Value/Observation] - *[Simple explanation of what this means]*
        - **[Finding Name]**: [Value/Observation] - *[Simple explanation]*
        
        # 💡 Simplified Explanation
        [Explain any medical jargon or complex terms found in the report in plain English.]

        # 🍀 Healthy Recommendations
        > [Actionable tip 1 based on findings]
        > [Actionable tip 2 based on findings]

        *Disclaimer: I am an AI assistant and this is not a substitute for professional medical advice. Always consult your doctor.*

        Report Text:
        "${text}"
      `;

            const result = await generateOllamaResponse(prompt, settings.ollamaModel, settings.ollamaUrl);
            setAnalysis(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (text && !analysis && !loading) {
            analyze();
        }
    }, [text]);

    return (
        <div className="glass-panel" style={{ padding: '2rem', height: '600px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={24} color="var(--color-primary)" /> Report Analysis
                </h2>
                {analysis && (
                    <button onClick={analyze} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                        <RefreshCw size={16} />
                    </button>
                )}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <RefreshCw className="animate-spin" size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                    <p>Consulting local AI model...</p>
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={18} /> Analysis Failed
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Ensure Ollama is running (`ollama serve`) and CORS is allowed. <br />
                        Try setting `OLLAMA_ORIGINS="*"` environment variable for Ollama.
                    </p>
                    <button onClick={analyze} className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Retry</button>
                </div>
            )}

            {analysis && !loading && (
                <div className="markdown-content">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}

            {!analysis && !loading && !error && (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '4rem' }}>
                    Detailed analysis will appear here.
                </p>
            )}
        </div>
    );
};

export default AnalysisResult;
