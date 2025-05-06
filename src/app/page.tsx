'use client';

import { useState } from 'react';
import { PropertyInsightsDashboard } from '@/components/property-insights-dashboard';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger, SidebarSeparator } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReportChatbot } from '@/components/property-insights/report-chatbot';
import type { GenerateExecutiveSummaryOutput } from '@/ai/flows/generate-executive-summary';
import { ReportActions } from '@/components/report-actions';


export default function Home() {
  const [executiveSummaryText, setExecutiveSummaryText] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  // Add state for other report data if needed by ReportChatbot context, for now just using summary
  const [chatbotContextPostcode, setChatbotContextPostcode] = useState<string | null>(null);


  const handleReportDataFetched = (data: { executiveSummary: GenerateExecutiveSummaryOutput | null, submittedPostcode: string | null }) => {
    setExecutiveSummaryText(data.executiveSummary?.summary ?? null);
    setChatbotContextPostcode(data.submittedPostcode);
  };

  const isReportAvailable = executiveSummaryText !== null;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar className="border-r" collapsible="icon" variant="sidebar">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
              <Logo className="w-6 h-6" />
            </Button>
            <h1 className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Property Insights
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2 group-data-[collapsible=icon]:p-0 flex flex-col">
           <div className="p-2 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-sidebar-foreground/70">
              Generate detailed property reports.
            </p>
          </div>
          <SidebarSeparator className="my-2 group-data-[collapsible=icon]:hidden" />
          <div className="flex-1 overflow-y-auto group-data-[collapsible=icon]:hidden p-2 space-y-4">
             <ReportChatbot 
              executiveSummaryText={executiveSummaryText} 
              isReportLoading={isReportLoading}
              // You might want to pass more context if the chatbot needs it
              // For example, the postcode: chatbotContextPostcode
            />
            {isReportAvailable && <ReportActions reportContent={executiveSummaryText} />}
          </div>
           <div className="p-2 mt-auto group-data-[collapsible=icon]:hidden">
             <p className="text-xs text-sidebar-foreground/50">Interact with the generated report summary using the tools above.</p>
           </div>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shadow-sm">
          <SidebarTrigger className="md:hidden" /> {/* Mobile trigger */}
          <h1 className="text-xl font-semibold text-foreground">Redevelopment Potential Report</h1>
        </header>
        <ScrollArea className="flex-1">
          <main className="lg:max-w-7xl xl:max-w-none"> {/* Removed p-4 md:p-6 lg:p-8 as dashboard has its own padding */}
            <PropertyInsightsDashboard 
              onSummaryGenerated={setExecutiveSummaryText}
              onLoadingChange={setIsReportLoading}
              onReportDataFetched={handleReportDataFetched}
            />
          </main>
        </ScrollArea>
      </SidebarInset>
    </div>
  );
}
