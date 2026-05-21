'use client';

import { useState } from 'react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { userId, email, full_name, role, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser({ userId, email, full_name, role });
        router.push('/');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to your LocalCart account</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 flex items-start">
            <span className="mr-3">⚠️</span>
            <div>
              <p className="font-semibold">Login Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              className={`form-input ${
                fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">📌 {fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className={`form-input ${
                fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">📌 {fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded text-xs text-gray-700">
            <p className="font-semibold mb-1">Try with admin account:</p>
            <p>📧 admin@localcart.com</p>
            <p>🔐 ChangeMe123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
