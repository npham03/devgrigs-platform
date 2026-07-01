import db from './db';

// TODO: Viết hàm kiểm tra user đăng nhập
export const getUserByEmail = async (email: string) => {
    try {
        return await db.user.findUnique({
            where: { email },
        });
    } catch (error) {
        console.error("Lỗi khi tìm user theo email:", error);
        return null;
    }
}
