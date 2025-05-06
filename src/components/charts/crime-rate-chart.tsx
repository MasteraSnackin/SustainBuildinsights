'use client';

import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CrimeRates } from '@/services/patma';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';


interface CrimeRateChartProps {
  data: CrimeRates[];
}

const chartConfig = {
  rate: {
    label: "Crime Rate",
    color: "hsl(var(--destructive))",
  },
} satisfies import('@/components/ui/chart').ChartConfig;


export function CrimeRateChart({ data }: CrimeRateChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 border-dashed">
        <ShieldAlert className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No crime rate data available to display chart.</p>
      </Card>
    );
  }
  
  const chartData = data.map(item => ({
    type: item.type,
    rate: item.rate,
  }));

  return (
     <Card>
      <CardHeader>
        <CardTitle>Crime Rate Breakdown</CardTitle>
        <CardDescription>Comparison of crime rates by type.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{left: 20, right: 20}}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="capitalize"
            />
            <XAxis dataKey="rate" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="rate" fill="var(--color-rate)" radius={4}>
               <LabelList
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
