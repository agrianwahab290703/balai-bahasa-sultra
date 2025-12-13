import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface DocumentSkeletonProps {
    count?: number;
}

const SkeletonPulse: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

const SingleDocumentSkeleton: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
    <Card className="border-0 bg-white overflow-hidden">
        <CardContent className="p-0">
            <div className="relative">
                {/* Header Gradient Strip */}
                <SkeletonPulse className="h-2 md:h-3" />
                
                {/* Main Content */}
                <div className={cn(
                    "p-4 md:p-6",
                    isMobile && "space-y-4"
                )}>
                    <div className={cn(
                        "flex gap-3 md:gap-4",
                        isMobile ? "flex-col" : "items-start"
                    )}>
                        {/* Icon & Category */}
                        <div className={cn(
                            "flex items-center gap-3",
                            !isMobile && "shrink-0 flex-col items-center"
                        )}>
                            <SkeletonPulse className={cn(
                                "rounded-xl md:rounded-2xl",
                                isMobile ? "w-12 h-12" : "w-14 h-14"
                            )} />
                            {isMobile && (
                                <SkeletonPulse className="w-16 h-5 rounded-full" />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 space-y-3">
                            <SkeletonPulse className="h-5 w-3/4" />
                            <div className="space-y-2">
                                <SkeletonPulse className="h-4 w-full" />
                                <SkeletonPulse className="h-4 w-2/3" />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <SkeletonPulse className="h-4 w-16" />
                                <SkeletonPulse className="h-4 w-20" />
                                <SkeletonPulse className="h-4 w-24" />
                            </div>
                        </div>

                        {/* Desktop Badge */}
                        {!isMobile && (
                            <SkeletonPulse className="shrink-0 w-28 h-6 rounded-full" />
                        )}
                    </div>

                    {/* Actions */}
                    <div className={cn(
                        "flex gap-2 md:gap-3",
                        isMobile ? "mt-4" : "mt-5"
                    )}>
                        <SkeletonPulse className={cn(
                            "flex-1 rounded-md",
                            isMobile ? "h-11" : "h-10"
                        )} />
                        <SkeletonPulse className={cn(
                            "rounded-md",
                            isMobile ? "w-11 h-11" : "w-10 h-10"
                        )} />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const DocumentSkeleton: React.FC<DocumentSkeletonProps> = ({ count = 3 }) => {
    const { isMobile } = useDeviceDetection();

    return (
        <div className="grid gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SingleDocumentSkeleton key={index} isMobile={isMobile} />
            ))}
        </div>
    );
};

// Filter skeleton
export const FilterSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
            <SkeletonPulse className="h-5 w-28" />
            <SkeletonPulse className="h-4 w-16" />
        </div>
        <div className="flex gap-2 overflow-hidden">
            <SkeletonPulse className="h-8 w-16 rounded-full" />
            <SkeletonPulse className="h-8 w-14 rounded-full" />
            <SkeletonPulse className="h-8 w-12 rounded-full" />
            <SkeletonPulse className="h-8 w-20 rounded-full" />
            <SkeletonPulse className="h-8 w-18 rounded-full" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <SkeletonPulse className="h-4 w-16" />
            <div className="flex gap-1.5">
                <SkeletonPulse className="h-6 w-14 rounded-md" />
                <SkeletonPulse className="h-6 w-18 rounded-md" />
                <SkeletonPulse className="h-6 w-10 rounded-md" />
            </div>
        </div>
    </div>
);

export default DocumentSkeleton;
