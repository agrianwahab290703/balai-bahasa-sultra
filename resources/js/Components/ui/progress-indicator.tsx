import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ProgressIndicator() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Progress bar at top */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-50"
                style={{ scaleX }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Circular progress indicator */}
            <motion.div
                className="fixed bottom-8 right-8 z-40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative w-14 h-14">
                    {/* Background circle */}
                    <svg
                        className="w-14 h-14 transform -rotate-90"
                        viewBox="0 0 56 56"
                    >
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200"
                        />
                    </svg>
                    
                    {/* Progress circle */}
                    <svg
                        className="absolute inset-0 w-14 h-14 transform -rotate-90"
                        viewBox="0 0 56 56"
                    >
                        <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="url(#progressGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            style={{
                                pathLength: scrollYProgress
                            }}
                            strokeDasharray="0 1"
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#9333ea" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span 
                            className="text-xs font-bold text-gray-700"
                            style={{
                                opacity: scrollYProgress
                            }}
                        >
                            {Math.round(scrollYProgress.get() * 100)}%
                        </motion.span>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
