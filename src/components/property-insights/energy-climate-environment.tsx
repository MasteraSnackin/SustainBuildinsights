
'use client';

import { ReportSection, DataDisplay, DataListDisplay } from './report-section';
import {
  Thermometer, Droplets, Wind, Zap, Leaf, Sun, WindIcon, Trees, Mountain, CloudRainWind, Factory,
  ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp, TrendingDown, Minus, Waves, LayersIcon, TestTube2, Sprout, Info
} from 'lucide-react';
import type { EpcData, FloodRiskData, AirQualityData, HistoricalClimateData, TreeCoverageData, SoilTypeData, WaterSourceData, IndustrialActivityData } from '@/services/patma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface EnergyClimateEnvironmentProps {
  epcData: EpcData | null;
  floodRiskData: FloodRiskData | null;
  airQualityData: AirQualityData | null;
  historicalClimateData: HistoricalClimateData | null;
  treeCoverageData: TreeCoverageData | null;
  soilTypeData: SoilTypeData | null;
  waterSourceData: WaterSourceData | null;
  industrialActivityData: IndustrialActivityData | null;
  isLoading: boolean;
}

const getEpcRatingColor = (rating?: string): string => {
  if (!rating) return 'bg-muted';
  switch (rating.toUpperCase()) {
    case 'A': return 'bg-green-500';
    case 'B': return 'bg-green-400';
    case 'C': return 'bg-yellow-400';
    case 'D': return 'bg-yellow-500';
    case 'E': return 'bg-orange-500';
    case 'F': return 'bg-red-500';
    case 'G': return 'bg-red-600';
    default: return 'bg-muted';
  }
};

const getAqiCategoryStyle = (category?: string): { color: string, bgColor: string, icon: JSX.Element } => {
  if (!category) return { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: <Info className="h-4 w-4" /> };
  switch (category.toLowerCase()) {
    case 'good': return { color: 'text-green-700', bgColor: 'bg-green-100', icon: <ShieldCheck className="h-4 w-4 text-green-600" /> };
    case 'moderate': return { color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: <ShieldCheck className="h-4 w-4 text-yellow-600" /> };
    case 'unhealthy for sensitive groups': return { color: 'text-orange-700', bgColor: 'bg-orange-100', icon: <AlertTriangle className="h-4 w-4 text-orange-600" /> };
    case 'unhealthy': return { color: 'text-red-700', bgColor: 'bg-red-100', icon: <ShieldAlert className="h-4 w-4 text-red-600" /> };
    case 'very unhealthy': return { color: 'text-purple-700', bgColor: 'bg-purple-100', icon: <ShieldAlert className="h-4 w-4 text-purple-600" /> };
    case 'hazardous': return { color: 'text-red-800', bgColor: 'bg-red-200', icon: <ShieldAlert className="h-4 w-4 text-red-700" /> }; // Assuming a maroon color exists or define it
    default: return { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: <Info className="h-4 w-4" /> };
  }
};

const getRiskVisuals = (level?: string | null): { text: string, Icon: React.ElementType, colorClass: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" } => {
  if (!level) level = "Unknown";
  switch (level.toLowerCase()) {
    case 'very low': return { text: 'Very Low', Icon: ShieldCheck, colorClass: 'text-green-600', badgeVariant: 'secondary' };
    case 'low': return { text: 'Low', Icon: ShieldCheck, colorClass: 'text-yellow-600', badgeVariant: 'secondary' };
    case 'medium': return { text: 'Medium', Icon: AlertTriangle, colorClass: 'text-orange-600', badgeVariant: 'default' };
    case 'high': return { text: 'High', Icon: ShieldAlert, colorClass: 'text-red-600', badgeVariant: 'destructive' };
    default: return { text: level || 'N/A', Icon: Info, colorClass: 'text-muted-foreground', badgeVariant: 'outline' };
  }
};

const getDrainageVisuals = (drainage?: string | null): { text: string, Icon: React.ElementType, colorClass: string } => {
  if(!drainage) drainage = "Unknown";
  switch (drainage.toLowerCase()) {
    case 'well-drained': return { text: 'Well-drained', Icon: TrendingUp, colorClass: 'text-green-600' };
    case 'moderately well-drained': return { text: 'Moderately Well-drained', Icon: Minus, colorClass: 'text-yellow-600' };
    case 'poorly-drained': return { text: 'Poorly-drained', Icon: TrendingDown, colorClass: 'text-orange-600' };
    case 'very poorly-drained': return { text: 'Very Poorly-drained', Icon: TrendingDown, colorClass: 'text-red-600' };
    default: return { text: drainage || 'N/A', Icon: Info, colorClass: 'text-muted-foreground' };
  }
};

const getWaterQualityVisuals = (quality?: string | null): { text: string, Icon: React.ElementType, colorClass: string } => {
  if(!quality) quality = "Unknown";
  switch (quality.toLowerCase()) {
    case 'good': return { text: 'Good', Icon: ShieldCheck, colorClass: 'text-green-600' };
    case 'fair': return { text: 'Fair', Icon: ShieldCheck, colorClass: 'text-yellow-600' }; // Shield can be an option too
    case 'poor': return { text: 'Poor', Icon: ShieldAlert, colorClass: 'text-red-600' };
    default: return { text: quality || 'N/A', Icon: Info, colorClass: 'text-muted-foreground' };
  }
};


export function EnergyClimateEnvironment({
  epcData,
  floodRiskData,
  airQualityData,
  historicalClimateData,
  treeCoverageData,
  soilTypeData,
  waterSourceData,
  industrialActivityData,
  isLoading,
}: EnergyClimateEnvironmentProps) {
  return (
    <ReportSection title="Energy, Climate & Environment" isLoading={isLoading} icon={<Leaf />}>
      <div className="space-y-6">
        {/* EPC Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-accent" />Energy Performance Certificate (EPC)
          </h3>
          {epcData ? (
            <Card>
              <CardHeader>
                <CardTitle>EPC Rating: {epcData.currentRating} (Score: {epcData.currentScore})</CardTitle>
                <CardDescription>
                  Potential Rating: {epcData.potentialRating} (Score: {epcData.potentialScore}) | Assessed: {new Date(epcData.assessmentDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Current Efficiency</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full text-white ${getEpcRatingColor(epcData.currentRating)}`}>{epcData.currentRating}</span>
                  </div>
                  <Progress value={epcData.currentScore} aria-label={`Current EPC score ${epcData.currentScore}`} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Potential Efficiency</span>
                     <span className={`text-sm font-bold px-2 py-0.5 rounded-full text-white ${getEpcRatingColor(epcData.potentialRating)}`}>{epcData.potentialRating}</span>
                  </div>
                  <Progress value={epcData.potentialScore} aria-label={`Potential EPC score ${epcData.potentialScore}`} className="h-3 [&>div]:bg-sky-500" />
                </div>
                {epcData.reportUrl && (
                  <a href={epcData.reportUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                    View full EPC report (if available)
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No EPC data available for this property.</p>
          )}
           <p className="text-xs text-muted-foreground mt-1">Citation: [13] Energy Performance Certificate Data API.</p>
        </div>

        {/* Flood Risk Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Waves className="mr-2 h-5 w-5 text-accent" />Flood Risk
          </h3>
          {floodRiskData ? (
            <Card>
              <CardHeader>
                 <CardTitle>Flood Risk Assessment</CardTitle>
                 <CardDescription>Risk levels from various sources for the area.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(['riversAndSea', 'surfaceWater', 'reservoirs'] as const).map(source => {
                  const risk = floodRiskData[source];
                  const visuals = getRiskVisuals(risk);
                  const label = source.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  if (risk === undefined && source === 'reservoirs') return null; // Only render reservoirs if data exists

                  return (
                    <div key={source} className="flex items-center justify-between p-3 bg-card rounded-md border">
                      <div className="flex items-center">
                        <visuals.Icon className={cn("mr-2 h-5 w-5", visuals.colorClass)} />
                        <span className="font-medium">{label}</span>
                      </div>
                      <Badge variant={visuals.badgeVariant} className={cn(visuals.colorClass, visuals.badgeVariant === "destructive" ? "text-destructive-foreground" : "")}>
                        {visuals.text}
                      </Badge>
                    </div>
                  );
                })}
                {floodRiskData.detailsUrl && (
                  <a href={floodRiskData.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block pt-2">
                    Check detailed flood risk information
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No flood risk data available for this postcode.</p>
          )}
           <p className="text-xs text-muted-foreground mt-1">Citation: [14] Flood Risk Data API.</p>
        </div>

        {/* Air Quality Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <WindIcon className="mr-2 h-5 w-5 text-accent" />Air Quality Index (AQI)
          </h3>
          {airQualityData ? (
             <Card>
               <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AQI: {airQualityData.aqi}</span>
                    <Badge className={cn("text-sm", getAqiCategoryStyle(airQualityData.category).bgColor, getAqiCategoryStyle(airQualityData.category).color)}>
                      {getAqiCategoryStyle(airQualityData.category).icon}
                      <span className="ml-1">{airQualityData.category}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Dominant Pollutant: {airQualityData.dominantPollutant || 'N/A'} | Last Updated: {new Date(airQualityData.lastUpdated).toLocaleString()}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground">
                    Air Quality Index (AQI) indicates the level of air pollution. Lower values are better.
                 </p>
               </CardContent>
             </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No air quality data available for this location.</p>
          )}
           <p className="text-xs text-muted-foreground mt-1">Citation: [15] Air Quality Data API.</p>
        </div>

        {/* Historical Climate Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Thermometer className="mr-2 h-5 w-5 text-accent" />Historical Climate
          </h3>
          {historicalClimateData ? (
            <Card>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <DataDisplay icon={<CloudRainWind className="inline-block mr-1 h-4 w-4 text-muted-foreground"/>} label="Avg. Annual Rainfall" value={historicalClimateData.averageAnnualRainfallMm} unit="mm" />
                <DataDisplay icon={<Thermometer className="inline-block mr-1 h-4 w-4 text-muted-foreground"/>} label="Avg. Annual Mean Temp" value={historicalClimateData.averageAnnualMeanTempC} unit="°C" />
                <DataDisplay icon={<Sun className="inline-block mr-1 h-4 w-4 text-muted-foreground"/>} label="Avg. Daily Sunshine" value={historicalClimateData.averageSunshineHoursPerDay} unit="hrs" />
                <DataDisplay icon={<Wind className="inline-block mr-1 h-4 w-4 text-muted-foreground"/>} label="Avg. Wind Speed" value={historicalClimateData.averageWindSpeedMph} unit="mph" />
                {historicalClimateData.dataYears && <DataDisplay label="Based on Data Over" value={historicalClimateData.dataYears} unit="years" />}
                {historicalClimateData.source && <p className="text-xs text-muted-foreground mt-2 md:col-span-2">Source: {historicalClimateData.source}</p>}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No historical climate data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [16] Historical Climate Data API.</p>
        </div>
        
        {/* Tree Coverage Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Trees className="mr-2 h-5 w-5 text-accent" />Tree Coverage
          </h3>
          {treeCoverageData ? (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tree Coverage Percentage</span>
                    <span className="text-sm font-medium">{treeCoverageData.coveragePercentage}%</span>
                  </div>
                  <Progress value={treeCoverageData.coveragePercentage} aria-label={`Tree coverage ${treeCoverageData.coveragePercentage}%`} className="h-3 [&>div]:bg-green-500" />
                </div>
                <DataListDisplay label="Dominant Tree Types" items={treeCoverageData.dominantSpecies} renderItem={(species) => species} />
                <p className="text-xs text-muted-foreground">Last Updated: {new Date(treeCoverageData.lastUpdated).toLocaleDateString()}</p>
                {treeCoverageData.sourceUrl && (
                  <a href={treeCoverageData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block">
                    View tree coverage source
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No tree coverage data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [18] Tree Coverage Data API.</p>
        </div>

        {/* Soil Type Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <LayersIcon className="mr-2 h-5 w-5 text-accent" />Soil Characteristics
          </h3>
          {soilTypeData ? (
            <Card>
              <CardHeader>
                <CardTitle>Soil Profile: {soilTypeData.primarySoilType}</CardTitle>
                <CardDescription>Key soil properties for the area.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <Sprout className="mr-2 h-5 w-5 text-green-600" />
                        <span className="font-medium">Primary Soil Type</span>
                    </div>
                    <Badge variant="outline">{soilTypeData.primarySoilType || 'N/A'}</Badge>
                </div>
                 <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <TestTube2 className="mr-2 h-5 w-5 text-blue-600" />
                        <span className="font-medium">Soil pH</span>
                    </div>
                    <Badge variant="outline">{soilTypeData.soilPh?.toFixed(1) || 'N/A'}</Badge>
                </div>
                 <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <getDrainageVisuals.Icon className={cn("mr-2 h-5 w-5", getDrainageVisuals(soilTypeData.drainageClass).colorClass)} />
                        <span className="font-medium">Drainage Class</span>
                    </div>
                    <Badge variant="outline" className={getDrainageVisuals(soilTypeData.drainageClass).colorClass}>{getDrainageVisuals(soilTypeData.drainageClass).text}</Badge>
                </div>
                 <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <Leaf className="mr-2 h-5 w-5 text-lime-600" />
                        <span className="font-medium">Agricultural Potential</span>
                    </div>
                    <Badge variant="outline">{soilTypeData.agriculturalPotential || 'N/A'}</Badge>
                </div>

                {soilTypeData.sourceUrl && (
                  <a href={soilTypeData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block pt-2">
                    View soil data source
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No soil type data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [19] Soil Type Data API.</p>
        </div>
        
        {/* Water Source Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-accent" />Water Sources & Quality
          </h3>
          {waterSourceData ? (
            <Card>
              <CardHeader>
                  <CardTitle>Local Water Environment</CardTitle>
                  <CardDescription>Information on nearby water bodies and groundwater.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <Waves className="mr-2 h-5 w-5 text-blue-500" />
                        <span className="font-medium">Nearest Major River</span>
                    </div>
                    <Badge variant="outline">{waterSourceData.nearestRiverName || 'N/A'} ({waterSourceData.nearestRiverDistanceKm?.toFixed(1) || 'N/A'} km)</Badge>
                </div>
                 <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <LayersIcon className="mr-2 h-5 w-5 text-cyan-600" />
                        <span className="font-medium">Groundwater Availability</span>
                    </div>
                    <Badge variant="outline">{waterSourceData.groundwaterAvailability || 'N/A'}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-md border">
                    <div className="flex items-center">
                        <getWaterQualityVisuals.Icon className={cn("mr-2 h-5 w-5", getWaterQualityVisuals(waterSourceData.waterQuality).colorClass)} />
                        <span className="font-medium">Local Water Quality</span>
                    </div>
                     <Badge variant="outline" className={getWaterQualityVisuals(waterSourceData.waterQuality).colorClass}>{getWaterQualityVisuals(waterSourceData.waterQuality).text}</Badge>
                </div>
                {waterSourceData.sourceUrl && (
                  <a href={waterSourceData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block pt-2">
                    View water source data
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No water source data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [20] Water Source Data API.</p>
        </div>

        {/* Industrial Activity Data Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2 flex items-center">
            <Factory className="mr-2 h-5 w-5 text-accent" />Nearby Industrial Activity
          </h3>
          {industrialActivityData ? (
            <Card>
              <CardContent className="pt-6">
                <DataDisplay label="Industrial Zones Nearby" value={industrialActivityData.hasMajorIndustrialZones ? 'Yes' : 'No'} />
                {industrialActivityData.majorActivities && industrialActivityData.majorActivities.length > 0 && (
                  <DataListDisplay label="Major Industrial Activities" items={industrialActivityData.majorActivities} renderItem={(activity) => activity} />
                )}
                <DataDisplay label="Proximity to Sensitive Sites" value={industrialActivityData.proximityToSensitiveSitesKm} unit="km" />
                 {industrialActivityData.sourceUrl && (
                  <a href={industrialActivityData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block">
                    View industrial activity data
                  </a>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No industrial activity data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [21] Industrial Activity Data API.</p>
        </div>

         <p className="text-xs text-muted-foreground mt-4">
          Citations: [13] EPC Data API, [14] Flood Risk Data API, [15] Air Quality Data API, [16] Historical Climate Data API, [18] Tree Coverage API, [19] Soil Type API, [20] Water Source API, [21] Industrial Activity API. Data from free tier APIs; accuracy and availability may vary.
        </p>
      </div>
    </ReportSection>
  );
}
