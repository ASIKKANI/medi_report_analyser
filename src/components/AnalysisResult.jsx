import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOllamaResponse } from '../services/ollama';
import { generateGeminiResponse } from '../services/gemini';
import { RefreshCw, Check, Zap, List, Microscope, GitCompare, ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoice } from '../context/VoiceContext';
import { useLanguage } from '../context/LanguageContext';
import HealthDashboard from './HealthDashboard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const markdownStyles = `
    .markdown-content {
        color: #e2e8f0;
        line-height: 1.8;
        font-size: 1.05rem;
    }
    .markdown-content h1, .markdown-content h2 {
        color: #0ea5e9;
        margin-top: 1.75rem;
        margin-bottom: 0.75rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        text-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
    }
    .markdown-content h3 {
        color: #a855f7;
        margin-top: 1.5rem;
        margin-bottom: 0.6rem;
        font-weight: 700;
    }
    .markdown-content p {
        margin-bottom: 1.25rem;
        opacity: 0.95;
    }
    .markdown-content ul, .markdown-content ol {
        margin-bottom: 1.25rem;
        padding-left: 1.5rem;
    }
    .markdown-content li {
        margin-bottom: 0.6rem;
    }
    .markdown-content strong {
        color: #38bdf8;
        font-weight: 700;
    }
`;

const AnalysisResult = ({ text, analysis, setAnalysis, settings, structuredData, reports }) => {
    const { t, getAILanguageInstruction } = useLanguage();
    const [activeTab, setActiveTab] = useState('simple');
    const [loading, setLoading] = useState(false);
    const [loadingModes, setLoadingModes] = useState(new Set());
    const [error, setError] = useState(null);
    const [modeAnalyses, setModeAnalyses] = useState({
        brief: '',
        simple: '',
        detailed: '',
        changes: ''
    });
    const { speak, autoNarrate } = useVoice();

    const handleExport = async () => {
        const element = document.getElementById('analysis-panel');
        if (!element) return;
        const canvas = await html2canvas(element, { backgroundColor: '#0f172a' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Manual Blob Export to bypass browser hash naming
        const pdfBlob = pdf.output('blob');
        const fileName = `medical_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const analyzeBatch = async () => {
        if (!text) return;
        if (!settings.ollamaModel && !settings.geminiKey) {
            setError("No AI Provider configured. Please add Gemini API Key or enable Ollama.");
            return;
        }

        setLoading(true);
        setError(null);

        const promptConfigs = {
            brief: "Provide a 1-2 sentence high-level summary. Focus on the core takeaway. Ultra-concise.",
            simple: "Explain findings in simple, non-technical language. Use 3-4 bullet points. Focus on lifestyle impact.",
            detailed: "Provide a deep clinical analysis. Briefly explain biological significance and key correlations."
        };

        const modes = ['brief', 'simple', 'detailed', 'changes'];
        const promises = modes.map(async (mode) => {
            if (modeAnalyses[mode]) return;

            // For changes, check if we have a previous report
            if (mode === 'changes') {
                const prevMetrics = reports?.length > 1 ? reports[1].metrics : null;
                if (!prevMetrics) {
                    setModeAnalyses(prev => ({ ...prev, changes: "No previous records found for comparison." }));
                    return;
                }
            }

            setLoadingModes(prev => new Set([...prev, mode]));

            try {
                let prompt = "";
                if (mode === 'changes') {
                    const prevMetrics = reports?.length > 1 ? reports[1].metrics : null;
                    prompt = `Briefly compare these health metrics and identify improvements or failures:
CURRENT: HbA1c=${structuredData.metrics?.blood?.hba1c}, Cholesterol=${structuredData.metrics?.cholesterol?.total}, BP=${structuredData.metrics?.heart?.bp_sys}/${structuredData.metrics?.heart?.bp_dia}
PREVIOUS: HbA1c=${prevMetrics?.blood?.hba1c}, Cholesterol=${prevMetrics?.cholesterol?.total}, BP=${prevMetrics?.heart?.bp_sys}/${prevMetrics?.heart?.bp_dia}

List 2-3 key changes using "Improved:" or "Failure:" labels. Be concise.`;
                } else {
                    prompt = `You are a medical assistant performing a ${mode.toUpperCase()} analysis.\n\nINSTRUCTIONS:\n${promptConfigs[mode]}\n\nReport Text:\n"${text}"`;
                }

                let result = "";
                if (settings.geminiKey) {
                    result = await generateGeminiResponse(settings.geminiKey, [], prompt, mode === 'changes' ? "" : text, getAILanguageInstruction());
                } else {
                    result = await generateOllamaResponse(prompt, settings.ollamaModel, settings.ollamaUrl, getAILanguageInstruction());
                }

                console.log(`✅ ${mode} analysis complete`);
                setModeAnalyses(prev => ({ ...prev, [mode]: result }));
                if (mode === activeTab) setAnalysis(result);
            } catch (err) {
                console.error(`Error in ${mode} analysis:`, err);
                setModeAnalyses(prev => ({ ...prev, [mode]: `Error: ${err.message}` }));
            } finally {
                setLoadingModes(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(mode);
                    return newSet;
                });
            }
        });

        try {
            await Promise.all(promises);
            console.log("📊 Batch analysis complete");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const comparisonData = useMemo(() => {
        if (!reports || reports.length < 2 || !structuredData) return null;
        const current = structuredData.metrics;
        const previous = reports[0]?.date === structuredData.date ? reports[1]?.metrics : reports[0]?.metrics;
        if (!previous) return null;

        const getDelta = (curr, prev) => {
            if (curr === undefined || prev === undefined || curr === 0 || prev === 0) return null;
            return {
                diff: (curr - prev).toFixed(2),
                percent: (((curr - prev) / prev) * 100).toFixed(1)
            };
        };

        const compare = (key, subKey, type = 'lower_is_better') => {
            const cVal = current?.[key]?.[subKey];
            const pVal = previous?.[key]?.[subKey];
            if (cVal === undefined || pVal === undefined || cVal === 0 || pVal === 0) return null;
            const delta = getDelta(cVal, pVal);
            let status = 'stable';
            if (Math.abs(parseFloat(delta.percent)) > 1) {
                if (type === 'lower_is_better') {
                    status = cVal < pVal ? 'improved' : 'failed';
                } else {
                    status = cVal > pVal ? 'improved' : 'failed';
                }
            }
            return { label: subKey.replace('_', ' ').toUpperCase(), current: cVal, previous: pVal, delta, status };
        };

        return [
            compare('blood', 'hba1c'),
            compare('cholesterol', 'total'),
            compare('heart', 'bp_sys'),
            compare('liver', 'sgpt'),
            compare('kidney', 'creatinine')
        ].filter(Boolean);
    }, [structuredData, reports]);

    useEffect(() => {
        if (text && !modeAnalyses.brief && !modeAnalyses.simple && !modeAnalyses.detailed && !loading) {
            analyzeBatch();
        }
    }, [text]);

    const tabs = [
        { id: 'brief', label: 'Brief', icon: Zap },
        { id: 'simple', label: 'Simple', icon: List },
        { id: 'detailed', label: 'Detailed', icon: Microscope },
        { id: 'changes', label: 'What Changed', icon: GitCompare }
    ];

    return (
        <div id="analysis-panel" className="glass-panel" style={{
            padding: '2.5rem',
            minHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            contain: 'layout'
        }}>
            <style>{markdownStyles}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                border: '2px solid',
                                borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                                color: activeTab === tab.id ? 'var(--color-primary)' : '#cbd5e1',
                                fontSize: '1rem',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={analyzeBatch} className="btn-primary" style={{ padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} title="Regenerate All Analyses">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Regenerate All
                    </button>
                    <button onClick={handleExport} className="btn-outline" style={{ padding: '0.75rem 1rem', borderRadius: '10px' }} title="Export PDF">
                        <ArrowDownRight size={16} />
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            style={{ padding: '4rem 2rem', textAlign: 'center' }}
                        >
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ marginBottom: '2rem' }}>
                                <RefreshCw size={64} color="var(--color-primary)" />
                            </motion.div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '2rem', color: '#cbd5e1' }}>Generating Analyses...</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                                {['brief', 'simple', 'detailed', 'changes'].map(mode => (
                                    <motion.div
                                        key={mode}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '1rem 1.5rem', background: loadingModes.has(mode) ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px', border: `2px solid ${loadingModes.has(mode) ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)'}`,
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'capitalize', color: loadingModes.has(mode) ? 'var(--color-primary)' : '#94a3b8' }}>
                                            {mode === 'changes' ? 'Trends' : mode}
                                        </span>
                                        {loadingModes.has(mode) ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <RefreshCw size={20} color="var(--color-primary)" />
                                            </motion.div>
                                        ) : modeAnalyses[mode] ? <Check size={20} color="#22c55e" /> : null}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'changes' ? (
                        <motion.div key="changes" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <TrendingUp size={24} color="var(--color-primary)" />
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>AI Progress Summary</h3>
                            </div>
                            <div className="markdown-content" style={{ marginBottom: '2rem' }}>
                                <ReactMarkdown>{modeAnalyses.changes || "Generating comparison summary..."}</ReactMarkdown>
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '1rem', marginTop: '0.5rem' }}>Numerical Trends</h3>
                            {!comparisonData || comparisonData.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    <GitCompare size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Needs 2+ reports to unlock trend analysis.</p>
                                </div>
                            ) : (
                                comparisonData.map((item, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem 1.75rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{item.label}</div>
                                                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                                                    {item.current}
                                                    <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '400', marginLeft: '1rem' }}>vs {item.previous}</span>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                padding: '0.5rem 1rem', borderRadius: '10px',
                                                background: item.status === 'improved' ? 'rgba(34, 197, 94, 0.15)' : item.status === 'failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                                                color: item.status === 'improved' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#94a3b8'
                                            }}>
                                                {item.status === 'improved' ? <ArrowDownRight size={16} /> : item.status === 'failed' ? <ArrowUpRight size={16} /> : <Minus size={16} />}
                                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.status.toUpperCase()}</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{item.delta.percent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="markdown-content">
                            {modeAnalyses[activeTab] ? (
                                <ReactMarkdown>{modeAnalyses[activeTab]}</ReactMarkdown>
                            ) : (
                                <p style={{ color: '#cbd5e1', textAlign: 'center', marginTop: '4rem', fontSize: '1.1rem' }}>No data extracted for this mode yet.</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {structuredData && activeTab !== 'changes' && modeAnalyses[activeTab] && (
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <HealthDashboard analysis={modeAnalyses[activeTab]} structuredData={structuredData} reports={reports} />
                </div>
            )}
        </div>
    );
};

export default AnalysisResult;
