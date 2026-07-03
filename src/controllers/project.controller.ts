import { getAllProjects } from '@/models/project.model';

// Controller xử lý khi user bấm nút "Xem dự án"
// Lưu ý: Hàm này được gọi trực tiếp trong React Server Component (projects/page.tsx).
// Trong Next.js App Router, mọi thứ trong Server Component đã chạy trên server mặc định.
// KHÔNG DÙNG 'use server' ở đây vì 'use server' biến hàm thành một public Server Action POST endpoint (dành cho form mutation từ client),
// việc dùng sai 'use server' cho các hàm get/query dữ liệu sẽ gây dư thừa RPC endpoint và lỗi serializability.
export const fetchProjectsController = async () => {
    // 1. Check quyền (nếu cần)
    // 2. Gọi model lấy data
    const projects = await getAllProjects();
    // 3. Trả về cho View
    return projects;
};
