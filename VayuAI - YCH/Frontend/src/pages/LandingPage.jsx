import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularDiscs from '../components/CircularDiscs';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <section className="hero-section">
                {/* Premium Circular Discs Background */}
                <CircularDiscs count={18} />

                <div className="container">
                    <div className="hero-content">

                        <h1 className="hero-title">
                            Smart AI Agents for End-to-End <br />
                            Air Quality management
                        </h1>

                        <p className="hero-description">
                            Our purpose-built AI agents are designed specifically for
                            industrial air monitoring and autonomous control workflows.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="btn btn-solid"
                                onClick={() => navigate('/dashboard')}
                            >
                                GO TO DASHBOARD
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            <section id="features" className="features-section container">
                <div className="features-header">
                    <h2 className="section-title">Core System Features</h2>
                    <p className="section-subtitle">Intelligent air safety management powered by Gen-AI and Blockchain</p>
                </div>

                <div className="features-simple-grid">
                    <div className="feature-item">
                        <div className="feature-number">01</div>
                        <h3 className="feature-name">Real-Time Monitoring</h3>
                        <p className="feature-text">Live sensor data tracking for PM2.5, CO, CO2, and VOC levels with instant updates.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-number">02</div>
                        <h3 className="feature-name">AI-Powered Predictions</h3>
                        <p className="feature-text">Advanced machine learning algorithms predict smoke events and classify air quality.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-number">03</div>
                        <h3 className="feature-name">Blockchain Logging</h3>
                        <p className="feature-text">Immutable event logging ensures data integrity and absolute transparency.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-number">04</div>
                        <h3 className="feature-name">Smart Control</h3>
                        <p className="feature-text">Automated fan control with manual override capabilities for precise management.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-number">05</div>
                        <h3 className="feature-name">Fault Detection</h3>
                        <p className="feature-text">Self-healing system monitors hardware health and takes immediate corrective actions.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-number">06</div>
                        <h3 className="feature-name">Analytics Dashboard</h3>
                        <p className="feature-text">Comprehensive visualization of air quality metrics and system health performance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
