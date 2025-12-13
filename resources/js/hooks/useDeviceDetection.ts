import { useState, useEffect } from 'react';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
}

interface TouchInfo {
    hasTouch: boolean;
    maxTouchPoints: number;
}

export const useDeviceDetection = (): DeviceInfo & TouchInfo => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo & TouchInfo>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1024,
        height: 768,
        orientation: 'landscape',
        hasTouch: false,
        maxTouchPoints: 0
    });

    useEffect(() => {
        const updateDeviceInfo = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobile = width <= 768;
            const isTablet = width > 768 && width <= 1024;
            const isDesktop = width > 1024;
            const orientation = width > height ? 'landscape' : 'portrait';
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const maxTouchPoints = navigator.maxTouchPoints || 0;

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                width,
                height,
                orientation,
                hasTouch,
                maxTouchPoints
            });
        };

        // Initial detection
        updateDeviceInfo();

        // Update on resize
        window.addEventListener('resize', updateDeviceInfo);
        window.addEventListener('orientationchange', updateDeviceInfo);

        return () => {
            window.removeEventListener('resize', updateDeviceInfo);
            window.removeEventListener('orientationchange', updateDeviceInfo);
        };
    }, []);

    return deviceInfo;
};

export const useResponsiveValue = <T>(values: {
    mobile?: T;
    tablet?: T;
    desktop: T;
}): T => {
    const { isMobile, isTablet } = useDeviceDetection();

    if (isMobile && values.mobile !== undefined) {
        return values.mobile;
    }

    if (isTablet && values.tablet !== undefined) {
        return values.tablet;
    }

    return values.desktop;
};

export const useViewportMeta = () => {
    const { isMobile } = useDeviceDetection();

    useEffect(() => {
        if (isMobile) {
            // Update viewport meta tag for mobile devices
            let viewportMeta = document.querySelector('meta[name="viewport"]');
            
            if (!viewportMeta) {
                viewportMeta = document.createElement('meta');
                viewportMeta.setAttribute('name', 'viewport');
                document.head.appendChild(viewportMeta);
            }
            
            viewportMeta.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
    }, [isMobile]);
};

export const useTouchGestures = (elementRef: React.RefObject<HTMLElement>) => {
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            setIsSwiping(true);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    setSwipeDirection(deltaX > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    setSwipeDirection(deltaY > 0 ? 'down' : 'up');
                }
            }
            
            setIsSwiping(false);
            
            // Reset swipe direction after a short delay
            setTimeout(() => setSwipeDirection(null), 100);
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [elementRef]);

    return { isSwiping, swipeDirection };
};

export const useDeviceSpecificStyles = () => {
    const { isMobile, isTablet, isDesktop } = useDeviceDetection();

    const getDeviceClass = (baseClass: string, deviceClasses?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
    }): string => {
        let classes = [baseClass];
        
        if (isMobile && deviceClasses?.mobile) {
            classes.push(deviceClasses.mobile);
        }
        
        if (isTablet && deviceClasses?.tablet) {
            classes.push(deviceClasses.tablet);
        }
        
        if (isDesktop && deviceClasses?.desktop) {
            classes.push(deviceClasses.desktop);
        }
        
        return classes.join(' ');
    };

    const getDeviceStyle = (baseStyle: React.CSSProperties, deviceStyles?: {
        mobile?: React.CSSProperties;
        tablet?: React.CSSProperties;
        desktop?: React.CSSProperties;
    }): React.CSSProperties => {
        let style = { ...baseStyle };
        
        if (isMobile && deviceStyles?.mobile) {
            style = { ...style, ...deviceStyles.mobile };
        }
        
        if (isTablet && deviceStyles?.tablet) {
            style = { ...style, ...deviceStyles.tablet };
        }
        
        if (isDesktop && deviceStyles?.desktop) {
            style = { ...style, ...deviceStyles.desktop };
        }
        
        return style;
    };

    return { getDeviceClass, getDeviceStyle };
};

export const useAutoSync = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

    const triggerSync = async () => {
        setIsSyncing(true);
        
        try {
            // Check for sync updates
            const response = await fetch('/build/.sync-info');
            if (response.ok) {
                const syncInfo = await response.json();
                setLastSyncTime(syncInfo.timestamp);
                
                // If sync info is newer than current page load, trigger a refresh
                if (syncInfo.timestamp > (window.pageLoadTime || 0)) {
                    console.log('🔄 New sync detected, refreshing...');
                    window.location.reload();
                }
            }
        } catch (error) {
            console.warn('Failed to check sync status:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        // Store page load time
        window.pageLoadTime = Date.now();
        
        // Set up periodic sync checks
        const interval = setInterval(triggerSync, 5000); // Check every 5 seconds
        
        return () => clearInterval(interval);
    }, []);

    return { isSyncing, lastSyncTime, triggerSync };
};

// Extend Window interface to include pageLoadTime
declare global {
    interface Window {
        pageLoadTime?: number;
    }
}