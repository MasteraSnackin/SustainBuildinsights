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
  
  const recentApproved = planningApplications?.filter(app => app.status.toLowerCase() === "approved" && new Date(app.date) > new Date(new Date().setFullYear(new Date().getFullYear() - 2)));
  const recentRejected = planningApplications?.filter(app => app.status.toLowerCase() !== "approved" && new Date(app.date) > new Date(new Date().setFullYear(new Date().getFullYear() - 2)));

  return (
    <ReportSection title="Planning & Regulatory Landscape" isLoading={isLoading} icon={<Gavel />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataListDisplay
            label="Recent Approved Planning Applications (last 2 years)"
            items={recentApproved}
            renderItem={(app) => `${app.applicationId} - ${app.status} (${new Date(app.date).toLocaleDateString()})`}
            citationNumber={4}
          />
        </div>
        <div>
          <DataListDisplay
            label="Recent Rejected/Other Planning Applications (last 2 years)"
            items={recentRejected}
            renderItem={(app) => `${app.applicationId} - ${app.status} (${new Date(app.date).toLocaleDateString()})`}
            citationNumber={4}
          />
        </div>
      </div>
      <div className="mt-4">
        <DataListDisplay
          label="Conservation Areas"
          items={conservationAreas}
          renderItem={(area) => area.name}
          citationNumber={5}
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
