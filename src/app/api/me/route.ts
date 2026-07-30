import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/services/auth/me.service';
import { getServerSession } from '@/services/auth/session.service';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const me = await getCurrentUser(session.user.id);

    return NextResponse.json(me);
  } catch (error) {
    console.error('GET /api/me', error);

    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  }
}
