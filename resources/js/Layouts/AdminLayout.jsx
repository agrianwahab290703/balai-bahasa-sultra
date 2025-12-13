import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Admin - Balai Bahasa Sultra</title>
            </Head>
            
            <div className="flex">
                {/* Sidebar will be added in next task */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
