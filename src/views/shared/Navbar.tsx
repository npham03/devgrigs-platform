import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/models/auth.model';
import { logoutController } from '@/controllers/auth.controller';

// Thanh điều hướng phong cách tối giản (Google Style)
export default async function Navbar() {
    const user = await getCurrentUser();

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <span className="bg-gray-100 text-gray-700 border border-gray-300 text-xs px-2 py-0.5 rounded font-medium">ADMIN</span>;
            case 'DOANH_NGHIEP':
                return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded font-medium">DOANH NGHIỆP</span>;
            case 'FREELANCER':
                return <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded font-medium">FREELANCER</span>;
            default:
                return null;
        }
    };

    return (
        <nav className="bg-white text-[#202124] px-6 py-3 border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-tight text-[#202124] hover:text-[#1a73e8] transition-colors">
                    DevGrigs Platform
                </Link>

                <div className="flex gap-6 items-center font-medium text-sm text-gray-700">
                    <Link href="/" className="hover:text-[#1a73e8] transition-colors">Trang chủ</Link>
                    <Link href="/projects" className="hover:text-[#1a73e8] transition-colors">Dự án</Link>

                    {(user?.role === 'DOANH_NGHIEP' || user?.role === 'ADMIN') && (
                        <Link 
                            href="/projects/new" 
                            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3.5 py-1.5 rounded text-sm font-medium transition-colors"
                        >
                            Đăng bài tuyển dụng
                        </Link>
                    )}

                    <div className="h-4 w-px bg-gray-200 mx-1"></div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded border border-gray-200">
                                <span className="text-gray-800 font-normal max-w-[150px] truncate">{user.fullName}</span>
                                {getRoleBadge(user.role)}
                            </div>
                            <form action={logoutController}>
                                <button 
                                    type="submit" 
                                    className="text-gray-500 hover:text-red-600 transition-colors text-xs font-medium px-2 py-1.5 rounded hover:bg-gray-100"
                                    title="Đăng xuất"
                                >
                                    Đăng xuất
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link 
                            href="/login" 
                            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-1.5 rounded font-medium transition-colors"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
