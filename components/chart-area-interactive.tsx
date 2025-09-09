"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Interview trend chart";

const chartConfig = {
  count: {
    label: "Interviews",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartInterviewTrend({
  interviewTrend,
}: Readonly<{
  interviewTrend: { date: string; count: number }[];
}>) {
  const isMobile = useIsMobile();

  // ✅ No more filtering, just use all data
  const data = React.useMemo(() => interviewTrend ?? [], [interviewTrend]);

  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground border rounded-md">
        No interview data available for the selected period
      </div>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Interview Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            All recorded interviews
          </span>
          <span className="@[540px]/card:hidden">Trend overview</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillCount)"
              stroke="var(--primary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
