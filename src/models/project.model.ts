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
                },
                requiredSkills: {
                    select: {
                        id: true,
                        name: true,
                        category: true
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
    // Xử lý danh sách kỹ năng: Hỗ trợ cả mảng chuỗi hoặc chuỗi phân cách bởi dấu phẩy
    const skillsArray: string[] = Array.isArray(data.requiredSkills)
        ? data.requiredSkills
        : typeof data.requiredSkills === 'string'
            ? data.requiredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : [];

    try {
        return await db.project.create({
            data: {
                title: data.title,
                description: data.description,
                budget: Number(data.budget),
                workType: data.workType || "Remote",
                requiredSkills: {
                    connectOrCreate: skillsArray.map((skillName: string) => ({
                        where: { name: skillName },
                        create: { name: skillName }
                    }))
                },
                deadline: new Date(data.deadline),
                companyId: Number(data.companyId),
                status: "OPEN"
            },
            include: {
                requiredSkills: true
            }
        });
    } catch (error) {
        console.error("Lỗi khi tạo dự án:", error);
        return null;
    }
}
