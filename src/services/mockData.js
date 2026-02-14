export const MOCK_DASHBOARD_DATA = {
    success: true,
    data: {
        current_reading: {
            pm25: 14.5,
            co2: 850,
            co: 2.1,
            voc: 120,
            timestamp: new Date().toISOString()
        },
        prediction: {
            smoke_detected: false,
            confidence: 0.98,
            estimated_time: "None"
        },
        classification: {
            type: "clean",
            label: "Clean Air",
            confidence: 0.99
        },
        recent_faults: [
            { id: 1, type: "none", message: "System healthy", severity: "low", timestamp: new Date().toISOString() }
        ],
        control_status: {
            fan_on: false,
            fan_intensity: 0,
            auto_mode: true
        },
        recent_logs: [
            {
                id: "0xabc123",
                event_type: "decision",
                device_id: "ESP32_001",
                hash: "0x7d2e9f3b1c5a8d4e9f3b1c5a8d4e9f3b1c5a8d4e",
                timestamp: new Date().toISOString(),
                data: { detail: "Air quality optimized", action: "Fan Speed Adjusted" }
            },
            {
                id: "0xdef456",
                event_type: "healing",
                device_id: "ESP32_001",
                hash: "0x3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
                timestamp: new Date().toISOString(),
                data: { issue: "Sensor jitter detected", resolution: "Auto-calibration applied" }
            }
        ]
    }
};

export const MOCK_DEVICES = {
    success: true,
    data: ['ESP32_001', 'ESP32_002']
};
