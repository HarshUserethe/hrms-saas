import {
  type AttendanceBreak,
  Prisma,
  PrismaClient,
} from '@/generated/prisma/client';

import { prisma as db } from '@/lib/db';

/**
 * AttendanceBreakRepository
 * -------------------------
 * Owns the persistence concerns of the `AttendanceBreak` aggregate.
 *
 * Every method is a single, named database operation. It deliberately
 * contains NO business rules, validations, or duration/clock calculations —
 * those belong to the service layer. Prisma errors propagate untouched so
 * the service layer applies a single, consistent error-mapping strategy.
 *
 * The PrismaClient is injected through the constructor (defaulting to the
 * shared singleton in `@/lib/db`) to keep the repository unit-testable and
 * decoupled from a hard-coded client instance.
 */
export class AttendanceBreakRepository {
  constructor(private readonly client: PrismaClient = db) {}

  /**
   * Persists a new break record (employee starts a break).
   * Uses the unchecked input because the caller supplies the scalar
   * `attendanceId` foreign key rather than a nested relation.
   */
  createBreak(
    data: Prisma.AttendanceBreakUncheckedCreateInput,
  ): Promise<AttendanceBreak> {
    return this.client.attendanceBreak.create({ data });
  }

  /**
   * Retrieves a single break record by its primary key.
   */
  findBreakById(id: string): Promise<AttendanceBreak | null> {
    return this.client.attendanceBreak.findUnique({ where: { id } });
  }

  /**
   * Finds the currently active (started, not yet ended) break for an
   * attendance record. `endedAt` is nullable, so "active" is modelled as a
   * plain `endedAt` IS NULL lookup. Ordered newest-first to return the open
   * break if there is more than one.
   */
  findActiveBreak(attendanceId: string): Promise<AttendanceBreak | null> {
    return this.client.attendanceBreak.findFirst({
      where: { attendanceId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Closes the active break by writing `endedAt` and the accumulated
   * `durationSeconds` on the break row.
   */
  endBreak(
    id: string,
    data: Prisma.AttendanceBreakUncheckedUpdateInput,
  ): Promise<AttendanceBreak> {
    return this.client.attendanceBreak.update({ where: { id }, data });
  }

  /**
   * Returns every break belonging to an attendance record, ordered
   * chronologically so the service/handler never re-sorts the timeline.
   */
  getAttendanceBreaks(attendanceId: string): Promise<AttendanceBreak[]> {
    return this.client.attendanceBreak.findMany({
      where: { attendanceId },
      orderBy: { startedAt: 'asc' },
    });
  }

  /**
   * Totals a break's stored durations in seconds via Prisma aggregation.
   * Returns 0 when no breaks exist (SUM yields NULL over an empty set).
   */
  async getTotalBreakDuration(attendanceId: string): Promise<number> {
    const result = await this.client.attendanceBreak.aggregate({
      where: { attendanceId },
      _sum: { durationSeconds: true },
    });

    return result._sum.durationSeconds ?? 0;
  }

  /**
   * Removes a break record. Reserved for administrative features (e.g.
   * correcting an erroneous entry by an HR admin).
   */
  deleteBreak(id: string): Promise<AttendanceBreak> {
    return this.client.attendanceBreak.delete({ where: { id } });
  }
}

export const attendanceBreakRepository = new AttendanceBreakRepository();
