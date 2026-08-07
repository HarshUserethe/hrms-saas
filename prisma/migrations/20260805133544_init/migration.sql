-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('IN_PROGRESS', 'PRESENT', 'HALF_DAY', 'ABSENT', 'HOLIDAY', 'WEEK_OFF', 'ON_LEAVE');

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "organization_member_id" TEXT NOT NULL,
    "attendance_date" DATE NOT NULL,
    "clock_in_at" TIMESTAMP(3),
    "clock_out_at" TIMESTAMP(3),
    "total_presence_seconds" INTEGER NOT NULL DEFAULT 0,
    "total_break_seconds" INTEGER NOT NULL DEFAULT 0,
    "total_working_seconds" INTEGER NOT NULL DEFAULT 0,
    "overtime_seconds" INTEGER NOT NULL DEFAULT 0,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "clock_in_ip_address" TEXT,
    "clock_out_ip_address" TEXT,
    "clock_in_device" TEXT,
    "clock_out_device" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_breaks" (
    "id" TEXT NOT NULL,
    "attendance_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_breaks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendances_organization_member_id_idx" ON "attendances"("organization_member_id");

-- CreateIndex
CREATE INDEX "attendances_attendance_date_idx" ON "attendances"("attendance_date");

-- CreateIndex
CREATE INDEX "attendances_status_idx" ON "attendances"("status");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_organization_member_id_attendance_date_key" ON "attendances"("organization_member_id", "attendance_date");

-- CreateIndex
CREATE INDEX "attendance_breaks_attendance_id_idx" ON "attendance_breaks"("attendance_id");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_organization_member_id_fkey" FOREIGN KEY ("organization_member_id") REFERENCES "organization_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_breaks" ADD CONSTRAINT "attendance_breaks_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
