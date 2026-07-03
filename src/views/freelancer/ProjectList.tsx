"use client";

import React, { useState } from 'react';
// Import Link để điều hướng trang trong Next.js
import Link from 'next/link';

interface SkillType {
    id: number;
    name: string;
    category?: string | null;
}

interface ProjectType {
    id: number;
    title: string;
    description: string;
    budget: number;
    workType: string;
    postedDate: Date;
    deadline: Date;
    status: string;
    companyId: number;
    requiredSkills?: SkillType[] | string | string[];
}

export default function ProjectList({ projects, currentRole }: { projects: ProjectType[]; currentRole: string }) {
    // Đưa biến currentRole vào trong Component
    // Giả lập đang là Freelancer

    const [appliedProjectIds, setAppliedProjectIds] = useState<number[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const currentFreelancerId = 3; 

    const handleApply = async (projectId: number) => {
        if (!confirm("Bạn có chắc chắn muốn nộp đơn ứng tuyển vào dự án này?")) return;

        setLoadingId(projectId);
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    freelancerId: currentFreelancerId,
                    projectId: projectId,
                    cvLink: "https://github.com/nguyenvanlaptrinh/cv.pdf"
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`🎉 Chúc mừng: ${result.message}`);
                setAppliedProjectIds((prev) => [...prev, projectId]);
            } else {
                alert(`❌ Lỗi ứng tuyển: ${result.error}`);
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            alert("❌ Không thể kết nối tới máy chủ API Backend.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 text-[#202124]">
            {/* Thanh tiêu đề phía trên */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-3 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-[#202124]">Danh sách dự án</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Nền tảng kết nối nhân sự IT nhóm DEVGRIGS</p>
                </div>
                
                {/* Khu vực chứa các nút chức năng điều hướng hệ thống */}
                <div className="flex items-center gap-3">
                    
                    {/* SỬA TẠI ĐÂY: Bọc thẻ Link trong điều kiện. Nút này sẽ biến mất khi currentRole là FREELANCER */}
                    {currentRole === "DOANH_NGHIEP" && (
                        <Link 
                            href="/company/manage" 
                            className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            💼 Trang quản lý đơn (Doanh nghiệp)
                        </Link>
                    )}

                    <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded shrink-0">
                        {projects?.length || 0} dự án
                    </span>
                </div>
            </div>

            {(!projects || projects.length === 0) ? (
                <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-600 text-sm">Chưa có dự án nào được đăng. Hãy quay lại sau nhé!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => {
                        const skills = Array.isArray(project.requiredSkills)
                            ? project.requiredSkills.map((s: SkillType | string) => typeof s === 'string' ? s : s.name)
                            : typeof project.requiredSkills === 'string'
                                ? project.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];

                        const isProjectOpen = project.status === "OPEN";
                        const hasAlreadyApplied = appliedProjectIds.includes(project.id);

                        return (
                            <div key={project.id || idx} className="bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors p-5 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h2 className="text-base font-bold text-[#1a73e8] hover:underline line-clamp-2">{project.title || "Tên dự án"}</h2>
                                        <span className={`px-2 py-0.5 text-[11px] font-medium border rounded shrink-0 ${
                                            isProjectOpen 
                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                            {project.status || "OPEN"}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed font-normal">
                                        {project.description || "Mô tả chi tiết dự án..."}
                                    </p>
                                    
                                    {skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {skills.map((skillName: string, sIdx: number) => (
                                                <span key={sIdx} className="px-2 py-0.5 text-[11px] font-normal bg-gray-100 text-gray-700 rounded border border-gray-200">
                                                    {skillName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-[#202124]">
                                            {project.budget ? `${Number(project.budget).toLocaleString('vi-VN')} VNĐ` : "Thỏa thuận"}
                                        </span>
                                        <span className="text-gray-600 font-medium px-2 py-0.5 bg-gray-50 border border-gray-200 rounded">
                                            {project.workType || "Remote"}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleApply(project.id)}
                                        disabled={!isProjectOpen || hasAlreadyApplied || loadingId === project.id}
                                        className={`w-full py-2 text-xs font-semibold rounded text-center transition-all ${
                                            hasAlreadyApplied
                                                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                : !isProjectOpen
                                                    ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed"
                                                    : "bg-[#1a73e8] text-white hover:bg-[#1557b0] active:scale-[0.98]"
                                        }`}
                                    >
                                        {loadingId === project.id ? "Đang xử lý..." : 
                                         hasAlreadyApplied ? "✓ Đã nộp đơn" : 
                                         isProjectOpen ? "Ứng tuyển dự án" : "Đã đóng cổng nhận đơn"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}