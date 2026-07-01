import db from './db';

// TODO: Viết hàm lấy danh sách dự án cho Freelancer xem
export const getAllProjects = async () => {
    // Code Prisma query ở đây (VD: return await db.project.findMany())
    try {
        return await db.project.findMany({
            orderBy: { postedDate: 'desc' },
            include: {
                company: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách dự án:", error);
        return [];
    }
}

// TODO: Viết hàm lưu dự án mới do Doanh nghiệp đăng
export const createProject = async (data: any) => {
    // Code Prisma insert ở đây
    try {
        return await db.project.create({
            data: {
                title: data.title,
                description: data.description,
                budget: Number(data.budget),
                workType: data.workType || "Remote",
                requiredSkills: data.requiredSkills || "",
                deadline: new Date(data.deadline),
                companyId: Number(data.companyId),
                status: "OPEN"
            }
        });
    } catch (error) {
        console.error("Lỗi khi tạo dự án:", error);
        return null;
    }
}
