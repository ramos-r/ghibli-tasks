export const calendarViews = ["month", "week", "day"] as const;
export type CalendarView = (typeof calendarViews)[number];
