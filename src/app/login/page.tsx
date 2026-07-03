"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginController } from '@/controllers/auth.controller';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);

      const result = await loginController(formData);

      if (result.success) {
        router.push('/projects');
        router.refresh(); // bắt buộc để Navbar (Server Component) đọc lại cookie mới
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded border border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-[#202124] mb-1">Đăng nhập DevGrigs</h1>
        <p className="text-xs text-gray-500 mb-6">Nền tảng kết nối nhân sự IT</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="vd: hr@techcorp.vn"
        />

        <label className="block text-xs font-semibold text-gray-700 mb-1">Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="••••••"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-[#1a73e8] text-white text-sm font-semibold rounded hover:bg-[#1557b0] disabled:opacity-50"
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="mt-4 text-[11px] text-gray-400 leading-relaxed">
          Tài khoản demo:<br />
          🏢 hr@techcorp.vn / 123456 (Doanh nghiệp)<br />
          💻 freelancer@devgrigs.com / 123456 (Freelancer)
        </div>
      </form>
    </main>
  );
}