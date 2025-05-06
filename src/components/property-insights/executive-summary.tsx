'use client';

import { ReportSection } from './report-section';
import { FileText } from 'lucide-react';
import type { GenerateExecutiveSummaryOutput } from '@/ai/flows/generate-executive-summary';

interface ExecutiveSummaryProps {
  summaryData: GenerateExecutiveSummaryOutput | null;
  isLoading: boolean;
}

export function ExecutiveSummary({ summaryData, isLoading }: ExecutiveSummaryProps) {
  return (
    <ReportSection title="Executive Summary" isLoading={isLoading} icon={<FileText />}>
      {summaryData?.summary ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{summaryData.summary}</p>
      ) : (
        <p className="text-sm text-muted-foreground">No executive summary generated yet. Please provide property details and generate the report.</p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        This summary is AI-generated based on PaTMa API data. Always verify critical information.
      </p>
    </ReportSection>
  );
}
