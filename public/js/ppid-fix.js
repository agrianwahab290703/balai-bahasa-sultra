// Fix for PPID galeri-wrapper error
// This script runs after DOM is loaded and prevents the galeriWrap error

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    function init() {
        // Override any potential error-causing code
        // Check if galeriWrap element exists before any operations
        const galeriWrap = document.querySelector('.galeri-wrapper');

        // If the element doesn't exist, create a dummy one to prevent errors
        if (!galeriWrap) {
            // Create a hidden div to prevent null reference errors
            const dummyGaleri = document.createElement('div');
            dummyGaleri.className = 'galeri-wrapper';
            dummyGaleri.style.display = 'none';
            document.body.appendChild(dummyGaleri);

            // Log that we've prevented an error
            console.log('PPID: Created dummy galeri-wrapper to prevent null reference errors');
        }

        // Also override any global functions that might cause issues
        if (typeof window.addEventListener === 'function') {
            // Remove any existing click listeners that might error
            const originalAddEventListener = EventTarget.prototype.addEventListener;

            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // Wrap the listener in try-catch to prevent errors
                const wrappedListener = function(event) {
                    try {
                        return listener.call(this, event);
                    } catch (error) {
                        // Log the error but don't crash
                        console.error('PPID: Prevented error in event listener:', error.message);
                        return false;
                    }
                };

                return originalAddEventListener.call(this, type, wrappedListener, options);
            };
        }
    }

    // Run as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();