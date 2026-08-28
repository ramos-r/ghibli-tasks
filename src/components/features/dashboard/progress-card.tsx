import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressCard({
  title,
  completed,
  total,
  percentage,
}: {
  title: string;
  completed: number;
  total: number;
  percentage: number;
}) {
  return (
    <Card className="gap-3 p-4">
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing due in this period yet.</p>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{percentage}%</span>
              <span className="text-xs text-muted-foreground">
                {completed} of {total} done
              </span>
            </div>
            <Progress value={percentage} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
