import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// API Service Object
const api = {
    // ============= HEALTH CHECK =============

    /**
     * Check if backend is healthy
     */
    healthCheck: async () => {
        try {
            const response = await apiClient.get('/health');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // ============= DASHBOARD ROUTES =============

    /**
     * Get comprehensive dashboard data for a device
     * @param {string} deviceId - Device identifier
     */
    getDashboardData: async (deviceId) => {
        try {
            const response = await apiClient.get(`/api/v1/dashboard/data/${deviceId}`);
            return { success: true, data: response.data };
        } catch (error) {
            // Handle 501 Not Implemented gracefully
            if (error.response?.status === 501) {
                return { success: false, notImplemented: true, error: 'Dashboard endpoint not yet implemented' };
            }
            return { success: false, error: error.message };
        }
    },

    /**
     * Get list of all registered devices
     */
    getDevices: async () => {
        try {
            const response = await apiClient.get('/api/v1/dashboard/devices');
            return { success: true, data: response.data.devices || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get recent blockchain logs
     * @param {number} limit - Number of logs to retrieve
     */
    getBlockchainLogs: async (limit = 20) => {
        try {
            const response = await apiClient.get(`/api/v1/dashboard/blockchain/logs?limit=${limit}`);
            return { success: true, data: response.data.logs || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get analytics for a device
     * @param {string} deviceId - Device identifier
     * @param {number} hours - Time window in hours
     */
    getAnalytics: async (deviceId, hours = 24) => {
        try {
            const response = await apiClient.get(`/api/v1/dashboard/analytics/${deviceId}?hours=${hours}`);
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 501) {
                return { success: false, notImplemented: true, error: 'Analytics endpoint not yet implemented' };
            }
            return { success: false, error: error.message };
        }
    },

    // ============= SENSOR ROUTES =============

    /**
     * Get sensor status for a device
     * @param {string} deviceId - Device identifier
     */
    getSensorStatus: async (deviceId) => {
        try {
            const response = await apiClient.get(`/api/v1/sensor/status/${deviceId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get sensor history for a device
     * @param {string} deviceId - Device identifier
     * @param {number} limit - Number of readings to retrieve
     */
    getSensorHistory: async (deviceId, limit = 50) => {
        try {
            const response = await apiClient.get(`/api/v1/sensor/history/${deviceId}?limit=${limit}`);
            return { success: true, data: response.data.readings || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // ============= CONTROL ROUTES =============

    /**
     * Set manual fan override
     * @param {string} deviceId - Device identifier
     * @param {boolean} fanOn - Fan on/off state
     * @param {number} fanIntensity - Fan intensity (0-100)
     */
    setFanOverride: async (deviceId, fanOn, fanIntensity) => {
        try {
            const response = await apiClient.post('/api/v1/control/override', null, {
                params: { device_id: deviceId, fan_on: fanOn, fan_intensity: fanIntensity }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Clear manual fan override
     * @param {string} deviceId - Device identifier
     */
    clearFanOverride: async (deviceId) => {
        try {
            const response = await apiClient.delete(`/api/v1/control/override/${deviceId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get control status for a device
     * @param {string} deviceId - Device identifier
     */
    getControlStatus: async (deviceId) => {
        try {
            const response = await apiClient.get(`/api/v1/control/status/${deviceId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default api;
