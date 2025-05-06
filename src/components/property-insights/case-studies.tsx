'use client';

import { ReportSection, DataListDisplay } from './report-section';
import { Presentation, CheckSquare } from 'lucide-react';
import type { SoldPricesFloorArea, RentalComparables } from '@/services/patma';

interface CaseStudiesProps {
  soldPricesFloorArea: SoldPricesFloorArea[] | null;
  rentalComparables: RentalComparables[] | null;
  isLoading: boolean;
}

export function CaseStudies({
  soldPricesFloorArea,
  rentalComparables,
  isLoading,
}: CaseStudiesProps) {

  // Simplified case study generation due to limited mock data structure
  // In a real scenario, we would need more detailed comparable data (e.g., property type, size, condition before/after refurb)

  const soldCaseStudies = soldPricesFloorArea?.slice(0, 3).map((item, index) => ({
    id: `sold-${index}`,
    description: `Comparable property sold with price per floor area of £${item.pricePerFloorArea.toLocaleString()}.`,
    profitMargin: "Profit margin analysis requires pre-redevelopment cost basis (not available in mock).",
    timeToSale: "Time-to-sale data not available in current mock."
  }));

  const rentalCaseStudies = rentalComparables?.slice(0, 3).map((item, index) => ({
    id: `rental-${index}`,
    description: `Comparable rental property with average rent of £${item.averageRent.toLocaleString()}.`,
  }));


  return (
    <ReportSection title="Case Studies & Comparables" isLoading={isLoading} icon={<Presentation />}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><CheckSquare className="mr-2 h-5 w-5 text-accent" />Sold Property Comparables</h3>
          {soldCaseStudies && soldCaseStudies.length > 0 ? (
            <DataListDisplay
              label="Examples of Sold Properties (based on Price per Floor Area)"
              items={soldCaseStudies}
              renderItem={(study) => (
                <div>
                  <p>{study.description}</p>
                  <p className="text-xs italic text-muted-foreground">{study.profitMargin}</p>
                  <p className="text-xs italic text-muted-foreground">{study.timeToSale}</p>
                </div>
              )}
              citationNumber={11}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No sold property comparable data available for case studies.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><CheckSquare className="mr-2 h-5 w-5 text-accent" />Rental Property Comparables</h3>
          {rentalCaseStudies && rentalCaseStudies.length > 0 ? (
            <DataListDisplay
              label="Examples of Rental Properties"
              items={rentalCaseStudies}
              renderItem={(study) => study.description}
              citationNumber={12}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No rental comparable data available for case studies.</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Citations: [11] Sold Prices Floor Area API, [12] Rental Comparables API. Note: Detailed case study analysis requires more granular data than available in current API mocks.
        </p>
      </div>
    </ReportSection>
  );
}
