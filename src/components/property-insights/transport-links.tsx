
'use client';

import { ReportSection, DataListDisplay, DataDisplay } from './report-section';
import { Bus, Train, Car } from 'lucide-react';
import type { TransportLink } from '@/services/patma';

interface TransportLinksProps {
  transportLinks: TransportLink[] | null;
  isLoading: boolean;
}

const getTransportIcon = (type: string) => {
  if (type.toLowerCase().includes('train') || type.toLowerCase().includes('tube')) {
    return <Train className="mr-2 h-5 w-5 text-accent" />;
  }
  if (type.toLowerCase().includes('bus') || type.toLowerCase().includes('tram')) {
    return <Bus className="mr-2 h-5 w-5 text-accent" />;
  }
  if (type.toLowerCase().includes('motorway') || type.toLowerCase().includes('road')) {
    return <Car className="mr-2 h-5 w-5 text-accent" />;
  }
  return <Train className="mr-2 h-5 w-5 text-accent" />; // Default icon
};

export function TransportLinks({ transportLinks, isLoading }: TransportLinksProps) {
  return (
    <ReportSection title="Transport Links" isLoading={isLoading} icon={<Train />}>
      {transportLinks && transportLinks.length > 0 ? (
        <DataListDisplay
          label="Nearby Transport Options"
          items={transportLinks}
          renderItem={(link) => (
            <div className="flex items-start">
              {getTransportIcon(link.type)}
              <div>
                <span className="font-semibold">{link.name}</span> ({link.type}) - {link.distanceMiles} miles
                {link.journeyTimeToHub && <span className="block text-xs text-muted-foreground">Journey to Hub: {link.journeyTimeToHub}</span>}
              </div>
            </div>
          )}
          citationNumber={17}
        />
      ) : (
        <p className="text-sm text-muted-foreground">No transport link data available for this location.</p>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        Citation: [17] Transport Links API (mock data). Real-life data integration would require specific API keys (e.g., TransportAPI, Google Maps) and potentially involve costs and more complex setup.
      </p>
    </ReportSection>
  );
}

