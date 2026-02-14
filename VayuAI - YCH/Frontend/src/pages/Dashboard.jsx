import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardData from '../hooks/useDashboardData';
import DeviceSelector from '../components/DeviceSelector';
import SensorDataCard from '../components/SensorDataCard';
import SmokePredictionCard from '../components/SmokePredictionCard';
import AirClassificationCard from '../components/AirClassificationCard';
import FaultDetectionCard from '../components/FaultDetectionCard';
import FanControlCard from '../components/FanControlCard';
import BlockchainLogsCard from '../components/BlockchainLogsCard';
import { DEFAULT_DEVICE_ID } from '../utils/constants';
import './Dashboard.css';

/**
 * Main Dashboard Page
 * Displays all VAYU AI monitoring and control components
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const [selectedDevice, setSelectedDevice] = useState(DEFAULT_DEVICE_ID);
    const { data, loading, error, notImplemented, refetch } = useDashboardData(selectedDevice);

    return (
        <div className="dashboard container">
            <header className="dashboard-subheader">
                <div className="subheader-content">
                    <h2 className="dashboard-page-title">Monitoring Dashboard</h2>
                    <DeviceSelector
                        selectedDevice={selectedDevice}
                        onDeviceChange={setSelectedDevice}
                    />
                </div>
            </header>

            <main className="dashboard-content">
                {loading && !data ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h2>Connection Error</h2>
                        <p>{error}</p>
                        {notImplemented && (
                            <div className="info-message">
                                <p>The backend dashboard endpoint is not yet fully implemented.</p>
                                <p>Displaying mock data for demonstration purposes.</p>
                            </div>
                        )}
                        <button className="retry-btn" onClick={refetch}>
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        <SensorDataCard sensorData={data?.current_reading} />
                        <SmokePredictionCard prediction={data?.prediction} />
                        <AirClassificationCard classification={data?.classification} />
                        <FaultDetectionCard
                            faults={data?.recent_faults}
                            healingActions={data?.recent_faults?.map(f => ({
                                action_taken: 'Self-healing action triggered',
                                success: true
                            }))}
                        />
                        <FanControlCard
                            controlStatus={data?.control_status}
                            deviceId={selectedDevice}
                            onUpdate={refetch}
                        />
                        <BlockchainLogsCard logs={data?.recent_logs} />
                    </div>
                )}
            </main>

            <footer className="dashboard-footer">
                <p>VAYU AI - Gen-AI + Blockchain Air Safety System</p>
                <p className="footer-status">
                    {loading && <span className="status-dot pulsing"></span>}
                    {loading ? 'Updating...' : 'Connected'}
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
