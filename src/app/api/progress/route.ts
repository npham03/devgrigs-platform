import { NextRequest, NextResponse } from 'next/server';
import db from '@/models/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donUngTuyenId, hoanThanh, baoCao, linkSanPham, applicationId, completionPercent, reportContent, productLink } = body;

    const targetAppId = donUngTuyenId ?? applicationId;
    const targetPercent = hoanThanh ?? completionPercent;
    const targetReport = baoCao ?? reportContent;
    const targetLink = linkSanPham ?? productLink ?? '';

    // 1. Kiểm tra dữ liệu đầu vào bắt buộc
    if (!targetAppId || targetPercent === undefined || !targetReport) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (Mã đơn, % hoàn thành hoặc nội dung báo cáo).' },
        { status: 400 }
      );
    }

    // 2. Kiểm tra tính hợp lệ logic của số phần trăm
    const phanTram = parseInt(targetPercent);
    if (isNaN(phanTram) || phanTram < 0 || phanTram > 100) {
      return NextResponse.json(
        { error: 'Số phần trăm không hợp lệ! Vui lòng nhập từ 0 đến 100.' },
        { status: 400 }
      );
    }

    // 3. Truy vấn SQL Server qua Prisma: Lưu thông tin tiến độ mới vào bảng WorkProgress
    const tienDoMoi = await db.workProgress.create({
      data: {
        applicationId: parseInt(targetAppId),
        completionPercent: phanTram,
        reportContent: targetReport,
        productLink: targetLink || null,
        updatedAt: new Date(),
      },
    });

    // Trả về kết quả thành công cho Client
    return NextResponse.json(
      { message: 'Cập nhật tiến độ công việc thành công!', data: tienDoMoi },
      { status: 201 }
    );

  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi kết nối hoặc truy vấn Cơ sở dữ liệu.' },
      { status: 500 }
    );
  }
}