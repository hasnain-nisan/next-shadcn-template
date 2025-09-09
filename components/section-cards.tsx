import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardsProps = {
  totalInterviews: number;
  completedInterviews: number;
  activeProjects: number;
  engagedClients: number;
};

export function SectionCards({
  totalInterviews,
  completedInterviews,
  activeProjects,
  engagedClients,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 px-0">
      {/* Total Interviews */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Interviews</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInterviews}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total interviews recorded <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all clients and projects
          </div>
        </CardFooter>
      </Card>

      {/* Completed Interviews */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed Interviews</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {completedInterviews}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Fully processed interviews <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Includes distillation, coaching, and user stories
          </div>
        </CardFooter>
      </Card>

      {/* Active Projects */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeProjects}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Projects with recent interviews <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on last 30 days activity
          </div>
        </CardFooter>
      </Card>

      {/* Engaged Clients */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Engaged Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {engagedClients}
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +0%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Clients active in last 90 days <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on interview activity
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}