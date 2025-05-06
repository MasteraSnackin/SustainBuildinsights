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
  const latestAskingPrice = askingPrices && askingPrices.length > 0 ? askingPrices[0].price : undefined;
  const averageSoldPrice = soldPrices && soldPrices.length > 0 
    ? soldPrices.reduce((sum, p) => sum + p.price, 0) / soldPrices.length 
    : undefined;

  return (
    <ReportSection title="Property Valuation & Market Analysis" isLoading={isLoading} icon={<DollarSign />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataDisplay label="Current Property Asking Price" value={currentAskingPrice} unit="GBP" citationNumber={1} />
          <DataDisplay label="Latest Local Asking Price (from API)" value={latestAskingPrice} unit="GBP" citationNumber={1} />
          <DataDisplay label="Average Local Sold Price (from API)" value={averageSoldPrice ? Math.round(averageSoldPrice) : undefined} unit="GBP" citationNumber={2} />
          
          <DataListDisplay
            label="Recent Asking Prices"
            items={askingPrices}
            renderItem={(item) => `£${item.price.toLocaleString()} (Listed: ${new Date(item.date).toLocaleDateString()})`}
            citationNumber={1}
          />
        </div>
        <div>
          <DataListDisplay
            label="Recent Sold Prices"
            items={soldPrices}
            renderItem={(item) => `£${item.price.toLocaleString()} (Sold: ${new Date(item.date).toLocaleDateString()})`}
            citationNumber={2}
          />
           {/* Placeholder for price-per-floor-area */}
          <DataDisplay label="Price-per-Floor-Area" value="Data pending API for floor area" citationNumber={6} />
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
          Citations: [1] Asking Prices API, [2] Sold Prices API, [3] Price Trends API, [6] Sold Prices Floor Area API.
        </p>
      </div>
    </ReportSection>
  );
}
