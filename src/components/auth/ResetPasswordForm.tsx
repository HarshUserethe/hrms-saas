'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  KeyRound,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormSchemaType = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordFormProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  serverError?: string | null;
  onSubmit?: (data: ResetPasswordFormSchemaType) => Promise<void>;
}

export function ResetPasswordForm({
  organization,
  serverError: serverErrorProp,
  onSubmit: onSubmitProp,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ResetPasswordFormSchemaType) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        if (onSubmitProp) {
          await onSubmitProp(data);
        } else {
          // Simulate API call delay for UI loading demonstration
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setSuccess('Your password has been successfully reset.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(
            err.message || 'An unexpected error occurred. Please try again.',
          );
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmitProp],
  );

  // Active error to show (either serverError passed down or local error state)
  const displayError = serverErrorProp || error;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header containing Logo & Organization Name */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 text-white shadow-sm">
            <Image
              className="h-full w-full object-cover"
              src={
                organization.logoUrl ??
                'https://i.pinimg.com/vwebp/1200x/5d/47/fe/5d47fe37a5795aeda79a43687cdf7509.webp'
              }
              alt={`${organization.name} Logo`}
              width={48}
              height={48}
            />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {organization.name}
            </h2>
            <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Create a new password for your account.
        </p>

        {success ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">Success</p>
                <p className="mt-1 text-emerald-700">{success}</p>
              </div>
            </div>
            <Link
              href={`/${organization.slug}/login`}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Inline Server Error display */}
            {displayError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">Reset Failed</p>
                  <p className="mt-0.5 text-xs leading-normal text-red-700">
                    {displayError}
                  </p>
                </div>
              </div>
            )}

            {/* New Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div
                className={cn(
                  'flex items-center overflow-hidden rounded-lg border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-100',
                  errors.password
                    ? 'border-red-400 ring-1 ring-red-200 focus-within:border-red-500 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-blue-500',
                )}
              >
                <div className="pl-3 text-gray-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="At least 8 characters"
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="px-3 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
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

            {/* Confirm Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div
                className={cn(
                  'flex items-center overflow-hidden rounded-lg border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-100',
                  errors.confirmPassword
                    ? 'border-red-400 ring-1 ring-red-200 focus-within:border-red-500 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-blue-500',
                )}
              >
                <div className="pl-3 text-gray-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Re-enter password"
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="px-3 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>Reset Password</>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
