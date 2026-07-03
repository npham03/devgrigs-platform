'use client';

import React, { useState, useTransition } from 'react';
import { loginController } from '@/controllers/auth.controller';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const fillSampleAccount = (roleEmail: string) => {
        setEmail(roleEmail);
        setPassword('123456');
        setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        startTransition(async () => {
            const result = await loginController(formData);
            if (result.success) {
                router.push('/');
                router.refresh();
            } else {
                setErrorMessage(result.message || 'Đăng nhập thất bại');
            }
        });
    };

    return (
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-[#202124]">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#202124]">Đăng nhập hệ thống</h1>
                <p className="text-sm text-gray-600 mt-1">Kết nối Lập trình viên và Doanh nghiệp</p>
            </div>

            {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded text-sm font-medium border border-red-200">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="VD: hr@techcorp.vn"
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded text-sm transition-colors disabled:opacity-50 mt-2"
                >
                    {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-3 text-center uppercase tracking-wider">
                    Điền nhanh tài khoản mẫu (Seed Data)
                </p>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        type="button"
                        onClick={() => fillSampleAccount('hr@techcorp.vn')}
                        className="w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors flex justify-between items-center border border-gray-200"
                    >
                        <span>Doanh nghiệp (Đăng tin)</span>
                        <span className="font-mono text-[11px] text-gray-500">hr@techcorp.vn</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillSampleAccount('freelancer@devgrigs.com')}
                        className="w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors flex justify-between items-center border border-gray-200"
                    >
                        <span>Freelancer (Ứng tuyển)</span>
                        <span className="font-mono text-[11px] text-gray-500">freelancer@devgrigs.com</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillSampleAccount('admin@devgrigs.com')}
                        className="w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors flex justify-between items-center border border-gray-200"
                    >
                        <span>Admin (Quản trị)</span>
                        <span className="font-mono text-[11px] text-gray-500">admin@devgrigs.com</span>
                    </button>
                </div>
                <p className="text-[11px] text-gray-500 text-center mt-2">Mật khẩu mặc định: 123456</p>
            </div>
        </div>
    );
}
