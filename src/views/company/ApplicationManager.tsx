"use client";

import React, { useState } from 'react';

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

export default function ApplicationManager({ initialApplications, currentUserRole }: ApplicationManagerProps) {
    const [applications, setApplications] = useState<ApplicationType[]>(initialApplications);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Xác thực vai trò Doanh nghiệp để quản lý giao diện hiển thị
    const isCompany = currentUserRole === 'DOANH_NGHIEP';

    const handleStatusUpdate = async (applicationId: number, action: 'APPROVE' | 'REJECT') => {
        // Bảo vệ Lớp 2: Ngăn chặn tuyệt đối nếu cố tình gọi hàm khi sai Role
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId, action }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`🎉 Thành công: ${result.message}`);
                
                if (action === 'APPROVE') {
                    // Cập nhật lại State cục bộ trên giao diện sau khi duyệt đơn thành công
                    setApplications((prevApps) =>
                        prevApps.map((app) => {
                            if (app.id === applicationId) {
                                return { ...app, status: 'APPROVED', project: { ...app.project, status: 'PROCESSING' } };
                            } else if (app.projectId === app.projectId && app.status === 'PENDING') {
                                return { ...app, status: 'REJECTED', project: { ...app.project, status: 'PROCESSING' } };
                            }
                            return app;
                        })
                    );
                } else {
                    // Nếu là hành động từ chối đơn ứng tuyển
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

    return (
        <div className="max-w-6xl mx-auto p-6 text-[#202124]">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-[#202124]">Quản lý đơn ứng tuyển</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Phân hệ dành riêng cho đối tác Doanh nghiệp nhóm DEVGRIGS</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full">
                    {applications.filter(a => a.status === 'PENDING').length} đơn đang chờ
                </span>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-500 text-sm">Hiện tại chưa có đơn ứng tuyển nào được nộp vào dự án của bạn.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded border border-gray-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs font-semibold">
                                <th className="p-4">Ứng viên / Dự án</th>
                                <th className="p-4">Thông tin liên hệ / CV</th>
                                <th className="p-4">Trạng thái Đơn</th>
                                <th className="p-4">Trạng thái Dự án</th>
                                {/* ẨN TIÊU ĐỀ CỘT NẾU KHÔNG PHẢI DOANH NGHIỆP */}
                                {isCompany && <th className="p-4 text-center">Hành động</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {applications.map((app) => {
                                const isPending = app.status === 'PENDING';
                                const isProjectOpen = app.project.status === 'OPEN';
                                const isProcessing = processingId === app.id;

                                return (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{app.freelancer.fullName || "Ứng viên ẩn danh"}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 max-w-xs line-clamp-1">{app.freelancer.profileDetail}</div>
                                            <div className="text-xs font-medium text-[#1a73e8] mt-2 bg-blue-50/50 px-2 py-1 rounded border border-blue-100 inline-block">
                                                Mã dự án #{app.project.id}: {app.project.title}
                                            </div>
                                        </td>

                                        <td className="p-4 text-xs">
                                            <div className="text-gray-600 mb-1">{app.freelancer.email}</div>
                                            {app.cvLink ? (
                                                <a href={app.cvLink} target="_blank" rel="noreferrer" className="text-[#1a73e8] font-medium hover:underline inline-flex items-center gap-1">
                                                    📄 Xem CV đính kèm
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic">Xem hồ sơ trực tuyến</span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                                                app.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                app.status === 'APPROVED' ? "bg-green-50 text-green-700 border-green-200" :
                                                "bg-red-50 text-red-700 border-red-200"
                                            }`}>
                                                {app.status === 'PENDING' ? '⏳ Chờ duyệt' :
                                                 app.status === 'APPROVED' ? '✅ Chấp nhận' : '❌ Từ chối'}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
                                                isProjectOpen ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"
                                            }`}>
                                                {app.project.status}
                                            </span>
                                        </td>

                                        {/* CHỈ HIỂN THỊ CỘT NÚT BẤM DUYỆT ĐƠN NẾU ĐÚNG ROLE DOANH NGHIỆP */}
                                        {isCompany && (
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(app.id, 'APPROVE')}
                                                        disabled={!isPending || !isProjectOpen || isProcessing}
                                                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        {isProcessing ? "..." : "Duyệt nhận"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(app.id, 'REJECT')}
                                                        disabled={!isPending || !isProjectOpen || isProcessing}
                                                        className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded shadow-sm hover:bg-red-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}