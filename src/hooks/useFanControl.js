import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for fan control operations
 * @param {string} deviceId - Device identifier
 */
const useFanControl = (deviceId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setOverride = useCallback(async (fanOn, fanIntensity) => {
        if (!deviceId) {
            setError('No device ID provided');
            return { success: false };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await api.setFanOverride(deviceId, fanOn, fanIntensity);

            if (result.success) {
                setError(null);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    const clearOverride = useCallback(async () => {
        if (!deviceId) {
            setError('No device ID provided');
            return { success: false };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await api.clearFanOverride(deviceId);

            if (result.success) {
                setError(null);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    return { setOverride, clearOverride, loading, error };
};

export default useFanControl;
