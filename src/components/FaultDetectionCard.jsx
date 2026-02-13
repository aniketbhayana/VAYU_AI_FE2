import React from 'react';
import { FAULT_SEVERITY } from '../utils/constants';
import StatusIndicator from './StatusIndicator';
import './FaultDetectionCard.css';

/**
 * Fault Detection Card Component
 * Displays sensor/fan health and recent faults
 */
const FaultDetectionCard = ({ faults, healingActions }) => {
    const recentFaults = faults || [];
    const recentHealing = healingActions || [];

    const hasCriticalFault = recentFaults.some(f => f.severity === 'high');
    const hasModerateFault = recentFaults.some(f => f.severity === 'medium');

    const systemStatus = hasCriticalFault ? 'critical' :
        hasModerateFault ? 'moderate' : 'good';

    return (
        <div className="card fault-detection-card">
            <h2 className="card-title">Fault Detection & Health</h2>

            <div className="health-overview">
                <div className="health-item">
                    <span className="health-label">System Status:</span>
                    <StatusIndicator
                        status={systemStatus}
                        label={systemStatus === 'good' ? 'Healthy' : systemStatus === 'moderate' ? 'Warning' : 'Critical'}
                        pulse={systemStatus !== 'good'}
                    />
                </div>
            </div>

            {recentFaults.length > 0 ? (
                <div className="faults-list">
                    <h3 className="section-title">Recent Faults</h3>
                    {recentFaults.map((fault, index) => {
                        const severityInfo = FAULT_SEVERITY[fault.severity] || FAULT_SEVERITY.low;

                        return (
                            <div key={index} className="fault-item">
                                <div className="fault-header">
                                    <span
                                        className="fault-type"
                                        style={{ color: severityInfo.color }}
                                    >
                                        {fault.fault_type?.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span
                                        className="fault-severity"
                                        style={{
                                            background: severityInfo.color,
                                            color: '#000'
                                        }}
                                    >
                                        {severityInfo.label}
                                    </span>
                                </div>
                                {fault.affected_sensor && (
                                    <div className="fault-detail">
                                        Affected Sensor: <strong>{fault.affected_sensor.toUpperCase()}</strong>
                                    </div>
                                )}
                                <div className="fault-description">{fault.details}</div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-faults">
                    <span className="check-icon">✅</span>
                    <p>No faults detected - All systems operational</p>
                </div>
            )}

            {recentHealing.length > 0 && (
                <div className="healing-list">
                    <h3 className="section-title">Self-Healing Actions</h3>
                    {recentHealing.map((action, index) => (
                        <div key={index} className="healing-item">
                            <div className="healing-icon">
                                {action.success ? '🔧' : '⚠️'}
                            </div>
                            <div className="healing-info">
                                <div className="healing-action">{action.action_taken}</div>
                                {action.ignored_sensors?.length > 0 && (
                                    <div className="healing-detail">
                                        Ignored sensors: {action.ignored_sensors.join(', ')}
                                    </div>
                                )}
                                {action.fallback_logic && (
                                    <div className="healing-detail">
                                        Fallback: {action.fallback_logic}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FaultDetectionCard;
