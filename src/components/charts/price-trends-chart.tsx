'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PriceTrends } from '@/services/patma';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface PriceTrendsChartProps {
  data: PriceTrends[];
}

const chartConfig = {
  averagePrice: {
    label: "Average Price (£)",
    color: "hsl(var(--accent))",
  },
} satisfies import('@/components/ui/chart').ChartConfig;

export function PriceTrendsChart({ data }: PriceTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 border-dashed">
        <TrendingUp className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No price trend data available to display chart.</p>
      </Card>
    );
  }

  const chartData = [...data] // Create a shallow copy to avoid mutating the prop
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by original date strings
    .map(item => ({ // Then map to the format required by the chart
      date: new Date(item.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      averagePrice: item.averagePrice,
    }));


  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends Over Time</CardTitle>
        <CardDescription>Analysis of 5-year price trends in the postcode.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="averagePrice"
              type="monotone"
              stroke="var(--color-averagePrice)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-averagePrice)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

