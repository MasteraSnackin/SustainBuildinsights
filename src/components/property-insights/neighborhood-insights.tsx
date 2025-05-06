'use client';

import { ReportSection, DataListDisplay, DataDisplay } from './report-section';
import { School, ShieldAlert, Users } from 'lucide-react';
import type { School as SchoolData, CrimeRates, Demographics as DemographicsData } from '@/services/patma';
import { CrimeRateChart } from '@/components/charts/crime-rate-chart';
import { DemographicsChart } from '@/components/charts/demographics-chart';

interface NeighborhoodInsightsProps {
  schools: SchoolData[] | null;
  crimeRates: CrimeRates[] | null;
  demographics: DemographicsData[] | null;
  isLoading: boolean;
}

export function NeighborhoodInsights({
  schools,
  crimeRates,
  demographics,
  isLoading,
}: NeighborhoodInsightsProps) {
  return (
    <ReportSection title="Neighborhood Insights" isLoading={isLoading} icon={<Users />}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><School className="mr-2 h-5 w-5 text-accent" />Schools</h3>
          <DataListDisplay
            label="Local Schools & Ofsted Ratings"
            items={schools}
            renderItem={(school) => `${school.name} - Rating: ${school.ofstedRating || 'N/A'}`}
            citationNumber={6}
          />
          {/* Placeholder for catchment areas */}
          <p className="text-sm text-muted-foreground mt-1">Catchment area information typically requires manual research or specialized local data sources.</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-accent" />Crime Rates</h3>
           {crimeRates && crimeRates.length > 0 ? (
            <CrimeRateChart data={crimeRates} />
          ) : (
             <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-md p-4">
                <ShieldAlert className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No crime rate data available for chart.</p>
             </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">Compare these rates to regional averages for a comprehensive understanding. (Regional average data not provided by current API mock).</p>
          <DataListDisplay
            label="Crime Data Points"
            items={crimeRates}
            renderItem={(crime) => `${crime.type}: ${crime.rate}`}
            citationNumber={7}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center"><Users className="mr-2 h-5 w-5 text-accent" />Demographics</h3>
          {demographics && demographics.length > 0 ? (
            <DemographicsChart data={demographics} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-md p-4">
                <Users className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No demographic data available for chart.</p>
             </div>
          )}
          <DataListDisplay
            label="Demographic Data Points (Age & Income)"
            items={demographics}
            renderItem={(demo) => `Age: ${demo.age}, Income: £${demo.income.toLocaleString()}`}
            citationNumber={8}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Citations: [6] Schools API, [7] Crime Rates API, [8] Demographics API.
        </p>
      </div>
    </ReportSection>
  );
}
