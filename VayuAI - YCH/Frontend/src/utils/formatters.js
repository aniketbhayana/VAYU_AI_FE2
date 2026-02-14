import { THRESHOLDS } from './constants';

/**
 * Format timestamp to readable string
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * Get status color based on sensor value and thresholds
 */
export const getStatusColor = (sensorType, value) => {
    const threshold = THRESHOLDS[sensorType];
    if (!threshold) return '#38ef7d'; // Default green

    if (value <= threshold.GOOD) return '#38ef7d'; // Green
    if (value <= threshold.MODERATE) return '#f5576c'; // Yellow
    if (value <= threshold.UNHEALTHY) return '#fa709a'; // Orange
    return '#fee140'; // Red
};

/**
 * Get status label based on sensor value and thresholds
 */
export const getStatusLabel = (sensorType, value) => {
    const threshold = THRESHOLDS[sensorType];
    if (!threshold) return 'Unknown';

    if (value <= threshold.GOOD) return 'Good';
    if (value <= threshold.MODERATE) return 'Moderate';
    if (value <= threshold.UNHEALTHY) return 'Unhealthy';
    if (value <= threshold.VERY_UNHEALTHY) return 'Very Unhealthy';
    return 'Hazardous';
};

/**
 * Truncate blockchain hash for display
 */
export const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

/**
 * Format confidence score as percentage
 */
export const formatConfidence = (confidence) => {
    if (confidence === null || confidence === undefined) return 'N/A';
    return `${(confidence * 100).toFixed(1)}%`;
};

/**
 * Get risk level from prediction
 */
export const getRiskLevel = (prediction) => {
    if (!prediction) return 'LOW';

    if (prediction.will_peak && prediction.confidence > 0.7) {
        if (prediction.estimated_peak_value > 150) return 'HIGH';
        if (prediction.estimated_peak_value > 75) return 'MEDIUM';
    }

    return 'LOW';
};
