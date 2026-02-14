import React from 'react';
import { formatTimestamp, truncateHash } from '../utils/formatters';
import './BlockchainLogsCard.css';

/**
 * Blockchain Logs Card Component
 * Displays recent blockchain transaction logs
 */
const BlockchainLogsCard = ({ logs }) => {
    const recentLogs = logs || [];

    const getEventIcon = (eventType) => {
        switch (eventType) {
            case 'decision':
                return '🎯';
            case 'fault':
                return '⚠️';
            case 'healing':
                return '🔧';
            default:
                return '📝';
        }
    };

    const getEventColor = (eventType) => {
        switch (eventType) {
            case 'decision':
                return '#667eea';
            case 'fault':
                return '#f5576c';
            case 'healing':
                return '#38ef7d';
            default:
                return '#764ba2';
        }
    };

    return (
        <div className="card blockchain-logs-card">
            <h2 className="card-title">Blockchain Logs</h2>

            {recentLogs.length > 0 ? (
                <div className="logs-container">
                    {recentLogs.map((log, index) => (
                        <div
                            key={index}
                            className="log-item"
                            style={{ borderLeftColor: getEventColor(log.event_type) }}
                        >
                            <div className="log-header">
                                <div className="log-event">
                                    <span className="event-icon">{getEventIcon(log.event_type)}</span>
                                    <span
                                        className="event-type"
                                        style={{ color: getEventColor(log.event_type) }}
                                    >
                                        {log.event_type.toUpperCase()}
                                    </span>
                                </div>
                                <span className="log-timestamp">
                                    {formatTimestamp(log.timestamp)}
                                </span>
                            </div>

                            <div className="log-details">
                                <div className="log-detail-item">
                                    <span className="detail-label">Device:</span>
                                    <span className="detail-value">{log.device_id}</span>
                                </div>

                                {log.hash && (
                                    <div className="log-detail-item">
                                        <span className="detail-label">Hash:</span>
                                        <span className="detail-value hash-value">
                                            {truncateHash(log.hash)}
                                        </span>
                                        <span className="verified-badge">✓ Verified</span>
                                    </div>
                                )}
                            </div>

                            {log.data && Object.keys(log.data).length > 0 && (
                                <div className="log-data">
                                    <details>
                                        <summary className="data-summary">View Data</summary>
                                        <pre className="data-content">
                                            {JSON.stringify(log.data, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-logs">
                    <span className="blockchain-icon">⛓️</span>
                    <p>No blockchain logs available</p>
                </div>
            )}
        </div>
    );
};

export default BlockchainLogsCard;
