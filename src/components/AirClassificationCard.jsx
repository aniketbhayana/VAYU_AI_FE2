import React from 'react';
import { AIR_TYPES } from '../utils/constants';
import { formatConfidence } from '../utils/formatters';
import './AirClassificationCard.css';

/**
 * Air Classification Card Component
 * Displays AI-powered air type classification
 */
const AirClassificationCard = ({ classification }) => {
    if (!classification) {
        return (
            <div className="card air-classification-card">
                <h2 className="card-title">Air Classification</h2>
                <div className="no-data">No classification data available</div>
            </div>
        );
    }

    const airType = AIR_TYPES[classification.air_type] || AIR_TYPES.unknown;

    return (
        <div className="card air-classification-card">
            <h2 className="card-title">Air Classification</h2>

            <div
                className="classification-badge"
                style={{
                    borderColor: airType.color,
                    boxShadow: `0 0 20px ${airType.color}40`
                }}
            >
                <div className="air-icon">{airType.icon}</div>
                <div className="air-info">
                    <div className="air-type" style={{ color: airType.color }}>
                        {airType.label}
                    </div>
                    <div className="air-confidence">
                        Confidence: {formatConfidence(classification.confidence)}
                    </div>
                </div>
            </div>

            {classification.reasoning && (
                <div className="ai-reasoning">
                    <div className="reasoning-header">
                        <span className="ai-icon">🤖</span>
                        <span className="reasoning-title">AI Analysis</span>
                    </div>
                    <p className="reasoning-text">{classification.reasoning}</p>
                </div>
            )}
        </div>
    );
};

export default AirClassificationCard;
