'use client';

import Image from 'next/image';
import { MapPin, Landmark, Users, Flag } from 'lucide-react';
import { ReportSection, DataDisplay } from './report-section';
import { Card, CardContent } from '@/components/ui/card';
import type { AdministrativeBoundaries, ConservationArea, FloodRiskData } from '@/services/patma';

interface MapLocationProps {
  postcode: string | null;
  administrativeBoundaries: AdministrativeBoundaries | null;
  conservationAreas: ConservationArea[] | null;
  floodRiskData: FloodRiskData | null;
  isLoading: boolean;
}

export function MapLocation({ 
  postcode, 
  administrativeBoundaries,
  conservationAreas,
  floodRiskData,
  isLoading 
}: MapLocationProps) {
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN";
  const MAPBOX_STYLE_ID = process.env.NEXT_PUBLIC_MAPBOX_STYLE_ID || "mapbox/streets-v12"; // Default to streets-v12

  const notableFeatures: string[] = [];
  if (conservationAreas && conservationAreas.length > 0) {
    notableFeatures.push(...conservationAreas.map(ca => `${ca.name} (Conservation Area)`));
  }
  if (floodRiskData) {
    if (floodRiskData.riversAndSea && floodRiskData.riversAndSea !== "Very Low") {
      notableFeatures.push(`Flood Risk (Rivers/Sea: ${floodRiskData.riversAndSea})`);
    }
    if (floodRiskData.surfaceWater && floodRiskData.surfaceWater !== "Very Low") {
      notableFeatures.push(`Flood Risk (Surface Water: ${floodRiskData.surfaceWater})`);
    }
  }
  
  const mapImageUrl = administrativeBoundaries && MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN"
    ? `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_ID}/static/${administrativeBoundaries.longitude},${administrativeBoundaries.latitude},15/600x400?access_token=${MAPBOX_ACCESS_TOKEN}`
    : `https://picsum.photos/seed/map-placeholder-${postcode?.replace(/\s+/g, '') || 'default'}/800/400`;
  
  const mapImageAlt = administrativeBoundaries && MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN"
    ? `Map showing location for ${postcode} using style ${MAPBOX_STYLE_ID}`
    : `Placeholder map for ${postcode}`;

  return (
    <ReportSection title="Location Overview" isLoading={isLoading} icon={<MapPin />}>
      {postcode ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Map of {postcode}
              </h3>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border">
                 <Image
                    src={mapImageUrl}
                    alt={mapImageAlt}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                    data-ai-hint="map location"
                    priority={false} 
                    unoptimized={MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN" && administrativeBoundaries !== null && !mapImageUrl.startsWith('https://picsum.photos')}
                  />
              </div>
              {MAPBOX_ACCESS_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN" && (
                 <p className="text-xs text-muted-foreground mt-2">
                  Note: This is a placeholder image. To display a real map, please set your <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in <code>.env.local</code>.
                </p>
              )}
               {process.env.NEXT_PUBLIC_MAPBOX_STYLE_ID && MAPBOX_ACCESS_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN" && (
                 <p className="text-xs text-muted-foreground mt-1">
                  Using custom Mapbox style: <code>{process.env.NEXT_PUBLIC_MAPBOX_STYLE_ID}</code>.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Administrative & Geographic Details
              </h3>
              {administrativeBoundaries ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <DataDisplay 
                    label="Coordinates" 
                    value={`${administrativeBoundaries.latitude.toFixed(4)}, ${administrativeBoundaries.longitude.toFixed(4)}`} 
                    icon={<MapPin className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                  <DataDisplay 
                    label="Local Authority" 
                    value={administrativeBoundaries.localAuthority} 
                    icon={<Landmark className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                  <DataDisplay 
                    label="Council" 
                    value={administrativeBoundaries.council} 
                    icon={<Landmark className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                  <DataDisplay 
                    label="Constituency" 
                    value={administrativeBoundaries.constituency} 
                    icon={<Users className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                   <DataDisplay 
                    label="Ward" 
                    value={administrativeBoundaries.ward} 
                    icon={<Users className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                   <DataDisplay 
                    label="Country" 
                    value={administrativeBoundaries.country} 
                    icon={<Flag className="inline-block mr-1 h-4 w-4 text-muted-foreground" />} 
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Administrative boundary data not available.</p>
              )}
            </div>
             {notableFeatures.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Notable Features:</h4>
                <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-muted-foreground">
                  {notableFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
             <p className="text-xs text-muted-foreground mt-4">
                Map data &copy; Mapbox &copy; OpenStreetMap. Administrative data from mock MapIt API. Notable features from PaTMa API (Conservation Areas, Flood Risk).
              </p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          Postcode not available to display location details.
        </p>
      )}
    </ReportSection>
  );
}

