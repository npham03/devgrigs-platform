'use server' // Bắt buộc phải có dòng này ở đầu file Controller

import { getAllProjects, createProject } from '@/models/project.model';

// TODO: Controller xử lý khi user bấm nút "Xem dự án"
export const fetchProjectsController = async () => {
    // 1. Check quyền (nếu cần)
    // 2. Gọi model lấy data
    const projects = await getAllProjects();
    // 3. Trả về cho View
    return projects;
}

// TODO: Controller xử lý form đăng dự án
export const submitProjectController = async (formData: FormData) => {
    // 1. Lấy dữ liệu từ form (formData.get('title'))
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') as string;
    const workType = formData.get('workType') as string;
    const requiredSkills = formData.get('requiredSkills') as string;
    const deadline = formData.get('deadline') as string;
    const companyId = formData.get('companyId') as string;

    // 2. Validate dữ liệu (Tên dự án không được để trống...)
    if (!title || !description || !budget || !deadline || !companyId) {
        return { success: false, message: "Vui lòng điền đầy đủ các trường bắt buộc!" };
    }

    // 3. Gọi model createProject() lưu xuống DB
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
        return { success: true, message: "Đăng dự án thành công!", data: newProject };
    } else {
        return { success: false, message: "Có lỗi xảy ra khi lưu dự án!" };
    }
}
