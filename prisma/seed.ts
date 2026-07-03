import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu (Seed Data)...');

  // 1. Dọn dẹp dữ liệu cũ (Xóa theo thứ tự để tránh lỗi khóa ngoại)
  console.log('🧹 Đang dọn dẹp dữ liệu cũ...');
  await prisma.workProgress.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Tạo danh sách kỹ năng cơ bản
  console.log('🛠️ Đang tạo danh sách Kỹ năng (Skills)...');
  const skillsData = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'JavaScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'SQL Server', category: 'Database' },
    { name: 'Prisma ORM', category: 'Database' },
    { name: 'Tailwind CSS', category: 'UI/UX' },
    { name: 'Docker', category: 'DevOps' },
  ];

  const createdSkills: Record<string, any> = {};
  for (const skill of skillsData) {
    createdSkills[skill.name] = await prisma.skill.create({ data: skill });
  }

  // 3. Tạo 3 tài khoản cho 3 Role chính
  console.log('👥 Đang tạo 3 tài khoản cơ bản cho 3 Role...');

  // 3.1 Role ADMIN: Quản trị viên hệ thống
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@devgrigs.com',
      password: '123456', // Mật khẩu demo đơn giản cho tất cả tài khoản
      role: 'ADMIN',
      status: 'ACTIVE',
      fullName: 'Quản trị viên DevGrigs',
      profileDetail: 'Tài khoản Quản trị cao nhất của hệ thống DevGrigs Platform.',
    },
  });

  // 3.2 Role DOANH_NGHIEP: Công ty tuyển dụng
  const companyUser = await prisma.user.create({
    data: {
      email: 'hr@techcorp.vn',
      password: '123456',
      role: 'DOANH_NGHIEP',
      status: 'ACTIVE',
      fullName: 'Công ty Cổ phần Công nghệ TechCorp',
      profileDetail: 'TechCorp là đối tác tin cậy chuyên cung cấp các giải pháp phần mềm, chuyển đổi số và phát triển nền tảng Cloud tại Việt Nam.',
      portfolioLink: 'https://techcorp.vn',
    },
  });

  // 3.3 Role FREELANCER: Lập trình viên
  const freelancerUser = await prisma.user.create({
    data: {
      email: 'freelancer@devgrigs.com',
      password: '123456',
      role: 'FREELANCER',
      status: 'ACTIVE',
      fullName: 'Nguyễn Văn Lập Trình',
      profileDetail: 'Senior Fullstack Developer với hơn 5 năm kinh nghiệm thực tế. Chuyên thiết kế kiến trúc web hiệu năng cao với Next.js, Node.js và SQL Server.',
      portfolioLink: 'https://github.com/nguyenvanlaptrinh',
      skills: {
        connect: [
          { name: 'Next.js' },
          { name: 'React' },
          { name: 'TypeScript' },
          { name: 'Node.js' },
          { name: 'SQL Server' },
          { name: 'Prisma ORM' },
        ],
      },
    },
  });

  console.log('✅ Đã tạo thành công 3 tài khoản:');
  console.log(`   👑 ADMIN:        ${adminUser.email} / 123456`);
  console.log(`   🏢 DOANH NGHIEP: ${companyUser.email} / 123456`);
  console.log(`   💻 FREELANCER:   ${freelancerUser.email} / 123456`);

  // 4. Tạo các bài đăng tuyển dụng (Project) mẫu cho Doanh nghiệp
  console.log('💼 Đang tạo các dự án tuyển dụng mẫu...');
  const project1 = await prisma.project.create({
    data: {
      title: 'Tuyển Senior Fullstack Developer (Next.js 16 + Prisma + SQL Server)',
      description: 'Chúng tôi cần tìm 01 lập trình viên Fullstack có kinh nghiệm vững vàng về Next.js App Router, Server Actions và thao tác cơ sở dữ liệu với Prisma & SQL Server để phát triển hệ thống quản lý nền tảng kết nối nhân sự.',
      budget: 25000000, // 25 triệu VNĐ
      workType: 'Remote',
      deadline: new Date('2026-08-30'),
      status: 'OPEN',
      companyId: companyUser.id,
      requiredSkills: {
        connect: [
          { name: 'Next.js' },
          { name: 'TypeScript' },
          { name: 'Prisma ORM' },
          { name: 'SQL Server' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Thiết kế & Xây dựng trang Landing Page phong cách Modern UI với Tailwind CSS',
      description: 'Tìm kiếm Frontend Developer sáng tạo, am hiểu sâu về giao diện hiện đại, animation mượt mà, dark/light mode hoàn chỉnh và tối ưu hóa SEO cho sản phẩm AI sắp ra mắt.',
      budget: 12000000, // 12 triệu VNĐ
      workType: 'Hybrid',
      deadline: new Date('2026-07-25'),
      status: 'OPEN',
      companyId: companyUser.id,
      requiredSkills: {
        connect: [
          { name: 'React' },
          { name: 'Tailwind CSS' },
          { name: 'JavaScript' },
        ],
      },
    },
  });

  console.log(`✅ Đã tạo 2 bài tuyển dụng mẫu: "${project1.title}" và "${project2.title}"`);
  console.log('🎉 Hoàn tất quá trình Seed Data!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi chạy seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
