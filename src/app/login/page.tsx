import React from 'react';
import LoginForm from '@/views/auth/LoginForm';
import { getCurrentUser } from '@/models/auth.model';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    // Nếu user đã đăng nhập thì điều hướng về trang chủ luôn
    const user = await getCurrentUser();
    if (user) {
        redirect('/');
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <LoginForm />
        </div>
    );
}
