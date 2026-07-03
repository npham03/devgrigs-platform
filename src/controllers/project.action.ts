'use server';

import { createProject } from '@/models/project.model';
import { getCurrentUser } from '@/models/auth.model';
import { revalidatePath } from 'next/cache';

// Controller xử lý form đăng dự án (Đây mới là Server Action đúng nghĩa phục vụ mutation từ Client Component / form)
export const submitProjectController = async (formData: FormData) => {
    // 0. Kiểm tra phân quyền: Chỉ ADMIN hoặc DOANH_NGHIEP mới được tạo bài tuyển dụng
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "Vui lòng đăng nhập để thực hiện chức năng này!" };
    }
    if (user.role !== 'DOANH_NGHIEP' && user.role !== 'ADMIN') {
        return { success: false, message: "⚠️ Chỉ có tài khoản Doanh nghiệp hoặc Admin mới có quyền đăng bài tuyển dụng!" };
    }

    // 1. Lấy dữ liệu từ form (formData.get('title'))
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') as string;
    const workType = formData.get('workType') as string;
    const requiredSkills = formData.get('requiredSkills') as string;
    const deadline = formData.get('deadline') as string;
    const companyId = user.id.toString(); // Ưu tiên dùng ID của user đang đăng nhập cho an toàn

    // 2. Validate dữ liệu (Tên dự án không được để trống...)
    if (!title || !description || !budget || !deadline) {
        return { success: false, message: "Vui lòng điền đầy đủ các trường bắt buộc!" };
    }

    // 3. Gọi model createProject() lưu xuống DB (Tự động connect hoặc create skill vào bảng Skill)
    const newProject = await createProject({
        title,
        description,
        budget,
        workType,
        requiredSkills,
        deadline,
        companyId
    });

    // 4. Trả về kết quả thành công/thất bại
    if (newProject) {
        revalidatePath('/projects');
        return { success: true, message: "Đăng dự án thành công!", data: newProject };
    } else {
        return { success: false, message: "Có lỗi xảy ra khi lưu dự án!" };
    }
};
