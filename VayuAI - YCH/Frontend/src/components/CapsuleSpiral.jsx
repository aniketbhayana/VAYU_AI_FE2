import React, { useMemo } from 'react';
import './CapsuleSpiral.css';

const CapsuleSpiral = ({ count = 80 }) => {
    const capsules = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const progress = i / count;
            const angle = progress * Math.PI * 6; // 3 turns
            const radius = 150 + progress * 400; // Wider spiral

            const x = Math.cos(angle) * radius;
            const y = (progress - 0.5) * 500;

            // Align to path + user's "slight rotation offset"
            const rotateZ = (angle * 180) / Math.PI;
            const rotateX = 65;
            const rotateY = i * 3.5; // More distinct rotation offset per capsule

            return {
                id: i,
                style: {
                    transform: `translate3d(${x}px, ${y}px, 0) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    opacity: 0.2 + (1 - progress) * 0.6, // Reverse fade for depth
                }
            };
        });
    }, [count]);

    return (
        <div className="capsule-spiral-container">
            <div className="capsule-array">
                {capsules.map((capsule) => (
                    <div key={capsule.id} className="capsule" style={capsule.style} />
                ))}
            </div>
        </div>
    );
};

export default CapsuleSpiral;
