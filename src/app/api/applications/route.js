import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// UC4: Luồng xử lý Freelancer nộp đơn ứng tuyển
export async function POST(request) {
  try {
    const body = await request.json();
    const { freelancerId, projectId, cvLink } = body;

    // 1. Kiểm tra thông tin bắt buộc đầu vào
    if (!freelancerId || !projectId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin Freelancer hoặc Dự án/Module.' },
        { status: 400 }
      );
    }

    // 2. Kiểm tra trạng thái hoạt động của Dự án (Model Project)
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return NextResponse.json({ error: 'Dự án không tồn tại.' }, { status: 404 });
    }

    // Validate: Chặn không cho ứng tuyển khi module/dự án đã đóng
    if (project.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Ứng tuyển thất bại! Dự án/Module này đã đóng cổng tuyển dụng.' },
        { status: 400 }
      );
    }

    // 3. Validate: Kiểm tra ứng tuyển trùng lặp (Model Application)
    const existingApplication = await prisma.application.findFirst({
      where: {
        freelancerId: parseInt(freelancerId),
        projectId: parseInt(projectId),
        status: { not: 'CANCELLED' } // Chặn nếu đơn cũ vẫn đang chờ duyệt, đã duyệt hoặc bị từ chối
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Bạn đã nộp đơn ứng tuyển vào dự án này trước đó rồi.' },
        { status: 400 }
      );
    }

    // 4. Hợp lệ -> Tiến hành tạo đơn ứng tuyển mới (Mặc định status là PENDING)
    const newApplication = await prisma.application.create({
      data: {
        freelancerId: parseInt(freelancerId),
        projectId: parseInt(projectId),
        cvLink: cvLink || null,
        status: 'PENDING', // Trạng thái Chờ duyệt mặc định trong schema
      },
    });

    return NextResponse.json(
      { message: 'Nộp đơn ứng tuyển thành công!', data: newApplication },
      { status: 201 }
    );

  } catch (error) {
    console.error('Lỗi khi ứng tuyển dự án:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống cơ sở dữ liệu.' }, { status: 500 });
  }
}