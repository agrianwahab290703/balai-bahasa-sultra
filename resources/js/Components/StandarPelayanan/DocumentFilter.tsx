import React from 'react';
import { cn } from '@/lib/utils';
import { SortingDownIcon } from 'hugeicons-react';

interface DocumentFilterProps {
    sortBy: 'latest' | 'popular' | 'name';
    onSortChange: (sort: 'latest' | 'popular' | 'name') => void;
}

const sortOptions = [
    { value: 'latest' as const, label: 'Terbaru' },
    { value: 'popular' as const, label: 'Terpopuler' },
    { value: 'name' as const, label: 'A-Z' },
];

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
    sortBy,
    onSortChange,
}) => {
    return (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Pengurutan</span>
                <span className="text-xs text-gray-500">Tampilkan sesuai kebutuhan</span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-600">
                    <SortingDownIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Urutkan:</span>
                </div>
                <div className="flex gap-1.5">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onSortChange(option.value)}
                            className={cn(
                                "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200",
                                "touch-manipulation",
                                sortBy === option.value
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentFilter;