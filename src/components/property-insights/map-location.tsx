
'use client';

import Image from 'next/image';
import { MapPin, Landmark, Users, Flag, AlertTriangle } from 'lucide-react';
import { ReportSection, DataDisplay } from './report-section';
import { Card, CardContent } from '@/components/ui/card';
import type { AdministrativeBoundaries, ConservationArea, FloodRiskData } from '@/services/patma';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapLocationProps {
  postcode: string | null;
  administrativeBoundaries: AdministrativeBoundaries | null;
  conservationAreas: ConservationArea[] | null;
  floodRiskData: FloodRiskData | null;
  isLoading: boolean;
}

const MAPBOX_PLACEHOLDER_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN_PLACEHOLDER';

export function MapLocation({
  postcode,
  administrativeBoundaries,
  conservationAreas,
  floodRiskData,
  isLoading
}: MapLocationProps) {
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

  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || MAPBOX_PLACEHOLDER_TOKEN;
  const showMapboxTokenWarning = mapboxAccessToken === MAPBOX_PLACEHOLDER_TOKEN;

  let mapImageUrl: string;
  let mapImageAlt: string;

  if (administrativeBoundaries?.latitude && administrativeBoundaries?.longitude && mapboxAccessToken !== MAPBOX_PLACEHOLDER_TOKEN) {
    const { longitude, latitude } = administrativeBoundaries;
    // Mapbox Static Images API URL format
    mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${longitude},${latitude},15/800x600?access_token=${mapboxAccessToken}`;
    mapImageAlt = `Map of ${postcode} centered at ${latitude}, ${longitude}.`;
  } else {
    // Fallback to placeholder if coordinates or token are missing
    mapImageUrl = `https://picsum.photos/seed/map-placeholder-${postcode?.replace(/\s+/g, '') || 'default'}/800/600`;
    mapImageAlt = `Placeholder map for ${postcode}. Mapbox map could be displayed here if coordinates and access token are available.`;
  }

  return (
    <ReportSection title="Location Overview (Mapbox Static Map)" isLoading={isLoading} icon={<MapPin />}>
      {postcode ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Map of {postcode}
              </h3>
              {showMapboxTokenWarning && (
                 <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    A Mapbox Access Token is not configured. Displaying a placeholder map. 
                    Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file.
                  </AlertDescription>
                </Alert>
              )}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border">
                 <Image
                    src={mapImageUrl}
                    alt={mapImageAlt}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                    data-ai-hint="map street" 
                    priority={false}
                  />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Map generated using Mapbox Static Images API (or placeholder if unavailable).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Administrative & Geographic Details
              </h3>
              {administrativeBoundaries ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <DataDisplay
                    label="Coordinates"
                    value={administrativeBoundaries.latitude && administrativeBoundaries.longitude ? `${administrativeBoundaries.latitude.toFixed(4)}, ${administrativeBoundaries.longitude.toFixed(4)}` : 'N/A'}
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
                Administrative data from mock MapIt API. Notable features from PaTMa API (Conservation Areas, Flood Risk). Map visualization via Mapbox Static Images API.
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

