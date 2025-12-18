import React from 'react';

interface DocumentSkeletonProps {
    count?: number;
}

const Pulse: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className ?? ''}`} />
);

const DocumentSkeleton: React.FC<DocumentSkeletonProps> = ({ count = 4 }) => (
    <ul className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
            <li
                key={`document-skeleton-${index}`}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Icon Skeleton */}
                    <Pulse className="h-14 w-14 shrink-0 rounded-xl" />

                    {/* Content Skeleton */}
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex gap-2">
                            <Pulse className="h-5 w-16 rounded-full" />
                            <Pulse className="h-5 w-12 rounded-full" />
                        </div>
                        <Pulse className="h-6 w-3/4" />
                        <Pulse className="h-4 w-full" />
                        <div className="flex gap-4">
                            <Pulse className="h-4 w-16" />
                            <Pulse className="h-4 w-24" />
                            <Pulse className="h-4 w-20" />
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
                        <Pulse className="h-10 w-32 rounded-lg" />
                        <Pulse className="h-10 w-28 rounded-lg" />
                    </div>
                </div>
            </li>
        ))}
    </ul>
);

export default DocumentSkeleton;