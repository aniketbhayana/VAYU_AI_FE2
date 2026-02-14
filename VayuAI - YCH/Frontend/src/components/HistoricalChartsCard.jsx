import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useHistoricalData from '../hooks/useHistoricalData';
import './HistoricalChartsCard.css';

/**
 * Historical Charts Card Component
 * Displays time-series charts for PM2.5, CO, CO2, and VOC sensors
 */
const HistoricalChartsCard = ({ deviceId }) => {
    const [timeRange, setTimeRange] = useState(6); // Default to 6 hours
    const { data, loading, error, refetch } = useHistoricalData(deviceId, timeRange);

    const timeRangeOptions = [
        { label: '1H', value: 1 },
        { label: '6H', value: 6 },
        { label: '24H', value: 24 },
        { label: '7D', value: 168 } // 7 days = 168 hours
    ];

    // Sensor thresholds for reference lines
    const thresholds = {
        pm25: { good: 12, moderate: 35, unhealthy: 55 },
        co2: { good: 1000, moderate: 2000, unhealthy: 5000 },
        co: { good: 9, moderate: 35, unhealthy: 100 },
        voc: { good: 220, moderate: 660, unhealthy: 2200 }
    };

    // Format timestamp for X-axis based on time range
    const formatXAxis = (timestamp) => {
        const date = new Date(timestamp);
        if (timeRange <= 24) {
            // For 1h, 6h, 24h: show HH:MM
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            // For 7d: show MM/DD HH:MM
            return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) + ' ' +
                date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const date = new Date(label);
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-time">{date.toLocaleString()}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(2)} {entry.unit}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Chart configuration for each sensor
    const chartConfigs = [
        {
            title: 'PM2.5 Concentration',
            dataKey: 'pm25',
            color: '#FF3366', // Bright pink/red - high contrast
            unit: 'µg/m³',
            thresholds: thresholds.pm25
        },
        {
            title: 'CO₂ Concentration',
            dataKey: 'co2',
            color: '#00D9FF', // Bright cyan - high contrast
            unit: 'ppm',
            thresholds: thresholds.co2
        },
        {
            title: 'CO Concentration',
            dataKey: 'co',
            color: '#FFD700', // Bright gold/yellow - high contrast
            unit: 'ppm',
            thresholds: thresholds.co
        },
        {
            title: 'VOC Concentration',
            dataKey: 'voc',
            color: '#00FF88', // Bright green - high contrast
            unit: 'ppb',
            thresholds: thresholds.voc
        }
    ];

    if (loading && !data) {
        return (
            <div className="historical-charts-card">
                <div className="card-header">
                    <h3>📊 Historical Trends</h3>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading historical data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="historical-charts-card">
                <div className="card-header">
                    <h3>📊 Historical Trends</h3>
                </div>
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={refetch}>Retry</button>
                </div>
            </div>
        );
    }

    if (!data || !data.readings || data.readings.length === 0) {
        return (
            <div className="historical-charts-card">
                <div className="card-header">
                    <h3>📊 Historical Trends</h3>
                    <div className="time-range-selector">
                        {timeRangeOptions.map(option => (
                            <button
                                key={option.value}
                                className={`time-btn ${timeRange === option.value ? 'active' : ''}`}
                                onClick={() => setTimeRange(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No historical data available</p>
                    <p className="empty-subtitle">Send sensor readings to populate charts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="historical-charts-card">
            <div className="card-header">
                <div className="header-left">
                    <h3>📊 Historical Trends</h3>
                    <span className="data-info">
                        {data.totalReadings} readings • Last {timeRange}h
                    </span>
                </div>
                <div className="time-range-selector">
                    {timeRangeOptions.map(option => (
                        <button
                            key={option.value}
                            className={`time-btn ${timeRange === option.value ? 'active' : ''}`}
                            onClick={() => setTimeRange(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="charts-grid">
                {chartConfigs.map((config, index) => (
                    <div key={index} className="chart-container">
                        <h4 className="chart-title">{config.title}</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data.readings} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={formatXAxis}
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                    label={{ value: config.unit, angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                {/* Reference lines for thresholds */}
                                <ReferenceLine
                                    y={config.thresholds.good}
                                    stroke="#38ef7d"
                                    strokeDasharray="3 3"
                                    strokeOpacity={0.3}
                                />
                                <ReferenceLine
                                    y={config.thresholds.moderate}
                                    stroke="#f5576c"
                                    strokeDasharray="3 3"
                                    strokeOpacity={0.3}
                                />

                                <Line
                                    type="monotone"
                                    dataKey={config.dataKey}
                                    stroke={config.color}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: config.color, strokeWidth: 2, stroke: '#fff' }}
                                    name={config.title}
                                    unit={config.unit}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoricalChartsCard;
