import React from 'react';
import { getStatusColor, getStatusLabel, formatTimestamp } from '../utils/formatters';
import './SensorDataCard.css';

/**
 * Live Sensor Data Card Component
 * Displays PM2.5, CO, CO2, VOC values with color-coded status
 */
const SensorDataCard = ({ sensorData }) => {
    if (!sensorData) {
        return (
            <div className="card sensor-data-card">
                <h2 className="card-title">Live Sensor Data</h2>
                <div className="no-data">No sensor data available</div>
            </div>
        );
    }

    const sensors = [
        {
            name: 'PM2.5',
            value: sensorData.pm25,
            unit: 'µg/m³',
            type: 'PM25',
            icon: '💨'
        },
        {
            name: 'CO₂',
            value: sensorData.co2,
            unit: 'ppm',
            type: 'CO2',
            icon: '🌫️'
        },
        {
            name: 'CO',
            value: sensorData.co,
            unit: 'ppm',
            type: 'CO',
            icon: '☁️'
        },
        {
            name: 'VOC',
            value: sensorData.voc,
            unit: 'ppb',
            type: 'VOC',
            icon: '💭'
        }
    ];

    return (
        <div className="card sensor-data-card">
            <div className="card-header">
                <h2 className="card-title">Live Sensor Data</h2>
                <span className="timestamp">{formatTimestamp(sensorData.timestamp)}</span>
            </div>

            <div className="sensor-grid">
                {sensors.map((sensor) => {
                    const color = getStatusColor(sensor.type, sensor.value);
                    const status = getStatusLabel(sensor.type, sensor.value);

                    return (
                        <div key={sensor.name} className="sensor-item">
                            <div className="sensor-icon">{sensor.icon}</div>
                            <div className="sensor-info">
                                <div className="sensor-name">{sensor.name}</div>
                                <div className="sensor-value" style={{ color }}>
                                    {sensor.value?.toFixed(1) || 'N/A'}
                                    <span className="sensor-unit">{sensor.unit}</span>
                                </div>
                                <div className="sensor-status" style={{ color }}>
                                    {status}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="device-info">
                <span className="device-id">Device: {sensorData.device_id}</span>
            </div>
        </div>
    );
};

export default SensorDataCard;
