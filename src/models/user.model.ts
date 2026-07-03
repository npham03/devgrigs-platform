import db from './db';

// Hàm kiểm tra/tìm user theo email (Phục vụ đăng nhập)
export const getUserByEmail = async (email: string) => {
    try {
        return await db.user.findUnique({
            where: { email },
            include: {
                skills: true
            }
        });
    } catch (error) {
        console.error("Lỗi khi tìm user theo email:", error);
        return null;
    }
}

// Hàm tìm user theo ID (Phục vụ phân quyền và kiểm tra session)
export const getUserById = async (id: number) => {
    try {
        return await db.user.findUnique({
            where: { id },
            include: {
                skills: true
            }
        });
    } catch (error) {
        console.error("Lỗi khi tìm user theo ID:", error);
        return null;
    }
}
