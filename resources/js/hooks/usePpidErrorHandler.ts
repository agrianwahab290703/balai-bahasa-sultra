import { useEffect } from 'react';

/**
 * Custom hook to handle PPID-specific JavaScript errors
 * particularly the galeri-wrapper null reference error
 */
export const usePpidErrorHandler = () => {
    useEffect(() => {
        // Create a dummy galeri-wrapper element if it doesn't exist
        // This prevents errors from external scripts looking for this element
        const galeriWrap = document.querySelector('.galeri-wrapper');

        if (!galeriWrap) {
            const dummyGaleri = document.createElement('div');
            dummyGaleri.className = 'galeri-wrapper';
            dummyGaleri.style.display = 'none';
            dummyGaleri.setAttribute('data-dummy', 'true');
            dummyGaleri.setAttribute('data-ppid-fix', 'true');
            document.body.appendChild(dummyGaleri);

            console.log('PPID: Created dummy galeri-wrapper to prevent errors');
        }

        // Store original addEventListener to restore later
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        // Override addEventListener to catch and prevent errors
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const wrappedListener = function(event) {
                try {
                    return listener.call(this, event);
                } catch (error) {
                    // Log the error but don't crash the application
                    console.error('PPID: Prevented error in event listener:', error.message);
                    return false;
                }
            };

            return originalAddEventListener.call(this, type, wrappedListener, options);
        };

        // Also handle window.onerror for any other potential errors
        const originalOnError = window.onerror;
        window.onerror = function(message, source, lineno, colno, error) {
            // Check if it's the galeri-wrapper related error
            if (message && typeof message === 'string' && message.includes('galeriWrap')) {
                console.warn('PPID: Caught galeri-wrapper related error and prevented crash');
                return true; // Prevent the error from propagating
            }

            // Call original error handler for other errors
            if (originalOnError) {
                return originalOnError.call(window, message, source, lineno, colno, error);
            }

            return false;
        };

        // Cleanup on unmount
        return () => {
            // Remove dummy element if it exists
            const dummyGaleri = document.querySelector('.galeri-wrapper[data-ppid-fix="true"]');
            if (dummyGaleri) {
                dummyGaleri.remove();
            }

            // Restore original addEventListener
            EventTarget.prototype.addEventListener = originalAddEventListener;

            // Restore original error handler
            window.onerror = originalOnError;
        };
    }, []); // Empty dependency array means this runs once on mount
};