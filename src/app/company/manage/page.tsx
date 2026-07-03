import { PrismaClient } from '@prisma/client';
import ApplicationManager from '@/views/company/ApplicationManager'; 

const prisma = new PrismaClient();

export default async function ManageApplicationsPage() {
    // 🚧 GIẢ LẬP AUTHENTICATION: Lấy thông tin tài khoản đang đăng nhập
    // Để test chức năng chặn: Bạn hãy thử sửa 'DOANH_NGHIEP' thành 'FREELANCER' nhé!
    const loggedInUser = {
        id: 2,               // ID đối tác Doanh nghiệp TechCorp trong file Seed
        role: 'DOANH_NGHIEP' // Các quyền hợp lệ: ADMIN, FREELANCER, DOANH_NGHIEP
    };

    // 1. KIỂM TRA QUYỀN TRUY CẬP (AUTHORIZATION) - CHẶN LUỒNG SAI ROLE
    if (loggedInUser.role !== 'DOANH_NGHIEP') {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="p-8 bg-white rounded border border-red-200 text-center max-w-md shadow-sm">
                    <h1 className="text-4xl mb-4">⛔</h1>
                    <h2 className="text-lg font-bold text-red-600 mb-2">Quyền truy cập bị từ chối (403)</h2>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Tài khoản của bạn không có quyền xem trang này. Giao diện quản lý ứng viên chỉ dành riêng cho vai trò **Doanh nghiệp**.
                    </p>
                </div>
            </main>
        );
    }

    // 2. LUỒNG CHÍNH: Truy vấn danh sách đơn ứng tuyển của các dự án thuộc doanh nghiệp này
    const applications = await prisma.application.findMany({
        where: {
            project: {
                companyId: loggedInUser.id
            }
        },
        include: {
            freelancer: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    profileDetail: true
                }
            },
            project: {
                select: {
                    id: true,
                    title: true,
                    status: true
                }
            }
        },
        orderBy: {
            appliedDate: 'desc'
        }
    });

    // Chuẩn hóa Date thành String để tránh lỗi dữ liệu khi truyền từ Server Component sang Client Component
    const serializedApplications = applications.map(app => ({
        ...app,
        appliedDate: app.appliedDate.toISOString()
    }));

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <ApplicationManager 
                initialApplications={serializedApplications} 
                currentUserRole={loggedInUser.role} 
            />
        </main>
    );
}