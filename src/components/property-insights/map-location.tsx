
'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { ReportSection } from './report-section';
import { Card, CardContent } from '@/components/ui/card';

interface MapLocationProps {
  postcode: string | null;
  isLoading: boolean;
}

export function MapLocation({ postcode, isLoading }: MapLocationProps) {
  return (
    <ReportSection title="Property Location" isLoading={isLoading} icon={<MapPin />}>
      {postcode ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Visual representation of the street view for <strong>{postcode}</strong>.
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <Image
                src={`https://picsum.photos/seed/streetview-${postcode.replace(/\s+/g, '')}/800/600`} // Use postcode and context as seed
                alt={`Google Street View placeholder for ${postcode}`}
                width={800}
                height={600}
                className="object-cover w-full h-full"
                data-ai-hint="street view"
                priority={false} // Not critical path for LCP
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: This is a placeholder image. An actual Google Street View image requires integration with the Google Street View API (which typically requires an API key).
            </p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          Postcode not available to display map.
        </p>
      )}
    </ReportSection>
  );
}

