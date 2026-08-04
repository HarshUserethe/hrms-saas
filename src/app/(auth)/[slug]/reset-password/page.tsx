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
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordRoutePage({
  params,
  searchParams,
}: ResetPasswordPageRouteProps) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;

  const isTokenMissing = !token;

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
          {isTokenMissing ? (
            <div className="w-full max-w-md">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      {organization.name}
                    </h2>
                    <h1 className="text-xl font-bold text-gray-900">
                      Invalid Link
                    </h1>
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-500">
                  This password reset link is missing or invalid. Please check
                  your email for the full link, or request a new one.
                </p>

                <Link
                  href={`/${slug}/forgot-password`}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
                >
                  Request a new link
                </Link>
              </div>
            </div>
          ) : (
            <ResetPasswordForm organization={organization} token={token} />
          )}
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
