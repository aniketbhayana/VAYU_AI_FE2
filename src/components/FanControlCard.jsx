import React, { useState } from 'react';
import useFanControl from '../hooks/useFanControl';
import StatusIndicator from './StatusIndicator';
import './FanControlCard.css';

/**
 * Fan Control Card Component
 * Displays fan status and manual override controls
 */
const FanControlCard = ({ controlStatus, deviceId, onUpdate }) => {
    const { setOverride, clearOverride, loading } = useFanControl(deviceId);
    const [showOverride, setShowOverride] = useState(false);
    const [overrideFanOn, setOverrideFanOn] = useState(true);
    const [overrideIntensity, setOverrideIntensity] = useState(75);

    if (!controlStatus) {
        return (
            <div className="card fan-control-card">
                <h2 className="card-title">Fan Control</h2>
                <div className="no-data">No control data available</div>
            </div>
        );
    }

    const handleSetOverride = async () => {
        const result = await setOverride(overrideFanOn, overrideIntensity);
        if (result.success) {
            setShowOverride(false);
            if (onUpdate) onUpdate();
        }
    };

    const handleClearOverride = async () => {
        const result = await clearOverride();
        if (result.success) {
            if (onUpdate) onUpdate();
        }
    };

    return (
        <div className="card fan-control-card">
            <h2 className="card-title">Fan Control</h2>

            <div className={`fan-status ${controlStatus.fan_on ? 'active' : 'inactive'}`}>
                <div className="fan-icon">
                    <div className={`fan-blades ${controlStatus.fan_on ? 'spinning' : ''}`}>
                        🌀
                    </div>
                </div>
                <div className="fan-info">
                    <div className="fan-state">
                        <StatusIndicator
                            status={controlStatus.fan_on ? 'good' : 'moderate'}
                            label={controlStatus.fan_on ? 'ON' : 'OFF'}
                            pulse={controlStatus.fan_on}
                        />
                    </div>
                    <div className="fan-intensity">
                        <span className="intensity-label">Speed:</span>
                        <span className="intensity-value">{controlStatus.fan_intensity}%</span>
                    </div>
                    <div className="intensity-bar">
                        <div
                            className="intensity-fill"
                            style={{ width: `${controlStatus.fan_intensity}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="control-actions">
                {!showOverride ? (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowOverride(true)}
                        disabled={loading}
                    >
                        Manual Override
                    </button>
                ) : (
                    <div className="override-panel">
                        <div className="override-controls">
                            <div className="control-group">
                                <label className="control-label">Fan State:</label>
                                <div className="toggle-buttons">
                                    <button
                                        className={`toggle-btn ${overrideFanOn ? 'active' : ''}`}
                                        onClick={() => setOverrideFanOn(true)}
                                    >
                                        ON
                                    </button>
                                    <button
                                        className={`toggle-btn ${!overrideFanOn ? 'active' : ''}`}
                                        onClick={() => setOverrideFanOn(false)}
                                    >
                                        OFF
                                    </button>
                                </div>
                            </div>

                            <div className="control-group">
                                <label className="control-label">
                                    Intensity: {overrideIntensity}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={overrideIntensity}
                                    onChange={(e) => setOverrideIntensity(parseInt(e.target.value))}
                                    className="intensity-slider"
                                    disabled={!overrideFanOn}
                                />
                            </div>
                        </div>

                        <div className="override-actions">
                            <button
                                className="btn btn-success"
                                onClick={handleSetOverride}
                                disabled={loading}
                            >
                                {loading ? 'Applying...' : 'Apply Override'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowOverride(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-warning"
                    onClick={handleClearOverride}
                    disabled={loading}
                >
                    Clear Override
                </button>
            </div>
        </div>
    );
};

export default FanControlCard;
