'use client';

import { ReportSection, DataListDisplay } from './report-section';
import { Gavel, Building } from 'lucide-react';
import type { PlanningApplication, ConservationArea } from '@/services/patma';

interface PlanningRegulatoryProps {
  planningApplications: PlanningApplication[] | null;
  conservationAreas: ConservationArea[] | null;
  isLoading: boolean;
}

export function PlanningRegulatory({
  planningApplications,
  conservationAreas,
  isLoading,
}: PlanningRegulatoryProps) {
  
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const recentApplications = planningApplications?.filter(app => new Date(app.date) >= fiveYearsAgo)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentApproved = recentApplications?.filter(app => app.status.toLowerCase() === "approved");
  const recentRejectedOrOther = recentApplications?.filter(app => app.status.toLowerCase() !== "approved");

  return (
    <ReportSection title="Planning & Regulatory Landscape" isLoading={isLoading} icon={<Gavel />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataListDisplay
            label="Approved Planning Applications (last 5 years)"
            items={recentApproved?.slice(0, 5)} // Display top 5 for brevity
            renderItem={(app) => `${app.applicationId} - ${app.description} (${new Date(app.date).toLocaleDateString()})`}
            citationNumber={4}
            emptyMessage="No approved planning applications found in the last 5 years."
          />
        </div>
        <div>
          <DataListDisplay
            label="Rejected/Other Status Planning Applications (last 5 years)"
            items={recentRejectedOrOther?.slice(0, 5)} // Display top 5 for brevity
            renderItem={(app) => `${app.applicationId} - ${app.status} - ${app.description} (${new Date(app.date).toLocaleDateString()})`}
            citationNumber={4}
            emptyMessage="No rejected or other status planning applications found in the last 5 years."
          />
        </div>
      </div>
      <div className="mt-4">
        <DataListDisplay
          label="Conservation Areas Affecting Postcode"
          items={conservationAreas}
          renderItem={(area) => area.name}
          citationNumber={5}
          emptyMessage="No conservation areas listed for this postcode."
        />
        {/* Placeholder for Article 4 assessment */}
        <p className="text-sm mt-2">
          <span className="font-medium">Article 4 Restrictions: </span>
          <span className="text-muted-foreground">Assessment pending further data or manual review. API data may indicate presence through planning application details.</span>
        </p>
        <p className="text-sm mt-2">
          <span className="font-medium">Likelihood of Planning Permission: </span>
           <span className="text-muted-foreground">Consider approved vs. rejected application types, conservation area status, and specific redevelopment plans. A detailed review is recommended.</span>
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Citations: [4] Planning Applications API, [5] Conservation Areas API.
        </p>
      </div>
    </ReportSection>
  );
}
