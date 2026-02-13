import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    VAYU AI
                </div>

                <div className="navbar-menu">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#how-it-works" className="nav-link">How it works</a>
                </div>

                <div className="navbar-actions">
                    {location.pathname !== '/dashboard' ? (
                        <button
                            className="btn btn-solid"
                            onClick={() => navigate('/dashboard')}
                        >
                            Launch Dashboard
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
