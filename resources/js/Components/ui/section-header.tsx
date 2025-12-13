import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    icon: LucideIcon;
    description?: string;
}

export function SectionHeader({ title, icon: Icon, description }: SectionHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
            {/* Icon container with glow effect */}
            <div className="relative mb-5">
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-xl">
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
            
            {/* Title with gradient underline */}
            <div className="relative">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {title}
                </h2>
                <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
            </div>
            
            {description && (
                <p className="text-gray-600 max-w-2xl mt-4 text-base lg:text-lg leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
