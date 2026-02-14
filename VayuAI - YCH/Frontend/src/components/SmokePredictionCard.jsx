import React from 'react';
import { RISK_LEVELS } from '../utils/constants';
import { getRiskLevel, formatConfidence } from '../utils/formatters';
import './SmokePredictionCard.css';

/**
 * Smoke Prediction Card Component
 * Displays AI-powered smoke prediction with risk level and reasoning
 */
const SmokePredictionCard = ({ prediction }) => {
    if (!prediction) {
        return (
            <div className="card smoke-prediction-card">
                <h2 className="card-title">Smoke Prediction</h2>
                <div className="no-data">No prediction data available</div>
            </div>
        );
    }

    const riskLevel = getRiskLevel(prediction);
    const riskInfo = RISK_LEVELS[riskLevel];

    return (
        <div className="card smoke-prediction-card">
            <h2 className="card-title">Smoke Prediction</h2>

            <div
                className="risk-badge"
                style={{ background: riskInfo.gradient }}
            >
                <div className="risk-icon">
                    {riskLevel === 'HIGH' ? '🔴' : riskLevel === 'MEDIUM' ? '🟡' : '🟢'}
                </div>
                <div className="risk-info">
                    <div className="risk-level">{riskInfo.label}</div>
                    <div className="risk-confidence">
                        Confidence: {formatConfidence(prediction.confidence)}
                    </div>
                </div>
            </div>

            {prediction.will_peak && (
                <div className="prediction-details">
                    <div className="detail-item">
                        <span className="detail-label">Will Peak:</span>
                        <span className="detail-value">Yes</span>
                    </div>
                    {prediction.estimated_peak_value && (
                        <div className="detail-item">
                            <span className="detail-label">Estimated Peak PM2.5:</span>
                            <span className="detail-value">
                                {prediction.estimated_peak_value.toFixed(1)} µg/m³
                            </span>
                        </div>
                    )}
                </div>
            )}

            {prediction.reasoning && (
                <div className="ai-reasoning">
                    <div className="reasoning-header">
                        <span className="ai-icon">🤖</span>
                        <span className="reasoning-title">AI Analysis</span>
                    </div>
                    <p className="reasoning-text">{prediction.reasoning}</p>
                </div>
            )}
        </div>
    );
};

export default SmokePredictionCard;
