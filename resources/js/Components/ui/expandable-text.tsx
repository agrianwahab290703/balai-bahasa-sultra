import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye, EyeOff, BookOpen } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface ExpandableTextProps {
    content: string;
    previewLength?: number;
    className?: string;
}

export function ExpandableText({
    content,
    previewLength = 300,
    className = ''
}: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    const shouldTruncate = content.length > previewLength;
    const displayText = shouldTruncate && !isExpanded
        ? content.slice(0, previewLength) + '...'
        : content;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            // Simulate reading progress when expanded
            const estimatedReadingTime = content.length / 10; // ~10 chars per second
            let progress = 0;
            const interval = setInterval(() => {
                progress += 100 / estimatedReadingTime;
                if (progress >= 100) {
                    setReadingProgress(100);
                    clearInterval(interval);
                } else {
                    setReadingProgress(progress);
                }
            }, 1000);
        } else {
            setReadingProgress(0);
        }
    };

    const estimatedReadTime = Math.ceil(content.length / 1000); // ~1000 chars per minute

    return (
        <div className={className}>
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isExpanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {displayText}
                        </p>
                    </motion.div>
                </AnimatePresence>
                
                {/* Gradient fade effect when collapsed */}
                <AnimatePresence>
                    {shouldTruncate && !isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Reading progress bar when expanded */}
                <AnimatePresence>
                    {isExpanded && readingProgress < 100 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4"
                        >
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <Eye className="w-4 h-4" />
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${readingProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <span>Membaca...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {shouldTruncate && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Waktu baca: ~{estimatedReadTime} menit</span>
                        </div>
                        
                        <Button
                            variant="ghost"
                            onClick={toggleExpand}
                            className="group relative overflow-hidden text-blue-600 hover:text-white font-medium transition-all duration-300 px-6 py-2 rounded-xl border-2 border-blue-600 hover:border-blue-700"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse content' : 'Expand content'}
                        >
                            {/* Button gradient background on hover */}
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            
                            <span className="relative flex items-center gap-2">
                                {isExpanded ? (
                                    <>
                                        <EyeOff className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                        <span>Tampilkan Lebih Sedikit</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                                        <span>Baca Selengkapnya</span>
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
