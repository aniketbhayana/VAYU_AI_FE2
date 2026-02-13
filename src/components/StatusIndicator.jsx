import React from 'react';
import './StatusIndicator.css';

/**
 * Reusable status indicator component
 * @param {string} status - Status level: 'good', 'moderate', 'unhealthy', 'critical'
 * @param {string} label - Label to display
 * @param {boolean} pulse - Whether to show pulse animation
 */
const StatusIndicator = ({ status = 'good', label, pulse = false }) => {
    return (
        <div className={`status-indicator status-${status} ${pulse ? 'pulse' : ''}`}>
            <div className="status-dot"></div>
            {label && <span className="status-label">{label}</span>}
        </div>
    );
};

export default StatusIndicator;
