import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { BookOpen, Users, Award, Target, ChevronRight, Building, FileText, History, Landmark } from 'lucide-react';

const profilMenus = [
    { 
        title: 'Sejarah', 
        href: '/profil/sejarah', 
        icon: History,
        description: 'Sejarah berdirinya Balai Bahasa Sulawesi Tenggara',
        color: 'bg-blue-500'
    },
    { 
        title: 'Kedudukan', 
        href: '/profil/kedudukan', 
        icon: Landmark,
        description: 'Kedudukan dan fungsi Kantor Bahasa',
        color: 'bg-purple-500'
    },
    { 
        title: 'Visi & Misi', 
        href: '/profil/visi-misi', 
        icon: Target,
        description: 'Visi dan misi organisasi dalam pengembangan bahasa',
        color: 'bg-green-500'
    },
    { 
        title: 'Struktur Organisasi', 
        href: '/profil/struktur', 
        icon: Users,
        description: 'Struktur organisasi dan pejabat Balai Bahasa',
        color: 'bg-orange-500'
    },
];

export default function ProfilIndex() {
    return (
        <PublicLayout title="Profil">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-800 to-blue-900 py-16">
                <div className="container mx-auto px-4 text-center text-white">
                    <Badge className="mb-4 bg-yellow-400 text-black">Tentang Kami</Badge>
                    <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Profil Balai Bahasa</h1>
                    <p className="mt-4 text-blue-200 max-w-2xl mx-auto">
                        Mengenal lebih dekat Balai Bahasa Sulawesi Tenggara
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-2 items-center">
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-700">Tentang Kami</Badge>
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
                                Balai Bahasa Sulawesi Tenggara
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Balai Bahasa Sulawesi Tenggara adalah Unit Pelaksana Teknis (UPT) Badan Pengembangan 
                                dan Pembinaan Bahasa, Kementerian Pendidikan Dasar dan Menengah yang bertugas 
                                melaksanakan pengembangan, pembinaan, dan pelindungan bahasa dan sastra Indonesia 
                                di wilayah Sulawesi Tenggara.
                            </p>
                            <p className="text-muted-foreground mb-6">
                                Kami berkomitmen untuk melestarikan dan mengembangkan bahasa Indonesia serta 
                                bahasa daerah di Sulawesi Tenggara melalui berbagai program dan kegiatan yang 
                                melibatkan masyarakat luas.
                            </p>
                            <Link href="/profil/sejarah">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Pelajari Sejarah Kami
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <Building className="h-24 w-24 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Profile Menu Cards */}
            <section className="bg-gray-50 py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Informasi Profil</h2>
                        <p className="mt-2 text-muted-foreground">Pilih informasi yang ingin Anda ketahui</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {profilMenus.map((menu) => (
                            <Link key={menu.href} href={menu.href}>
                                <Card className="group h-full border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <CardContent className="p-6 text-center">
                                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${menu.color} text-white transition-transform group-hover:scale-110`}>
                                            <menu.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{menu.title}</h3>
                                        <p className="text-sm text-muted-foreground">{menu.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gradient-to-br from-blue-800 to-blue-900 py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold text-yellow-400 mb-2">2010</div>
                            <div className="text-blue-200">Tahun Berdiri</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
                            <div className="text-blue-200">Pegawai</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-400 mb-2">100+</div>
                            <div className="text-blue-200">Kegiatan/Tahun</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-400 mb-2">17</div>
                            <div className="text-blue-200">Kabupaten/Kota</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <Card className="border-0 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-xl">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
                                Ada Pertanyaan?
                            </h2>
                            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                                Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan 
                                tentang Balai Bahasa Sulawesi Tenggara
                            </p>
                            <Link href="/kontak">
                                <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-800">
                                    Hubungi Kami
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
