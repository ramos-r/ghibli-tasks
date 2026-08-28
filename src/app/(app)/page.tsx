import { CalendarClockIcon, CheckCircle2Icon, ListTodoIcon } from "lucide-react";
import { MostProductiveDayCard } from "@/components/features/dashboard/most-productive-day-card";
import { ProgressCard } from "@/components/features/dashboard/progress-card";
import { RecentActivityCard } from "@/components/features/dashboard/recent-activity-card";
import { StatTile } from "@/components/features/dashboard/stat-tile";
import { UpcomingDeadlinesCard } from "@/components/features/dashboard/upcoming-deadlines-card";
import { requireCurrentUser } from "@/lib/session";
import { getCategories } from "@/services/categories";
import {
  getMonthlyProgress,
  getMostProductiveDay,
  getRecentActivity,
  getTaskCounts,
  getUpcomingDeadlines,
  getWeeklyProgress,
} from "@/services/dashboard";
import { getTags } from "@/services/tags";

export default async function DashboardPage() {
  const user = await requireCurrentUser();

  const [
    counts,
    weeklyProgress,
    monthlyProgress,
    upcomingDeadlines,
    mostProductiveDay,
    recentActivity,
    categories,
    tags,
  ] = await Promise.all([
    getTaskCounts(user.id),
    getWeeklyProgress(user.id),
    getMonthlyProgress(user.id),
    getUpcomingDeadlines(user.id),
    getMostProductiveDay(user.id),
    getRecentActivity(user.id),
    getCategories(user.id),
    getTags(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Here&apos;s where things stand.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={CalendarClockIcon} label="Due today" value={counts.todayCount} />
        <StatTile icon={CheckCircle2Icon} label="Completed" value={counts.completedCount} />
        <StatTile icon={ListTodoIcon} label="Pending" value={counts.pendingCount} />
        <MostProductiveDayCard
          day={mostProductiveDay?.day ?? null}
          count={mostProductiveDay?.count ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProgressCard title="This week" {...weeklyProgress} />
        <ProgressCard title="This month" {...monthlyProgress} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <UpcomingDeadlinesCard tasks={upcomingDeadlines} categories={categories} tags={tags} />
        <RecentActivityCard entries={recentActivity} />
      </div>
    </div>
  );
}
