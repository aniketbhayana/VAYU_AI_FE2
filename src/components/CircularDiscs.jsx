import React, { useMemo } from 'react';
import './CircularDiscs.css';

const CircularDiscs = ({ count = 18 }) => {
    const discs = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            // Symmetrical circular array (stack)
            const rotateX = 75; // Heavy tilt for depth
            const rotateZ = i * (360 / count); // Symmetrical distribution
            const translateY = -200; // Radius of the "ring" orbit

            return {
                id: i,
                style: {
                    transform: `rotateZ(${rotateZ}deg) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                    opacity: 0.1 + (i / count) * 0.5,
                    // Pulse or stagger if needed, but keeping it static/clean first
                }
            };
        });
    }, [count]);

    return (
        <div className="circular-discs-container">
            <div className="discs-stack">
                {discs.map((disc) => (
                    <div key={disc.id} className="disc" style={disc.style} />
                ))}
            </div>
        </div>
    );
};

export default CircularDiscs;
