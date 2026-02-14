// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 5000;
export const DEFAULT_DEVICE_ID = import.meta.env.VITE_DEFAULT_DEVICE_ID || 'ESP32_001';

// Sensor Thresholds for Status Indicators
export const THRESHOLDS = {
    PM25: {
        GOOD: 12,
        MODERATE: 35.4,
        UNHEALTHY: 55.4,
        VERY_UNHEALTHY: 150.4,
        HAZARDOUS: 250.4
    },
    CO2: {
        GOOD: 400,
        MODERATE: 1000,
        UNHEALTHY: 2000,
        VERY_UNHEALTHY: 5000
    },
    CO: {
        GOOD: 4.4,
        MODERATE: 9.4,
        UNHEALTHY: 12.4,
        VERY_UNHEALTHY: 15.4
    },
    VOC: {
        GOOD: 50,
        MODERATE: 220,
        UNHEALTHY: 660,
        VERY_UNHEALTHY: 2200
    }
};

// Air Type Icons/Labels
export const AIR_TYPES = {
    cigarette: { label: 'Cigarette Smoke', icon: '🚬', color: '#fa709a' },
    vehicle: { label: 'Vehicle Exhaust', icon: '🚗', color: '#667eea' },
    cooking: { label: 'Cooking Fumes', icon: '🍳', color: '#f093fb' },
    chemical: { label: 'Chemical Fumes', icon: '⚗️', color: '#fee140' },
    clean: { label: 'Clean Air', icon: '✅', color: '#38ef7d' },
    unknown: { label: 'Unknown', icon: '❓', color: '#764ba2' }
};

// Risk Levels
export const RISK_LEVELS = {
    LOW: { label: 'Low Risk', color: '#38ef7d', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    MEDIUM: { label: 'Medium Risk', color: '#f5576c', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    HIGH: { label: 'High Risk', color: '#fee140', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
};

// Fault Severity Colors
export const FAULT_SEVERITY = {
    low: { label: 'Low', color: '#38ef7d' },
    medium: { label: 'Medium', color: '#f5576c' },
    high: { label: 'High', color: '#fee140' }
};
