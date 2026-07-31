import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware, APIError } from 'better-auth/api';

import { prisma } from './db';
import { organizationValidationService } from '@/modules/organization/applications/services/organization-validation.service';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: ['http://localhost:3000'],

  plugins: [nextCookies()],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === '/sign-in/email' ||
        ctx.path.endsWith('/sign-in/email')
      ) {
        const body = ctx.body as { organizationSlug?: string } | undefined;
        const organizationSlug = body?.organizationSlug;

        if (!organizationSlug) {
          throw new APIError('BAD_REQUEST', {
            message: 'Organization slug is required.',
          });
        }

        // Validate organization existence & status before credential checking
        await organizationValidationService.validateOrganizationBeforeAuth(
          organizationSlug,
        );
      }
    }),

    after: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === '/sign-in/email' ||
        ctx.path.endsWith('/sign-in/email')
      ) {
        const body = ctx.body as { organizationSlug?: string } | undefined;
        const organizationSlug = body?.organizationSlug;

        const returned = ctx.context.returned as
          { user?: { id: string }; token?: string } | undefined;

        const userId = returned?.user?.id;

        if (organizationSlug && userId) {
          try {
            await organizationValidationService.validateMemberAfterAuth(
              organizationSlug,
              userId,
            );
          } catch (error) {
            // Security: revoke created session if membership validation fails
            if (returned?.token) {
              await prisma.session
                .deleteMany({
                  where: { token: returned.token },
                })
                .catch(() => {});
            }
            throw error;
          }
        }
      }
    }),
  },
});
