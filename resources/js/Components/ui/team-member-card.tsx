import { motion } from 'framer-motion';
import { Card, CardContent } from '@/Components/ui/card';
import { Crown, User, Sparkles, Mail, Phone } from 'lucide-react';

interface TeamMemberData {
    id: number;
    name: string;
    position: string;
    role: 'ketua' | 'anggota';
    order: number;
    email?: string;
    phone?: string;
}

interface TeamMemberCardProps {
    member: TeamMemberData;
    isKetua?: boolean;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function TeamMemberCard({ member, isKetua = false }: TeamMemberCardProps) {
    const initials = getInitials(member.name);

    if (isKetua) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
            >
                <Card 
                    className="group relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
                    role="article"
                    aria-label={`Team leader: ${member.name}`}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
                    
                    {/* Sparkle decorations */}
                    <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    
                    <CardContent className="p-8 lg:p-10 flex flex-col items-center text-center relative z-10">
                        {/* Avatar with glow effect */}
                        <motion.div 
                            className="relative mb-6"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150" />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center ring-4 ring-white/30 shadow-xl">
                                <span className="text-3xl font-bold text-gray-900">{initials}</span>
                            </div>
                            <motion.div 
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Crown className="w-5 h-5 text-yellow-500" />
                            </motion.div>
                        </motion.div>
                        
                        {/* Title badge */}
                        <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Ketua PPID</span>
                        </div>
                        
                        <h3 className="text-xl lg:text-2xl font-bold mb-2">{member.name}</h3>
                        <p className="text-blue-200 text-sm mb-4">{member.position}</p>
                        
                        {/* Contact info if available */}
                        {(member.email || member.phone) && (
                            <div className="mt-4 pt-4 border-t border-white/20 w-full space-y-2">
                                {member.email && (
                                    <motion.a
                                        href={`mailto:${member.email}`}
                                        className="flex items-center justify-center gap-2 text-sm text-blue-200 hover:text-yellow-400 transition-colors"
                                        whileHover={{ x: 5 }}
                                        aria-label={`Email ${member.name}`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>{member.email}</span>
                                    </motion.a>
                                )}
                                {member.phone && (
                                    <motion.a
                                        href={`tel:${member.phone}`}
                                        className="flex items-center justify-center gap-2 text-sm text-blue-200 hover:text-yellow-400 transition-colors"
                                        whileHover={{ x: 5 }}
                                        aria-label={`Call ${member.name}`}
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>{member.phone}</span>
                                    </motion.a>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -4 }}
        >
            <Card 
                className="group bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden h-full"
                role="article"
                aria-label={`Team member: ${member.name}`}
            >
                {/* Top accent line */}
                <motion.div
                    className="h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                />
                
                <CardContent className="p-5 flex items-center gap-4">
                    {/* Avatar */}
                    <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors duration-300 shadow-sm">
                            <span className="text-lg font-bold text-blue-700">{initials}</span>
                        </div>
                    </motion.div>
                    
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 truncate">
                            {member.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{member.position}</p>
                        
                        {/* Contact info if available */}
                        {(member.email || member.phone) && (
                            <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                                {member.email && (
                                    <motion.a
                                        href={`mailto:${member.email}`}
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                        whileHover={{ x: 3 }}
                                        aria-label={`Email ${member.name}`}
                                    >
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate">{member.email}</span>
                                    </motion.a>
                                )}
                                {member.phone && (
                                    <motion.a
                                        href={`tel:${member.phone}`}
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                        whileHover={{ x: 3 }}
                                        aria-label={`Call ${member.name}`}
                                    >
                                        <Phone className="w-3 h-3" />
                                        <span className="truncate">{member.phone}</span>
                                    </motion.a>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Hover indicator */}
                    <motion.div 
                        className="w-2 h-2 rounded-full bg-blue-400"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}
