import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Activity, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
    const features = [
        {
            icon: <Brain size={24} color="#38bdf8" />,
            title: "AI Term Breakdown",
            desc: "Understand complex medical jargon in plain language with specialized AI models.",
            delay: 0.1
        },
        {
            icon: <Activity size={24} color="#818cf8" />,
            title: "Biological 3D Mapping",
            desc: "Visualize your health status on an interactive 3D human body diagram.",
            delay: 0.2
        },
        {
            icon: <TrendingUp size={24} color="#2dd4bf" />,
            title: "Predictive Trends",
            desc: "Track your health metrics over time with intelligent visualization and foresight.",
            delay: 0.3
        },
        {
            icon: <ShieldCheck size={24} color="#f472b6" />,
            title: "Privacy First",
            desc: "Your data stays private with local AI extraction and secure cloud analysis.",
            delay: 0.4
        }
    ];

    return (
        <div style={{ textAlign: 'center', padding: '6rem 0 8rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="animate-float"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    color: 'var(--color-primary)',
                    marginBottom: '2.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}
            >
                <Sparkles size={16} />
                Medical OS v1.2: Next-Gen Health Intelligence
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                    fontSize: 'clamp(3rem, 10vw, 5rem)',
                    fontWeight: '800',
                    lineHeight: '1.05',
                    letterSpacing: '-0.03em',
                    marginBottom: '2rem'
                }}
            >
                The Future of <br />
                <span className="gradient-text">Personal Wellness.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '4rem',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: '1.6'
                }}
            >
                MediScan AI transforms your static medical reports into a dynamic,
                interactive health experience. Unlock deep insights instantly.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ marginBottom: '8rem' }}
            >
                <button
                    onClick={onGetStarted}
                    className="btn-primary"
                    style={{ fontSize: '1.1rem', padding: '1.2rem 3rem' }}
                >
                    Start Real-Time Analysis <ArrowRight size={20} />
                </button>
            </motion.div>

            <motion.div
                className="features-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + f.delay }}
                    >
                        <FeatureCard {...f} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-panel feature-card" style={{
        padding: '2.5rem',
        textAlign: 'left',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.08)'
    }}>
        <div className="icon-box">
            {icon}
        </div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '700' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{desc}</p>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <div style={{
                width: '40px',
                height: '3px',
                background: 'var(--color-primary)',
                borderRadius: '99px',
                opacity: 0.4
            }} />
        </div>
    </div>
);

export default Hero;
