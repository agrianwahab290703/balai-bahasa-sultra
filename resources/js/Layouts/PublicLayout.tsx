import React from 'react';
import { Head } from '@inertiajs/react';
import { Header } from '@/Components/Public/Header';
import { Footer } from '@/Components/Public/Footer';

interface PublicLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
    children, 
    title, 
    description 
}) => {
    return (
        <div className="min-h-screen bg-background">
            <Head>
                <title>{title ? `${title} - Balai Bahasa Sultra` : 'Balai Bahasa Kemendikdasmen Sulawesi Tenggara'}</title>
                {description && <meta name="description" content={description} />}
            </Head>
            
            <Header />
            
            <main className="min-h-screen pt-28 lg:pt-36">
                {children}
            </main>
            
            <Footer />
        </div>
    );
};
