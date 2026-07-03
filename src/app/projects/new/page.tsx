import React from 'react';
import CreateProjectForm from '@/views/company/CreateProjectForm';
import { getCurrentUser } from '@/models/auth.model';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NewProjectPage() {
    const user = await getCurrentUser();

    // 1. Kiểm tra đăng nhập
    if (!user) {
        redirect('/login');
    }

    // 2. Kiểm tra quyền: Nếu không phải DOANH_NGHIEP hoặc ADMIN thì hiển thị thông báo chặn
    if (user.role !== 'DOANH_NGHIEP' && user.role !== 'ADMIN') {
        return (
            <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center text-[#202124]">
                <h1 className="text-xl font-bold text-[#202124] mb-2">Quyền truy cập bị từ chối</h1>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Tài khoản của bạn (<strong className="text-gray-900">{user.role}</strong>) không có quyền thực hiện chức năng này.<br/>
                    Chỉ có tài khoản <strong>DOANH NGHIỆP</strong> hoặc <strong>ADMIN</strong> mới được đăng tải bài tuyển dụng.
                </p>
                <div className="flex justify-center">
                    <Link
                        href="/projects"
                        className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded text-sm transition-colors"
                    >
                        Quay lại danh sách dự án
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Nếu đủ quyền, hiển thị form
    return (
        <div className="min-h-[85vh] py-6 px-4">
            <CreateProjectForm companyId={user.id} companyName={user.fullName} />
        </div>
    );
}
