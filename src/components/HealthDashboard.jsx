import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const HealthDashboard = ({ analysis, structuredData, reports }) => {
    const { speak } = useVoice();

    // Parse analysis for key metrics (prioritize structured data)
    const metrics = extractMetrics(analysis, structuredData, reports);


    const handleMetricClick = (metric) => {
        speak(`${metric.name}: ${metric.value}. ${metric.status}. ${metric.explanation}`, true);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.75rem', fontSize: '1.6rem', fontWeight: '700' }}>📊 Health Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {metrics.map((metric, idx) => (
                    <MetricCard key={idx} metric={metric} onClick={() => handleMetricClick(metric)} delay={idx * 0.1} />
                ))}
            </div>

            {/* Feature 4 & 13: Correlations & Impacts */}
            {structuredData && (structuredData.body_system_correlations?.length > 0 || structuredData.daily_life_impact?.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Correlations */}
                    {structuredData.body_system_correlations?.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <TrendingUp size={18} className="text-primary" /> Body System Links
                            </h4>
                            {structuredData.body_system_correlations.map((corr, idx) => (
                                <div key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {corr.systems.join(' + ')}
                                    </span>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{corr.finding}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Daily Impacts */}
                    {structuredData.daily_life_impact?.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Volume2 size={18} className="text-primary" /> Daily Life Impact
                            </h4>
                            {structuredData.daily_life_impact.map((impact, idx) => (
                                <div key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #fbbf24' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {impact.area}
                                    </span>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
                                        {impact.insight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MetricCard = ({ metric, onClick, delay }) => {
    const statusColors = {
        normal: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', icon: '#22c55e' },
        warning: { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24', icon: '#fbbf24' },
        critical: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '#ef4444' }
    };

    const colors = statusColors[metric.level] || statusColors.normal;

    const confColor = metric.confidence === 'High' ? '#22c55e' : metric.confidence === 'Medium' ? '#fbbf24' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            onClick={onClick}
            className="glass-panel"
            style={{
                padding: '1.5rem',
                cursor: 'pointer',
                background: colors.bg,
                borderColor: colors.border,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${colors.border}40` }}
            whileTap={{ scale: 0.98 }}
        >
            {metric.confidence && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: confColor, border: `1px solid ${confColor}` }}>
                    {metric.confidence} Conf.
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{metric.icon}</div>
                <StatusIcon level={metric.level} color={colors.icon} />
            </div>

            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '600' }}>
                {metric.name}
                {metric.trend && (
                    <div style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        background: metric.trend === 'improved' ? 'rgba(34, 197, 94, 0.2)' : metric.trend === 'failed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                        color: metric.trend === 'improved' ? '#4ade80' : metric.trend === 'failed' ? '#f87171' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                    }}>
                        {metric.trend === 'improved' ? <ArrowDownRight size={12} /> : metric.trend === 'failed' ? <ArrowUpRight size={12} /> : <Minus size={12} />}
                        {metric.trend.toUpperCase()}
                    </div>
                )}
            </h4>

            <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.icon, marginBottom: '0.75rem' }}>
                {metric.value}
            </div>

            <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 'bold', color: colors.icon }}>{metric.status}</span>
                {metric.explanation && (
                    <p style={{ marginTop: '0.35rem', opacity: 0.85, fontSize: '0.8rem' }}>
                        {metric.explanation}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

const StatusIcon = ({ level, color }) => {
    const icons = {
        normal: <TrendingUp size={20} color={color} />,
        warning: <Minus size={20} color={color} />,
        critical: <TrendingDown size={20} color={color} />
    };
    return icons[level] || icons.normal;
};

// Simple metric extraction (prioritize structured data from AI)
const extractMetrics = (analysis, structuredData, reports) => {
    const getVal = (v) => (v && v.value !== undefined) ? v.value : v;
    const getConf = (v) => (v && v.confidence) ? v.confidence : null;

    if (structuredData && structuredData.metrics) {
        const m = structuredData.metrics;
        // Previous report is index 0 if current isn't saved, index 1 if it is
        const prev = reports?.length > 1 ? (reports[0]?.date === structuredData.date ? reports[1]?.metrics : reports[0]?.metrics) : null;

        const fmt = (v, unit) => {
            const val = getVal(v);
            return val ? `${val} ${unit || ''}` : "N/A";
        };

        const bpSys = getVal(m.heart?.bp_sys);
        const bpDia = getVal(m.heart?.bp_dia);
        const hba1c = getVal(m.blood?.hba1c);
        const chol = getVal(m.cholesterol?.total);

        const getTrend = (curr, prevVal, lowerIsBetter = true) => {
            if (!prevVal || !curr) return null;
            const diff = curr - prevVal;
            if (Math.abs(diff) < 0.1) return 'stable';
            if (lowerIsBetter) return diff < 0 ? 'improved' : 'failed';
            return diff > 0 ? 'improved' : 'failed';
        };

        return [
            {
                name: 'Blood Pressure',
                value: (bpSys && bpDia) ? `${bpSys}/${bpDia}` : "N/A",
                status: (bpSys > 140) ? 'High' : (bpSys < 120 ? 'Optimal' : 'Normal'),
                level: (bpSys > 140) ? 'critical' : 'normal',
                icon: '❤️',
                explanation: 'Blood pressure reading.',
                confidence: getConf(m.heart?.bp_sys),
                trend: getTrend(bpSys, prev?.heart?.bp_sys)
            },
            {
                name: 'Blood Glucose',
                value: fmt(m.blood?.hba1c, '%'),
                status: (hba1c > 6.5) ? 'High' : (hba1c < 5.7 ? 'Normal' : 'Pre-diabetic'),
                level: (hba1c > 6.5) ? 'critical' : (hba1c > 5.7 ? 'warning' : 'normal'),
                icon: '🩸',
                explanation: 'HbA1c level tracking.',
                confidence: getConf(m.blood?.hba1c),
                trend: getTrend(hba1c, prev?.blood?.hba1c)
            },
            {
                name: 'Cholesterol',
                value: fmt(m.cholesterol?.total, 'mg/dL'),
                status: (chol > 200) ? 'High' : 'Optimal',
                level: (chol > 200) ? 'warning' : 'normal',
                icon: '🧬',
                explanation: 'Total lipid profile.',
                confidence: getConf(m.cholesterol?.total),
                trend: getTrend(chol, prev?.cholesterol?.total)
            }
        ];
    }

    if (!analysis) return [];

    // Fallback to demo metrics if no structured data yet
    return [
        { name: 'Blood Pressure', value: '120/80', status: 'Normal Range', level: 'normal', icon: '❤️', explanation: 'Your blood pressure is healthy' },
        { name: 'Blood Sugar', value: '95 mg/dL', status: 'Optimal', level: 'normal', icon: '🩸', explanation: 'Blood sugar levels are good' },
        { name: 'Cholesterol', value: '180 mg/dL', status: 'Good', level: 'normal', icon: '🧬', explanation: 'Cholesterol is within healthy limits' }
    ];
};


export default HealthDashboard;
