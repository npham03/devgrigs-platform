import React from 'react';

// Component giao diện danh sách dự án tối giản phong cách Google
export default function ProjectList({ projects }: { projects: any[] }) {
    return (
        <div className="max-w-5xl mx-auto p-6 text-[#202124]">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-[#202124]">Danh sách dự án</h1>
                <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded">
                    {projects?.length || 0} dự án
                </span>
            </div>

            {(!projects || projects.length === 0) ? (
                <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-600 text-sm">Chưa có dự án nào được đăng. Hãy quay lại sau nhé!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => {
                        const skills = Array.isArray(project.requiredSkills)
                            ? project.requiredSkills.map((s: any) => typeof s === 'string' ? s : s.name)
                            : typeof project.requiredSkills === 'string'
                                ? project.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];

                        return (
                            <div key={project.id || idx} className="bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors p-5 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h2 className="text-base font-bold text-[#1a73e8] hover:underline line-clamp-2">{project.title || "Tên dự án"}</h2>
                                        <span className="px-2 py-0.5 text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 rounded shrink-0">
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
                                <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-xs">
                                    <span className="font-bold text-[#202124]">
                                        {project.budget ? `${Number(project.budget).toLocaleString('vi-VN')} VNĐ` : "Thỏa thuận"}
                                    </span>
                                    <span className="text-gray-600 font-medium px-2 py-0.5 bg-gray-50 border border-gray-200 rounded">
                                        {project.workType || "Remote"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
