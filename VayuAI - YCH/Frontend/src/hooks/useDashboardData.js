import { useState, useCallback } from 'react';
import api from '../services/api';
import usePolling from './usePolling';
import { POLLING_INTERVAL } from '../utils/constants';

/**
 * Custom hook for fetching and polling dashboard data
 * @param {string} deviceId - Device identifier
 */
const useDashboardData = (deviceId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notImplemented, setNotImplemented] = useState(false);

    const fetchData = useCallback(async () => {
        if (!deviceId) {
            setError('No device ID provided');
            setLoading(false);
            return;
        }

        try {
            const result = await api.getDashboardData(deviceId);

            if (result.success) {
                setData(result.data);
                setError(null);
                setNotImplemented(false);
            } else if (result.notImplemented) {
                setNotImplemented(true);
                setError(result.error);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    // Poll data at regular intervals
    usePolling(fetchData, POLLING_INTERVAL, !!deviceId);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    return { data, loading, error, notImplemented, refetch };
};

export default useDashboardData;
