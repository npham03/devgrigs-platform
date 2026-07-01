import React from 'react';
import Link from 'next/link';

// TODO: Code thanh menu dùng chung cho toàn web
export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition-colors">
                    DevGrigs Platform
                </Link>
                <div className="flex gap-6 items-center font-medium">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Trang chủ</Link>
                    <Link href="/projects" className="hover:text-blue-400 transition-colors">Dự án</Link>
                    {/* Các menu khác */}
                </div>
            </div>
        </nav>
    );
}
