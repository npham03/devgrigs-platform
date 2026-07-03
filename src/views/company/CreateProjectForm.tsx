'use client';

import React, { useState, useTransition } from 'react';
import { submitProjectController } from '@/controllers/project.action';
import { useRouter } from 'next/navigation';

export default function CreateProjectForm({ companyId, companyName }: { companyId: number, companyName: string }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append('companyId', companyId.toString());

        startTransition(async () => {
            const result = await submitProjectController(formData);
            if (result.success) {
                setSuccessMessage('🎉 Đăng tải bài tuyển dụng thành công! Đang chuyển hướng...');
                setTimeout(() => {
                    router.push('/projects');
                    router.refresh();
                }, 1500);
            } else {
                setErrorMessage(result.message || 'Đã xảy ra lỗi khi đăng bài!');
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto my-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-[#202124]">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-xl font-bold text-[#202124]">Đăng bài tuyển dụng mới</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Đăng tin dưới danh nghĩa doanh nghiệp: <strong className="text-[#1a73e8] font-medium">{companyName}</strong>
                </p>
            </div>

            {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded text-sm font-medium border border-red-200">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-3 bg-green-50 text-green-700 rounded text-sm font-medium border border-green-200">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề dự án / Vị trí tuyển dụng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="VD: Senior Fullstack Developer (Next.js + SQL Server)"
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngân sách dự kiến (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="budget"
                            required
                            placeholder="VD: 20000000 (20 triệu)"
                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hình thức làm việc <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="workType"
                            required
                            defaultValue="Remote"
                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                        >
                            <option value="Remote">Làm việc từ xa (Remote)</option>
                            <option value="Hybrid">Làm việc kết hợp (Hybrid)</option>
                            <option value="On-site">Làm việc tại văn phòng (On-site)</option>
                            <option value="Thỏa thuận">Thỏa thuận sau</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hạn chót ứng tuyển (Deadline) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            required
                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kỹ năng yêu cầu (Tags)
                        </label>
                        <input
                            type="text"
                            name="requiredSkills"
                            placeholder="VD: Next.js, TypeScript, SQL Server, Tailwind CSS"
                            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Các kỹ năng cách nhau bởi dấu phẩy (,)</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả chi tiết dự án & Yêu cầu ứng viên <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        required
                        rows={6}
                        placeholder="Mô tả cụ thể phạm vi công việc, yêu cầu kinh nghiệm, quyền lợi..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-[#202124] focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all text-sm leading-relaxed"
                    ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded text-sm transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Đang đăng bài...' : 'Đăng bài tuyển dụng'}
                    </button>
                </div>
            </form>
        </div>
    );
}
