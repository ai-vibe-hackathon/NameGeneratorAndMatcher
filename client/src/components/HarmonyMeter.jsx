import React from 'react';
import { motion } from 'framer-motion';

const HarmonyMeter = ({ score, details }) => {
    const radius = 80;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', margin: '2rem 0' }}>
            <div style={{ position: 'relative', width: radius * 2, height: radius * 2, margin: '0 auto' }}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <motion.circle
                        stroke="url(#gradient)"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00d2ff" />
                            <stop offset="100%" stopColor="#ffd700" />
                        </linearGradient>
                    </defs>
                </svg>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-serif)'
                }}>
                    {score}%
                </div>
            </div>

            <h3 style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>Matcher Score</h3>

            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                {details.map((detail, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            color: 'var(--color-text-muted)'
                        }}
                    >
                        <span style={{ color: 'var(--color-accent)', marginRight: '8px' }}>✨</span>
                        {detail}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HarmonyMeter;
