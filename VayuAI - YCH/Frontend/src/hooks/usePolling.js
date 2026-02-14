import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for polling data at regular intervals
 * @param {Function} callback - Function to call on each poll
 * @param {number} interval - Polling interval in milliseconds
 * @param {boolean} enabled - Whether polling is enabled
 */
const usePolling = (callback, interval, enabled = true) => {
    const savedCallback = useRef();

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        if (!enabled) return;

        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current();
            }
        };

        // Call immediately on mount
        tick();

        // Then set up interval
        const id = setInterval(tick, interval);

        return () => clearInterval(id);
    }, [interval, enabled]);
};

export default usePolling;
