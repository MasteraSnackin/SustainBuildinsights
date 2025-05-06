import { PropertyInsightsDashboard } from '@/components/property-insights-dashboard';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
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
        <SidebarContent className="p-2 group-data-[collapsible=icon]:p-0">
          {/* Sidebar content can go here if needed, e.g., navigation or saved reports */}
           <div className="p-2 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-sidebar-foreground/70">
              Generate detailed property reports.
            </p>
          </div>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shadow-sm">
          <SidebarTrigger className="md:hidden" /> {/* Mobile trigger */}
          <h1 className="text-xl font-semibold text-foreground">Redevelopment Potential Report</h1>
        </header>
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8">
            <PropertyInsightsDashboard />
          </main>
        </ScrollArea>
      </SidebarInset>
    </div>
  );
}
