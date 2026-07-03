import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { donUngTuyenId, hoanThanh, baoCao, linkSanPham } = body;

    // 1. Kiểm tra dữ liệu đầu vào bắt buộc
    if (!donUngTuyenId || hoanThanh === undefined || !baoCao) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (Mã đơn, % hoàn thành hoặc nội dung báo cáo).' },
        { status: 400 }
      );
    }

    // 2. Kiểm tra tính hợp lệ logic của số phần trăm (Alternative Flow: Nhập sai định dạng)
    const phanTram = parseInt(hoanThanh);
    if (isNaN(phanTram) || phanTram < 0 || phanTram > 100) {
      return NextResponse.json(
        { error: 'Số phần trăm không hợp lệ! Vui lòng nhập từ 0 đến 100.' },
        { status: 400 }
      );
    }

    // 3. Truy vấn SQL Server qua Prisma: Lưu thông tin tiến độ mới vào lịch sử dự án
    const tienDoMoi = await prisma.tienDoCongViec.create({
      data: {
        donUngTuyenId: parseInt(donUngTuyenId),
        hoanThanh: phanTram,
        baoCao: baoCao,
        linkSanPham: linkSanPham || '',
        thoiGianCapNhat: new Date(), // Tự động lấy thời gian hiện tại
      },
    });

    // 4. (Mở rộng sau này) Gửi thông báo cho Doanh nghiệp sở hữu dự án tại đây...

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