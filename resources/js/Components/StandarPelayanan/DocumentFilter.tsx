import React from 'react';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
    FilterIcon,
    Cancel01Icon,
    SortingDownIcon,
} from 'hugeicons-react';

interface DocumentFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    sortBy: 'latest' | 'popular' | 'name';
    onSortChange: (sort: 'latest' | 'popular' | 'name') => void;
    resultCount: number;
}

const sortOptions = [
    { value: 'latest' as const, label: 'Terbaru' },
    { value: 'popular' as const, label: 'Terpopuler' },
    { value: 'name' as const, label: 'A-Z' },
];

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    resultCount,
}) => {
    const { isMobile } = useDeviceDetection();

    return (
        <div className={cn(
            "bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100",
            "p-3 md:p-4 space-y-3 md:space-y-4"
        )}>
            {/* Filter Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                    <FilterIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">Filter Kategori</span>
                </div>
                <span className="text-xs text-gray-500">
                    {resultCount} dokumen
                </span>
            </div>

            {/* Category Chips */}
            <div className={cn(
                "flex flex-wrap gap-2",
                isMobile && "overflow-x-auto pb-1 -mx-3 px-3 scrollbar-hide"
            )}>
                {/* All Categories */}
                <button
                    onClick={() => onCategoryChange(null)}
                    className={cn(
                        "shrink-0 px-3 py-1.5 md:py-1 rounded-full text-sm font-medium transition-all duration-200",
                        "border touch-manipulation",
                        !selectedCategory
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                >
                    Semua
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={cn(
                            "shrink-0 px-3 py-1.5 md:py-1 rounded-full text-sm font-medium transition-all duration-200",
                            "border touch-manipulation",
                            selectedCategory === category
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Sort Options */}
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

            {/* Clear Filter Badge */}
            {selectedCategory && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
                        onClick={() => onCategoryChange(null)}
                    >
                        {selectedCategory}
                        <Cancel01Icon className="w-3 h-3 ml-1.5" />
                    </Badge>
                    <button
                        onClick={() => onCategoryChange(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Hapus filter
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocumentFilter;
