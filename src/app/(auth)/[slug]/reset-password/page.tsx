import type { Metadata } from 'next';
import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';
import { getOrganizationBySlug } from '@/modules/organization/applications/services/get-organization-by-slug.service';
import LoginRight from '@/modules/login/components/login-right';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Kinetic HRMS',
  description: 'Reset your password for your Kinetic HRMS account',
};

interface ResetPasswordPageRouteProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string; error?: string }>;
}

export default async function ResetPasswordRoutePage({
  params,
  searchParams,
}: ResetPasswordPageRouteProps) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;
  const errorParam = resolvedSearchParams.error;

  // Simulate token validations for inline error demonstration
  let serverError: string | null = null;
  if (!token) {
    serverError =
      'Reset token is missing or invalid. Please check your email or request a new reset link.';
  } else if (errorParam === 'expired') {
    serverError =
      'This password reset link has expired. Please request a new link.';
  } else if (errorParam === 'used') {
    serverError =
      'This reset token has already been used. Please request a new link.';
  } else if (errorParam === 'invalid') {
    serverError =
      'The password reset token is invalid or malformed. Please try again.';
  } else if (errorParam === 'server') {
    serverError =
      'An unexpected server error occurred. Please try again later.';
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Left Panel ── */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-8 py-10 sm:px-12 lg:w-[60%] lg:px-16 xl:w-[60%] xl:px-10">
        {/* Logo Header */}
        <div className="mb-10 w-full">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm transition-colors group-hover:bg-blue-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-600">
              Kinetic HRMS
            </span>
          </Link>
        </div>

        {/* Form Area */}
        <div className="flex w-full max-w-[480px] flex-1 flex-col justify-center">
          <ResetPasswordForm
            organization={organization}
            serverError={serverError}
          />
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-1.5 text-sm text-gray-400">
          <LifeBuoy className="h-4 w-4" />
          <span>Need assistance?</span>
          <a
            href="mailto:support@kinetichrms.com"
            className="font-medium text-blue-600 transition-colors hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* ── Right Panel (Workspace Image) ── */}
      <div className="relative sticky top-0 ml-auto hidden min-h-screen overflow-hidden bg-gray-900 lg:flex lg:w-[35%] xl:w-[40%]">
        <LoginRight />
      </div>
    </div>
  );
}
