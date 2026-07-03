import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/models/auth.model';   // 👈 sửa dòng này

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const actingUser = await getCurrentUser();

    if (!actingUser) {
      return NextResponse.json({ error: 'Bạn cần đăng nhập để thực hiện thao tác này.' }, { status: 401 });
    }

    if (actingUser.role !== 'DOANH_NGHIEP') {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, action } = body;

    if (!applicationId || !action) {
      return NextResponse.json({ error: 'Thiếu mã đơn hoặc hành động phê duyệt.' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { project: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Đơn ứng tuyển không tồn tại.' }, { status: 404 });
    }

    if (application.project.companyId !== actingUser.id) {
      return NextResponse.json({ error: 'Bạn không có quyền quản lý đơn ứng tuyển của dự án này.' }, { status: 403 });
    }

    if (application.project.status !== 'OPEN') {
      return NextResponse.json({ error: 'Dự án này đã đóng hoặc đã chọn được ứng viên trước đó.' }, { status: 400 });
    }

    if (action === 'REJECT') {
      const rejectedApp = await prisma.application.update({
        where: { id: parseInt(applicationId) },
        data: { status: 'REJECTED' },
      });
      return NextResponse.json({ message: 'Đã từ chối đơn ứng tuyển của ứng viên này.', data: rejectedApp });
    }

    if (action === 'APPROVE') {
      const result = await prisma.$transaction(async (tx) => {
        const approvedApp = await tx.application.update({
          where: { id: parseInt(applicationId) },
          data: { status: 'APPROVED' },
        });

        await tx.project.update({
          where: { id: application.projectId },
          data: { status: 'PROCESSING' },
        });

        await tx.application.updateMany({
          where: { projectId: application.projectId, id: { not: parseInt(applicationId) }, status: 'PENDING' },
          data: { status: 'REJECTED' },
        });

        return approvedApp;
      });

      return NextResponse.json({
        message: 'Phê duyệt ứng viên thành công! Dự án đã đóng cổng nhận đơn và chuyển sang trạng thái triển khai.',
        data: result,
      });
    }

    return NextResponse.json({ error: 'Hành động duyệt không hợp lệ.' }, { status: 400 });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái ứng tuyển:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi cập nhật cơ sở dữ liệu.' }, { status: 500 });
  }
}