'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  loginSchema,
  type LoginFormSchemaType,
} from '../domain/login-form-schema';
import { authClient } from '@/lib/auth-client';

export function LoginForm({
  organization,
}: {
  organization: {
    id: string;
    name: string;
    slug: string;
    status: string;
    logoUrl: string | null;
  };
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormSchemaType) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const { data: response, error: authError } =
          await authClient.signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
          });

        if (authError) {
          setError(authError.message || 'Invalid email or password');
          return;
        }

        console.log('Login Success:', response);

        window.location.href = `/${organization.slug}/dashboard`;
      } catch {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [organization.slug],
  );

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm">
            <Image
              className="h-full w-full rounded-xl object-cover"
              src={
                organization.logoUrl ??
                'https://i.pinimg.com/vwebp/1200x/5d/47/fe/5d47fe37a5795aeda79a43687cdf7509.webp'
              }
              alt="organization_logo"
              width={48}
              height={48}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {organization.name}
            </h1>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div
              className={cn(
                'flex items-center overflow-hidden rounded-lg border transition-all duration-200',
                errors.email
                  ? 'border-red-400 ring-1 ring-red-200'
                  : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100',
              )}
            >
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div
              className={cn(
                'flex items-center overflow-hidden rounded-lg border transition-all duration-200',
                errors.password
                  ? 'border-red-400 ring-1 ring-red-200'
                  : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100',
              )}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-500 transition-colors hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
