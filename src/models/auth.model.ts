import { cookies } from 'next/headers';

export interface CurrentUser {
    id: number;
    email: string;
    role: 'ADMIN' | 'DOANH_NGHIEP' | 'FREELANCER' | string;
    fullName: string;
}

// Hàm hỗ trợ đọc thông tin user đang đăng nhập từ Cookie (Dùng cho Server Components & Controllers)
export const getCurrentUser = async (): Promise<CurrentUser | null> => {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('current_user');
        if (!userCookie || !userCookie.value) {
            return null;
        }
        return JSON.parse(userCookie.value) as CurrentUser;
    } catch (error) {
        console.error("Lỗi khi đọc session cookie:", error);
        return null;
    }
};
