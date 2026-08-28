-- AlterTable
ALTER TABLE "user" ADD COLUMN     "notify_due_soon" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_overdue" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notify_reminders" BOOLEAN NOT NULL DEFAULT true;
