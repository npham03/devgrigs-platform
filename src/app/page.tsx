import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/models/auth.model";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="bg-white text-[#202124] flex flex-col justify-between">
      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center flex-1">
        <div className="inline-block px-3 py-1 mb-6 rounded bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium tracking-wide">
          Nền tảng Kết nối Lập trình viên & Doanh nghiệp
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl mb-6 text-[#202124]">
          Kết nối Nhân tài Công nghệ & Cơ hội Nghề nghiệp
        </h1>

        <p className="text-base md:text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed font-normal">
          DevGrigs Platform được xây dựng trên kiến trúc MVC với Next.js 16 và SQL Server, giúp doanh nghiệp và lập trình viên hợp tác minh bạch, tối ưu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md">
          <Link
            href="/projects"
            className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded text-sm transition-colors text-center shadow-sm"
          >
            Khám phá Dự án
          </Link>

          {user ? (
            user.role === 'DOANH_NGHIEP' || user.role === 'ADMIN' ? (
              <Link
                href="/projects/new"
                className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#202124] font-medium rounded text-sm transition-colors text-center"
              >
                Đăng vị trí tuyển dụng
              </Link>
            ) : (
              <Link
                href="/projects"
                className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#202124] font-medium rounded text-sm transition-colors text-center"
              >
                Hồ sơ cá nhân
              </Link>
            )
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-[#202124] font-medium rounded text-sm transition-colors text-center"
            >
              Đăng nhập vào hệ thống
            </Link>
          )}
        </div>

        {/* 3 Role Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-20 text-left">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <h3 className="text-base font-bold mb-2 text-[#202124]">Doanh nghiệp</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Đăng bài tuyển dụng, xác định danh sách kỹ năng yêu cầu, thiết lập ngân sách và tiếp nhận hồ sơ ứng viên.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <h3 className="text-base font-bold mb-2 text-[#202124]">Lập trình viên</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tìm kiếm các dự án phù hợp với năng lực kỹ thuật, nộp hồ sơ ứng tuyển và cập nhật tiến độ công việc định kỳ.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            <h3 className="text-base font-bold mb-2 text-[#202124]">Quản trị viên</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Giám sát chất lượng dự án, phân quyền người dùng và đảm bảo hệ thống vận hành ổn định, minh bạch.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
