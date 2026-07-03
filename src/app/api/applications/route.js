import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/models/auth.model';   // 👈 sửa dòng này

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Bạn cần đăng nhập để ứng tuyển.' }, { status: 401 });
    }

    if (currentUser.role !== 'FREELANCER') {
      return NextResponse.json({ error: 'Chỉ tài khoản Freelancer mới được ứng tuyển dự án.' }, { status: 403 });
    }

    const body = await request.json();
    const { projectId, cvLink } = body;
    const freelancerId = currentUser.id;

    if (!projectId) {
      return NextResponse.json({ error: 'Thiếu thông tin Dự án/Module.' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: parseInt(projectId) } });

    if (!project) {
      return NextResponse.json({ error: 'Dự án không tồn tại.' }, { status: 404 });
    }

    if (project.status !== 'OPEN') {
      return NextResponse.json({ error: 'Ứng tuyển thất bại! Dự án/Module này đã đóng cổng tuyển dụng.' }, { status: 400 });
    }

    const existingApplication = await prisma.application.findFirst({
      where: { freelancerId, projectId: parseInt(projectId), status: { not: 'CANCELLED' } },
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Bạn đã nộp đơn ứng tuyển vào dự án này trước đó rồi.' }, { status: 400 });
    }

    const newApplication = await prisma.application.create({
      data: {
        freelancerId,
        projectId: parseInt(projectId),
        cvLink: cvLink || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'Nộp đơn ứng tuyển thành công!', data: newApplication }, { status: 201 });

  } catch (error) {
    console.error('Lỗi khi ứng tuyển dự án:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống cơ sở dữ liệu.' }, { status: 500 });
  }
}