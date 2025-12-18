import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const HealthDashboard = ({ analysis }) => {
    const { speak } = useVoice();

    // Parse analysis for key metrics (simplified demo)
    const metrics = extractMetrics(analysis);

    const handleMetricClick = (metric) => {
        speak(`${metric.name}: ${metric.value}. ${metric.status}. ${metric.explanation}`, true);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📊 Health Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {metrics.map((metric, idx) => (
                    <MetricCard key={idx} metric={metric} onClick={() => handleMetricClick(metric)} delay={idx * 0.1} />
                ))}
            </div>
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
                transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${colors.border}40` }}
            whileTap={{ scale: 0.98 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{metric.icon}</div>
                <StatusIcon level={metric.level} color={colors.icon} />
            </div>

            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                {metric.name}
            </h4>

            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: colors.icon, marginBottom: '0.5rem' }}>
                {metric.value}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {metric.status}
            </p>
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

// Simple metric extraction (you can enhance this with better parsing)
const extractMetrics = (analysis) => {
    if (!analysis) return [];

    // Demo metrics - in production, parse from actual analysis
    return [
        { name: 'Blood Pressure', value: '120/80', status: 'Normal Range', level: 'normal', icon: '❤️', explanation: 'Your blood pressure is healthy' },
        { name: 'Blood Sugar', value: '95 mg/dL', status: 'Optimal', level: 'normal', icon: '🩸', explanation: 'Blood sugar levels are good' },
        { name: 'Cholesterol', value: '180 mg/dL', status: 'Good', level: 'normal', icon: '🧬', explanation: 'Cholesterol is within healthy limits' }
    ];
};

export default HealthDashboard;
