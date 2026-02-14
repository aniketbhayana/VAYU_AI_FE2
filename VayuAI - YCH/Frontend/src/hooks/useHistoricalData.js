import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import usePolling from './usePolling';

/**
 * Custom hook for fetching historical sensor data
 * @param {string} deviceId - Device identifier
 * @param {number} timeRangeHours - Time range in hours (1, 6, 24, 168)
 * @param {boolean} enablePolling - Whether to enable auto-refresh (default: false)
 */
const useHistoricalData = (deviceId, timeRangeHours, enablePolling = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!deviceId || !timeRangeHours) {
            setError('Device ID and time range are required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const result = await api.getHistoricalData(deviceId, timeRangeHours);

            if (result.success) {
                // Transform data for chart consumption
                const chartData = result.data.readings.map(reading => ({
                    timestamp: new Date(reading.timestamp).getTime(),
                    pm25: reading.pm25,
                    co2: reading.co2,
                    co: reading.co,
                    voc: reading.voc,
                    formattedTime: new Date(reading.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));

                setData({
                    readings: chartData,
                    timeRangeHours: result.data.time_range_hours,
                    totalReadings: result.data.total_readings
                });
                setError(null);
            } else {
                setError(result.error || 'Failed to fetch historical data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [deviceId, timeRangeHours]);

    // Trigger initial fetch when deviceId or timeRangeHours changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Optional polling for real-time updates (disabled by default for historical data)
    usePolling(fetchData, 30000, enablePolling && !!deviceId);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
};

export default useHistoricalData;
