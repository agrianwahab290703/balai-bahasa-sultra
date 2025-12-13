import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Scale, ClipboardList, Users, MapPin, ChevronUp } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface NavigationSection {
    id: string;
    label: string;
    icon: React.ElementType;
}

const navigationSections: NavigationSection[] = [
    { id: 'introduction', label: 'Tentang', icon: Info },
    { id: 'principles', label: 'Prinsip', icon: Scale },
    { id: 'tasks', label: 'Tugas', icon: ClipboardList },
    { id: 'structure', label: 'Tim', icon: Users },
    { id: 'address', label: 'Alamat', icon: MapPin },
];

export function SmoothScrollNav() {
    const [activeSection, setActiveSection] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;
            
            // Show navigation after scrolling past hero
            setIsVisible(window.scrollY > 400);

            // Determine active section
            const sections = navigationSections.map(nav => ({
                id: nav.id,
                element: document.getElementById(nav.id),
            }));

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.element) {
                    const { offsetTop } = section.element;
                    if (scrollPosition >= offsetTop) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Desktop Navigation */}
                    <motion.nav
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40"
                        aria-label="Quick navigation"
                    >
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-3 space-y-2">
                            {navigationSections.map((section) => {
                                const IconComponent = section.icon;
                                const isActive = activeSection === section.id;
                                
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`
                                            group relative flex items-center gap-3 w-full px-3 py-2 rounded-xl
                                            transition-all duration-300
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                                        `}
                                        aria-label={`Navigate to ${section.label}`}
                                        aria-current={isActive ? 'true' : 'false'}
                                    >
                                        <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                                        
                                        {/* Tooltip */}
                                        <span className={`
                                            absolute left-full ml-4 px-3 py-1.5 rounded-lg whitespace-nowrap
                                            bg-gray-900 text-white text-sm font-medium
                                            opacity-0 group-hover:opacity-100 pointer-events-none
                                            transition-opacity duration-200
                                            ${isActive ? 'hidden' : ''}
                                        `}>
                                            {section.label}
                                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.nav>

                    {/* Mobile Navigation */}
                    <motion.nav
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden fixed bottom-4 left-4 right-4 z-40"
                        aria-label="Quick navigation"
                    >
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-3">
                            <div className="flex items-center justify-around gap-2">
                                {navigationSections.map((section) => {
                                    const IconComponent = section.icon;
                                    const isActive = activeSection === section.id;
                                    
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`
                                                flex flex-col items-center gap-1 px-2 py-2 rounded-xl
                                                transition-all duration-300 flex-1
                                                ${isActive 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105' 
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }
                                            `}
                                            aria-label={`Navigate to ${section.label}`}
                                            aria-current={isActive ? 'true' : 'false'}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="text-xs font-medium truncate max-w-full">
                                                {section.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.nav>

                    {/* Scroll to Top Button */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="fixed bottom-24 right-8 z-40"
                    >
                        <Button
                            onClick={scrollToTop}
                            size="icon"
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                            aria-label="Scroll to top"
                        >
                            <ChevronUp className="w-6 h-6" />
                        </Button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
