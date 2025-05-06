'use client';

import { ReportSection, DataDisplay } from './report-section';
import { Landmark, Receipt, TrendingUp } from 'lucide-react';
import type { StampDuty, RentEstimates } from '@/services/patma';

interface FinancialFeasibilityProps {
  stampDuty: StampDuty | null;
  rentEstimates: RentEstimates | null;
  propertyPrice?: number;
  isLoading: boolean;
}

const REFURBISHMENT_COST_PER_SQFT = 150; // Baseline as per requirements

export function FinancialFeasibility({
  stampDuty,
  rentEstimates,
  propertyPrice,
  isLoading,
}: FinancialFeasibilityProps) {
  
  const annualRent = rentEstimates ? rentEstimates.averageRent * 12 : undefined;
  const rentalYield = propertyPrice && annualRent && propertyPrice > 0 ? (annualRent / propertyPrice) * 100 : undefined;

  // ROI calculation requires floor area, which is not directly available from current mocks.
  // Placeholder for ROI:
  const estimatedFloorAreaSqFt = 1000; // Example placeholder, replace with actual or estimated data
  const totalRefurbishmentCost = estimatedFloorAreaSqFt * REFURBISHMENT_COST_PER_SQFT;
  const totalInvestment = (propertyPrice || 0) + (stampDuty?.amount || 0) + totalRefurbishmentCost;
  // Assuming a hypothetical resale value for ROI calculation. This is highly speculative without market data.
  const hypotheticalResaleValue = (propertyPrice || 0) * 1.2; // e.g. 20% uplift after refurb
  const profit = hypotheticalResaleValue - totalInvestment;
  const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : undefined;


  return (
    <ReportSection title="Financial Feasibility" isLoading={isLoading} icon={<Landmark />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataDisplay label="Stamp Duty Land Tax (SDLT)" value={stampDuty?.amount} unit="GBP" citationNumber={9} />
          <p className="text-xs text-muted-foreground mt-1">Calculated based on the property price of £{propertyPrice?.toLocaleString() || 'N/A'}.</p>
        </div>
        <div>
          <DataDisplay label="Estimated Average Monthly Rent" value={rentEstimates?.averageRent} unit="GBP" citationNumber={10} />
          <DataDisplay label="Estimated Annual Rent" value={annualRent} unit="GBP" />
          <DataDisplay label="Estimated Gross Rental Yield" value={rentalYield ? `${rentalYield.toFixed(2)}%` : undefined} />
        </div>
      </div>
      <div className="mt-6 border-t pt-4">
         <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" />Return on Investment (ROI) - Model</h3>
         <p className="text-sm text-muted-foreground mb-2">
           The following is a simplified ROI model. Actual ROI will depend on refurbishment scope, final costs, and market conditions. 
           Floor area is crucial for accurate refurbishment cost estimation.
         </p>
         <DataDisplay label="Assumed Refurbishment Cost per sqft" value={REFURBISHMENT_COST_PER_SQFT} unit="GBP" />
         <DataDisplay label="Placeholder Estimated Floor Area" value={estimatedFloorAreaSqFt} unit="sqft (example)" />
         <DataDisplay label="Estimated Total Refurbishment Cost" value={totalRefurbishmentCost} unit="GBP" />
         <DataDisplay label="Total Initial Investment (Price + SDLT + Refurb)" value={totalInvestment > 0 ? totalInvestment : undefined} unit="GBP" />
         <DataDisplay label="Hypothetical Resale Value (Example)" value={hypotheticalResaleValue} unit="GBP" />
         <DataDisplay label="Estimated Profit (Example)" value={profit} unit="GBP" />
         <DataDisplay label="Estimated ROI (Example)" value={roi ? `${roi.toFixed(2)}%` : undefined} />
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Citations: [9] Stamp Duty API, [10] Rent Estimates API. ROI model uses a baseline refurbishment cost of £150/sqft.
      </p>
    </ReportSection>
  );
}
