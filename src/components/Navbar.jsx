import React from 'react';
import { Activity, Settings, Github } from 'lucide-react';

const Navbar = ({ onOpenSettings }) => {
    return (
        <nav className="glass-panel" style={{
            margin: '1rem 2rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 50
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    background: 'var(--color-primary)',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    display: 'flex'
                }}>
                    <Activity color="white" size={24} />
                </div>
                <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                    Medi<span style={{ color: 'var(--color-primary)' }}>Scan</span> AI
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className="btn-outline"
                    onClick={onOpenSettings}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <Settings size={18} />
                    <span>Config</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
