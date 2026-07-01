import React from 'react';

// TODO: Đứa nào làm UI thì vào đây code giao diện danh sách dự án
export default function ProjectList({ projects }: { projects: any[] }) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Danh sách dự án</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {projects?.length || 0} dự án
                </span>
            </div>
            {/* Map cái mảng projects ra thành các thẻ <div> */}
            {(!projects || projects.length === 0) ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Chưa có dự án nào được đăng. Hãy quay lại sau nhé!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => (
                        <div key={project.id || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">{project.title || "Tên dự án"}</h2>
                                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full shrink-0 dark:bg-green-900 dark:text-green-200">
                                        {project.status || "OPEN"}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                    {project.description || "Mô tả chi tiết dự án..."}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2 flex items-center justify-between text-sm">
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {project.budget ? `${Number(project.budget).toLocaleString('vi-VN')} VNĐ` : "Thỏa thuận"}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                    {project.workType || "Remote"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
