import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/models/auth.model';
import db from '@/models/db';
import ApplicationManager from '@/views/company/ApplicationManager';

export default async function ManageApplicationsPage() {
    const loggedInUser = await getCurrentUser();

    if (!loggedInUser) {
        redirect('/login');
    }

    if (loggedInUser.role !== 'DOANH_NGHIEP') {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="p-8 bg-white rounded-lg border border-red-200 text-center max-w-md shadow-sm">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <span className="text-2xl">⛔</span>
                    </div>
                    <h2 className="text-lg font-bold text-red-600 mb-2">Quyền truy cập bị từ chối</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Tài khoản của bạn không có quyền xem trang này. Giao diện quản lý ứng viên chỉ dành riêng cho vai trò <strong>Doanh nghiệp</strong>.
                    </p>
                    
                        <a href="/projects"
                        className="inline-block px-5 py-2 bg-[#1a73e8] text-white text-sm font-semibold rounded hover:bg-[#1557b0] transition-colors"
                        >
                        Về trang Dự án
                    </a>
                </div>
            </main>
        );
    }

    const applications = await db.application.findMany({
        where: { project: { companyId: loggedInUser.id } },
        include: {
            freelancer: { select: { id: true, email: true, fullName: true, profileDetail: true } },
            project: { select: { id: true, title: true, status: true } },
        },
        orderBy: { appliedDate: 'desc' },
    });

    const serializedApplications = applications.map(app => ({
        ...app,
        appliedDate: app.appliedDate.toISOString(),
    }));

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] text-white">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-2 text-xs text-blue-100 mb-2">
                        <span>DevGrigs Platform</span>
                        <span>/</span>
                        <span>Doanh nghiệp</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Quản lý đơn ứng tuyển</h1>
                    <p className="text-blue-100 text-sm">
                        Xin chào <strong>{loggedInUser.fullName}</strong>, theo dõi và xử lý ứng viên nộp đơn vào các dự án của bạn.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-6 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 mb-1">Tổng số đơn</p>
                        <p className="text-2xl font-bold text-[#202124]">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 mb-1">Đang chờ duyệt</p>
                        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 mb-1">Đã chấp nhận</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 mb-1">Đã từ chối</p>
                        <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-12">
                <ApplicationManager
                    initialApplications={serializedApplications}
                    currentUserRole={loggedInUser.role}
                />
            </div>
        </main>
    );
}