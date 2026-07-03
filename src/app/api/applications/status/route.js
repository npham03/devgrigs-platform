import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Xử lý Doanh nghiệp Duyệt hoặc Từ chối đơn ứng tuyển (Yêu cầu 39)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { applicationId, action } = body; // action: 'APPROVE' hoặc 'REJECT'

    if (!applicationId || !action) {
      return NextResponse.json({ error: 'Thiếu mã đơn hoặc hành động phê duyệt.' }, { status: 400 });
    }

    // Tìm đơn ứng tuyển kèm thông tin dự án để check logic
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { project: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Đơn ứng tuyển không tồn tại.' }, { status: 404 });
    }

    // Nếu dự án đã đóng/đang thực hiện thì không cho duyệt nữa
    if (application.project.status !== 'OPEN') {
      return NextResponse.json({ error: 'Dự án này đã đóng hoặc đã chọn được ứng viên trước đó.' }, { status: 400 });
    }

    // Trường hợp 1: Từ chối đơn ứng tuyển (REJECT)
    if (action === 'REJECT') {
      const rejectedApp = await prisma.application.update({
        where: { id: parseInt(applicationId) },
        data: { status: 'REJECTED' }
      });
      return NextResponse.json({ message: 'Đã từ chối đơn ứng tuyển của ứng viên này.', data: rejectedApp });
    }

    // Trường hợp 2: Chấp nhận đơn ứng tuyển (APPROVE) -> Kịch bản đồng bộ trạng thái hệ thống
    if (action === 'APPROVE') {
      const result = await prisma.$transaction(async (tx) => {
        
        // a. Cập nhật trạng thái đơn được chọn thành APPROVED
        const approvedApp = await tx.application.update({
          where: { id: parseInt(applicationId) },
          data: { status: 'APPROVED' }
        });

        // b. Tự động chuyển trạng thái Dự án từ OPEN sang PROCESSING (Đang thực hiện)
        await tx.project.update({
          where: { id: application.projectId },
          data: { status: 'PROCESSING' }
        });

        // c. Tự động Từ chối các ứng viên khác đang "Chờ duyệt" của riêng dự án này
        await tx.application.updateMany({
          where: {
            projectId: application.projectId,
            id: { not: parseInt(applicationId) },
            status: 'PENDING'
          },
          data: { status: 'REJECTED' }
        });

        return approvedApp;
      });

      return NextResponse.json({ 
        message: 'Phê duyệt ứng viên thành công! Dự án đã đóng cổng nhận đơn và chuyển sang trạng thái triển khai.', 
        data: result 
      });
    }

    return NextResponse.json({ error: 'Hành động duyệt không hợp lệ.' }, { status: 400 });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái ứng tuyển:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi cập nhật cơ sở dữ liệu.' }, { status: 500 });
  }
}