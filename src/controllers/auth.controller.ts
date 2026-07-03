'use server';

import { cookies } from 'next/headers';
import { getUserByEmail } from '@/models/user.model';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CurrentUser } from '@/models/auth.model';

// Server Action xử lý Đăng nhập từ Form
export const loginController = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: "Vui lòng nhập đầy đủ Email và Mật khẩu!" };
    }

    // 1. Tìm user trong DB theo email
    const user = await getUserByEmail(email);
    if (!user) {
        return { success: false, message: "Tài khoản không tồn tại trong hệ thống!" };
    }

    // 2. Kiểm tra mật khẩu (Demo cơ bản: kiểm tra trực tiếp string)
    if (user.password !== password) {
        return { success: false, message: "Mật khẩu không chính xác!" };
    }

    // 3. Tạo session cookie lưu thông tin cơ bản để phân quyền
    const sessionData: CurrentUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName || user.email,
    };

    const cookieStore = await cookies();
    cookieStore.set('current_user', JSON.stringify(sessionData), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // Lưu 7 ngày
        sameSite: 'lax',
    });

    revalidatePath('/');
    return { success: true, message: "Đăng nhập thành công!", user: sessionData };
};

// Server Action xử lý Đăng xuất
export const logoutController = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('current_user');
    
    revalidatePath('/');
    redirect('/login');
};
