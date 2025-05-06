'use client';

import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Demographics as DemographicsData } from '@/services/patma'; // Renamed to avoid conflict
import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface DemographicsChartProps {
  data: DemographicsData[];
}

const defaultChartConfig = {
  // Default config, will be populated dynamically
} satisfies import('@/components/ui/chart').ChartConfig;


export function DemographicsChart({ data }: DemographicsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 border-dashed">
        <Users className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No demographic data available to display chart.</p>
      </Card>
    );
  }

  // Aggregate income by age group for pie chart
  const ageGroupIncome: { [key: string]: number } = {};
  data.forEach(item => {
    if (ageGroupIncome[item.age]) {
      ageGroupIncome[item.age] += item.income;
    } else {
      ageGroupIncome[item.age] = item.income;
    }
  });

  const chartData = Object.entries(ageGroupIncome).map(([age, income]) => ({
    name: age,
    value: income,
    fill: `hsl(var(--chart-${(Object.keys(ageGroupIncome).indexOf(age) % 5) + 1}))` // Cycle through chart colors
  }));
  
  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as import('@/components/ui/chart').ChartConfig);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographic Distribution (by Total Income)</CardTitle>
        <CardDescription>Distribution of total income by age group.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-[0px] lg:flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
