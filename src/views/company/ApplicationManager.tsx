"use client";

import React, { useState, useMemo } from 'react';

// Định nghĩa Interface kiểu dữ liệu chặt chẽ - Xóa sạch lỗi "any"
interface UserType {
    id: number;
    email: string;
    fullName: string | null;
    profileDetail: string | null;
}

interface ProjectType {
    id: number;
    title: string;
    status: string;
}

interface ApplicationType {
    id: number;
    status: string;
    appliedDate: string;
    cvLink: string | null;
    freelancerId: number;
    freelancer: UserType;
    projectId: number;
    project: ProjectType;
}

interface ApplicationManagerProps {
    initialApplications: ApplicationType[];
    currentUserRole: string;
}

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function ApplicationManager({ initialApplications, currentUserRole }: ApplicationManagerProps) {
    const [applications, setApplications] = useState<ApplicationType[]>(initialApplications);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<FilterStatus>('ALL');

    // Xác thực vai trò Doanh nghiệp để quản lý giao diện hiển thị
    const isCompany = currentUserRole === 'DOANH_NGHIEP';

    const handleStatusUpdate = async (applicationId: number, action: 'APPROVE' | 'REJECT') => {
        if (!isCompany) {
            alert("❌ Lỗi phân quyền: Chỉ tài khoản Doanh nghiệp mới có quyền thực hiện thao tác này!");
            return;
        }

        const confirmMsg = action === 'APPROVE'
            ? "Bạn có chắc chắn muốn DUYỆT ứng viên này?\nHành động này sẽ tự động ĐÓNG CỔNG nhận đơn và TỪ CHỐI các ứng viên còn lại."
            : "Bạn có chắc chắn muốn TỪ CHỐI ứng viên này?";

        if (!confirm(confirmMsg)) return;

        setProcessingId(applicationId);
        try {
            const response = await fetch('/api/applications/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId, action }),
            });
            const result = await response.json();

            if (response.ok) {
                alert(`🎉 Thành công: ${result.message}`);

                if (action === 'APPROVE') {
                    const targetApp = applications.find(a => a.id === applicationId);
                    const targetProjectId = targetApp?.projectId;

                    setApplications((prevApps) =>
                        prevApps.map((app) => {
                            if (app.id === applicationId) {
                                return { ...app, status: 'APPROVED', project: { ...app.project, status: 'PROCESSING' } };
                            } else if (targetProjectId && app.projectId === targetProjectId && app.status === 'PENDING') {
                                return { ...app, status: 'REJECTED', project: { ...app.project, status: 'PROCESSING' } };
                            }
                            return app;
                        })
                    );
                } else {
                    setApplications((prevApps) =>
                        prevApps.map((app) => app.id === applicationId ? { ...app, status: 'REJECTED' } : app)
                    );
                }
            } else {
                alert(`❌ Thao tác thất bại: ${result.error}`);
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            alert("❌ Không thể kết nối tới hệ thống máy chủ Backend.");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredApplications = useMemo(() => {
        if (filter === 'ALL') return applications;
        return applications.filter((app) => app.status === filter);
    }, [applications, filter]);

    const filterTabs: { key: FilterStatus; label: string }[] = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING', label: 'Chờ duyệt' },
        { key: 'APPROVED', label: 'Chấp nhận' },
        { key: 'REJECTED', label: 'Từ chối' },
    ];

    const getInitial = (name: string | null) => (name ? name.trim().charAt(0).toUpperCase() : '?');

    return (
        <div className="text-[#202124]">
            {/* Thanh tiêu đề + bộ lọc */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
                <div>
                    <h1 className="text-xl font-bold text-[#202124]">Danh sách ứng viên</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Quản lý và xử lý đơn ứng tuyển vào dự án của bạn</p>
                </div>

                <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-fit">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                filter === tab.key
                                    ? "bg-[#1a73e8] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                        📭
                    </div>
                    <p className="text-gray-500 text-sm">
                        {filter === 'ALL'
                            ? "Hiện tại chưa có đơn ứng tuyển nào được nộp vào dự án của bạn."
                            : "Không có đơn nào ở trạng thái này."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredApplications.map((app) => {
                        const isPending = app.status === 'PENDING';
                        const isProjectOpen = app.project.status === 'OPEN';
                        const isProcessing = processingId === app.id;

                        const statusStyle =
                            app.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                            app.status === 'APPROVED' ? "bg-green-50 text-green-700 border-green-200" :
                            "bg-red-50 text-red-700 border-red-200";

                        const statusLabel =
                            app.status === 'PENDING' ? '⏳ Chờ duyệt' :
                            app.status === 'APPROVED' ? '✅ Chấp nhận' : '❌ Từ chối';

                        return (
                            <div
                                key={app.id}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all p-5"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Thông tin ứng viên */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] flex items-center justify-center font-bold text-sm shrink-0">
                                            {getInitial(app.freelancer.fullName)}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-gray-900 text-sm">
                                                    {app.freelancer.fullName || "Ứng viên ẩn danh"}
                                                </span>
                                                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${statusStyle}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{app.freelancer.email}</p>

                                            {app.freelancer.profileDetail && (
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-md">
                                                    {app.freelancer.profileDetail}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className="text-xs font-medium text-[#1a73e8] bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                    #{app.project.id} · {app.project.title}
                                                </span>
                                                <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${
                                                    isProjectOpen ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"
                                                }`}>
                                                    {app.project.status}
                                                </span>
                                                {app.cvLink ? (
                                                    
                                                        <a href={app.cvLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs font-medium text-[#1a73e8] hover:underline inline-flex items-center gap-1"
                                                    >
                                                        📄 Xem CV
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Xem hồ sơ trực tuyến</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút hành động */}
                                    {isCompany && (
                                        <div className="flex gap-2 shrink-0 lg:pl-4 lg:border-l lg:border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusUpdate(app.id, 'APPROVE')}
                                                disabled={!isPending || !isProjectOpen || isProcessing}
                                                className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                            >
                                                {isProcessing ? "..." : "Duyệt nhận"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleStatusUpdate(app.id, 'REJECT')}
                                                disabled={!isPending || !isProjectOpen || isProcessing}
                                                className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-md shadow-sm hover:bg-red-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 disabled:cursor-not-allowed transition-all"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}