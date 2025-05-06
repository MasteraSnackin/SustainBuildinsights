'use client';

import { ReportSection, DataDisplay, DataListDisplay } from './report-section';
import { DollarSign, Home, TrendingUp } from 'lucide-react';
import type { AskingPrice, SoldPrice, PriceTrends } from '@/services/patma';
import { PriceTrendsChart } from '@/components/charts/price-trends-chart';

interface ValuationMarketAnalysisProps {
  askingPrices: AskingPrice[] | null;
  soldPrices: SoldPrice[] | null;
  priceTrends: PriceTrends[] | null;
  currentAskingPrice?: number;
  isLoading: boolean;
}

export function ValuationMarketAnalysis({
  askingPrices,
  soldPrices,
  priceTrends,
  currentAskingPrice,
  isLoading,
}: ValuationMarketAnalysisProps) {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const recentAskingPrices = askingPrices
    ?.filter(price => new Date(price.date) >= fiveYearsAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentSoldPrices = soldPrices
    ?.filter(price => new Date(price.date) >= fiveYearsAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const latestAskingPriceLocal = recentAskingPrices && recentAskingPrices.length > 0 ? recentAskingPrices[0].price : undefined;
  
  const averageSoldPriceLocal = recentSoldPrices && recentSoldPrices.length > 0 
    ? recentSoldPrices.reduce((sum, p) => sum + p.price, 0) / recentSoldPrices.length 
    : undefined;

  return (
    <ReportSection title="Property Valuation & Market Analysis" isLoading={isLoading} icon={<DollarSign />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataDisplay label="Current Property Asking Price" value={currentAskingPrice} unit="GBP" citationNumber={1} />
          <DataDisplay label="Latest Local Asking Price (last 5 years)" value={latestAskingPriceLocal} unit="GBP" citationNumber={1} />
          <DataDisplay label="Average Local Sold Price (last 5 years)" value={averageSoldPriceLocal ? Math.round(averageSoldPriceLocal) : undefined} unit="GBP" citationNumber={2} />
          
          <DataListDisplay
            label="Asking Prices (last 5 years)"
            items={recentAskingPrices?.slice(0, 5)} // Display top 5 recent for brevity
            renderItem={(item) => `£${item.price.toLocaleString()} (Listed: ${new Date(item.date).toLocaleDateString()})`}
            citationNumber={1}
            emptyMessage="No asking prices found in the last 5 years."
          />
        </div>
        <div>
          <DataListDisplay
            label="Sold Prices (last 5 years)"
            items={recentSoldPrices?.slice(0,5)} // Display top 5 recent for brevity
            renderItem={(item) => `£${item.price.toLocaleString()} (Sold: ${new Date(item.date).toLocaleDateString()})`}
            citationNumber={2}
            emptyMessage="No sold prices found in the last 5 years."
          />
           {/* Placeholder for price-per-floor-area */}
          <DataDisplay label="Price-per-Floor-Area (Recent Examples)" value="Data from Sold Prices Floor Area API" citationNumber={11} />
        </div>
      </div>
      
      <div className="mt-6">
        {priceTrends && priceTrends.length > 0 ? (
          <PriceTrendsChart data={priceTrends} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-md p-4">
            <TrendingUp className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No price trend data available for chart.</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Citations: [1] Asking Prices API, [2] Sold Prices API, [3] Price Trends API, [11] Sold Prices Floor Area API.
        </p>
      </div>
    </ReportSection>
  );
}
