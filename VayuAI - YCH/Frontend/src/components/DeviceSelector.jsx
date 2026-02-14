import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './DeviceSelector.css';

/**
 * Device Selector Component
 * Allows user to select active device from available devices
 */
const DeviceSelector = ({ selectedDevice, onDeviceChange }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        const result = await api.getDevices();
        if (result.success) {
            setDevices(result.data);
            // If no device selected and devices available, select first one
            if (!selectedDevice && result.data.length > 0) {
                onDeviceChange(result.data[0]);
            }
        }
        setLoading(false);
    };

    return (
        <div className="device-selector">
            <label className="selector-label">Active Device:</label>
            <select
                className="device-dropdown"
                value={selectedDevice || ''}
                onChange={(e) => onDeviceChange(e.target.value)}
                disabled={loading || devices.length === 0}
            >
                {loading ? (
                    <option>Loading devices...</option>
                ) : devices.length === 0 ? (
                    <option>No devices available</option>
                ) : (
                    devices.map((device) => (
                        <option key={device} value={device}>
                            {device}
                        </option>
                    ))
                )}
            </select>
            <button
                className="refresh-btn"
                onClick={fetchDevices}
                disabled={loading}
                title="Refresh devices"
            >
                🔄
            </button>
        </div>
    );
};

export default DeviceSelector;
