import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
    Search01Icon,
    ArrowUp01Icon,
    FilterIcon,
    Cancel01Icon,
} from 'hugeicons-react';

interface FloatingAction {
    id: string;
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface FloatingActionButtonProps {
    actions?: FloatingAction[];
    onScrollToTop?: () => void;
    onOpenFilter?: () => void;
    onOpenSearch?: () => void;
    showScrollTop?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    actions = [],
    onScrollToTop,
    onOpenFilter,
    onOpenSearch,
    showScrollTop = true,
}) => {
    const { isMobile, isTablet } = useDeviceDetection();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Show/hide scroll to top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Only show on mobile/tablet
    if (!isMobile && !isTablet) return null;

    const handleScrollToTop = () => {
        if (onScrollToTop) {
            onScrollToTop();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const defaultActions: FloatingAction[] = [];

    if (onOpenSearch) {
        defaultActions.push({
            id: 'search',
            icon: Search01Icon,
            label: 'Cari',
            onClick: onOpenSearch,
        });
    }

    if (onOpenFilter) {
        defaultActions.push({
            id: 'filter',
            icon: FilterIcon,
            label: 'Filter',
            onClick: onOpenFilter,
        });
    }

    const allActions = [...defaultActions, ...actions];

    return (
        <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3">
            {/* Scroll to Top Button */}
            {showScrollTop && showScrollButton && (
                <button
                    onClick={handleScrollToTop}
                    className={cn(
                        "w-12 h-12 rounded-full bg-white text-gray-700 shadow-lg border border-gray-200",
                        "flex items-center justify-center",
                        "touch-manipulation active:scale-95 transition-all duration-200",
                        "hover:shadow-xl hover:border-gray-300"
                    )}
                    aria-label="Scroll to top"
                >
                    <ArrowUp01Icon className="w-5 h-5" />
                </button>
            )}

            {/* Expanded Actions */}
            {isExpanded && allActions.length > 0 && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {allActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => {
                                action.onClick();
                                setIsExpanded(false);
                            }}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all",
                                "touch-manipulation active:scale-95",
                                action.variant === 'primary'
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-200"
                            )}
                        >
                            <action.icon className="w-5 h-5" />
                            <span className="text-sm font-medium whitespace-nowrap pr-1">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main FAB */}
            {allActions.length > 0 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "w-14 h-14 rounded-full shadow-xl",
                        "flex items-center justify-center",
                        "touch-manipulation active:scale-95 transition-all duration-300",
                        isExpanded
                            ? "bg-gray-700 text-white rotate-45"
                            : "bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
                    )}
                    aria-label={isExpanded ? "Close menu" : "Open menu"}
                >
                    {isExpanded ? (
                        <Cancel01Icon className="w-6 h-6 -rotate-45" />
                    ) : (
                        <FilterIcon className="w-6 h-6" />
                    )}
                </button>
            )}
        </div>
    );
};

export default FloatingActionButton;
