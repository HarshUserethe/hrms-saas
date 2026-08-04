'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  Mail,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormSchemaType = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordFormProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  onSubmit?: (data: ForgotPasswordFormSchemaType) => Promise<void>;
}

export function ForgotPasswordForm({
  organization,
  onSubmit: onSubmitProp,
}: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const performRequest = useCallback(
    async (email: string) => {
      setIsSubmitting(true);
      setError(null);
      setRetryable(false);
      setSuccess(null);

      try {
        if (onSubmitProp) {
          await onSubmitProp({ email });
          setSuccess('A password reset link has been sent to your email.');
          return;
        }

        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const result = (await response.json().catch(() => ({}))) as {
          message?: string;
        };

        if (response.ok) {
          setSuccess(
            result.message ||
              'A password reset link has been sent to your email.',
          );
          return;
        }

        // 5xx and network failures are retryable; business errors are not.
        setRetryable(response.status >= 500);
        setError(
          result.message || 'An unexpected error occurred. Please try again.',
        );
      } catch (err: unknown) {
        setRetryable(true);
        if (err instanceof Error) {
          setError(
            err.message ||
              'Network error. Please check your connection and try again.',
          );
        } else {
          setError(
            'Network error. Please check your connection and try again.',
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmitProp],
  );

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormSchemaType) => {
      await performRequest(data.email);
    },
    [performRequest],
  );

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
            <h1 className="text-xl font-bold text-gray-900">Forgot Password</h1>
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Enter your work email address and we&apos;ll send you a link to reset
          your password.
        </p>

        {success ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">
                  Check your email
                </p>
                <p className="mt-1 text-emerald-700">{success}</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href={`/${organization.slug}/login`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div
                className={cn(
                  'flex items-center overflow-hidden rounded-lg border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-100',
                  errors.email
                    ? 'border-red-400 ring-1 ring-red-200 focus-within:border-red-500 focus-within:ring-red-100'
                    : 'border-gray-200 focus-within:border-blue-500',
                )}
              >
                <div className="pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@company.com"
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
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

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {retryable && (
                  <button
                    type="button"
                    onClick={() => performRequest(getValues('email'))}
                    disabled={isSubmitting}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 transition-colors hover:text-red-800 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try again
                  </button>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>Send Reset Link</>
              )}
            </Button>

            <div className="pt-2 text-center">
              <Link
                href={`/${organization.slug}/login`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
