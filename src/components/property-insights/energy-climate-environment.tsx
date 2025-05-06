
'use client';

import { ReportSection, DataDisplay, DataListDisplay } from './report-section';
import { Thermometer, Droplets, Wind, Zap, ShieldCheck, Leaf, Sun, WindIcon, Trees, Mountain, CloudRainWind, Factory } from 'lucide-react';
import type { EpcData, FloodRiskData, AirQualityData, HistoricalClimateData, TreeCoverageData, SoilTypeData, WaterSourceData, IndustrialActivityData } from '@/services/patma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

const getAqiCategoryColor = (category?: string): string => {
  if (!category) return 'text-muted-foreground';
  switch (category.toLowerCase()) {
    case 'good': return 'text-green-600';
    case 'moderate': return 'text-yellow-600';
    case 'unhealthy for sensitive groups': return 'text-orange-600';
    case 'unhealthy': return 'text-red-600';
    case 'very unhealthy': return 'text-purple-600';
    case 'hazardous': return 'text-maroon-600'; // Assuming a maroon color exists or define it
    default: return 'text-muted-foreground';
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
            <ShieldCheck className="mr-2 h-5 w-5 text-accent" />Flood Risk
          </h3>
          {floodRiskData ? (
            <Card>
              <CardContent className="pt-6">
                <DataDisplay label="Rivers and Sea" value={floodRiskData.riversAndSea} />
                <DataDisplay label="Surface Water" value={floodRiskData.surfaceWater} />
                {floodRiskData.reservoirs && <DataDisplay label="Reservoirs" value={floodRiskData.reservoirs} />}
                {floodRiskData.detailsUrl && (
                  <a href={floodRiskData.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block">
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
            <WindIcon className="mr-2 h-5 w-5 text-accent" />Air Quality
          </h3>
          {airQualityData ? (
             <Card>
               <CardContent className="pt-6">
                <DataDisplay label="Air Quality Index (AQI)" value={airQualityData.aqi} />
                <DataDisplay label="Category" value={airQualityData.category} />
                {airQualityData.dominantPollutant && <DataDisplay label="Dominant Pollutant" value={airQualityData.dominantPollutant} />}
                <p className={`text-lg font-semibold ${getAqiCategoryColor(airQualityData.category)}`}>
                  Overall: {airQualityData.category} (AQI: {airQualityData.aqi})
                </p>
                <p className="text-xs text-muted-foreground">Last Updated: {new Date(airQualityData.lastUpdated).toLocaleString()}</p>
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
              <CardContent className="pt-6">
                <DataDisplay label="Tree Coverage Percentage" value={treeCoverageData.coveragePercentage} unit="%" />
                <DataDisplay label="Dominant Tree Types" value={treeCoverageData.dominantSpecies?.join(', ')} />
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
            <Mountain className="mr-2 h-5 w-5 text-accent" />Soil Type
          </h3>
          {soilTypeData ? (
            <Card>
              <CardContent className="pt-6">
                <DataDisplay label="Primary Soil Type" value={soilTypeData.primarySoilType} />
                <DataDisplay label="Soil pH" value={soilTypeData.soilPh} />
                <DataDisplay label="Drainage Class" value={soilTypeData.drainageClass} />
                 {soilTypeData.agriculturalPotential && <DataDisplay label="Agricultural Potential" value={soilTypeData.agriculturalPotential} />}
                {soilTypeData.sourceUrl && (
                  <a href={soilTypeData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block">
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
            <Droplets className="mr-2 h-5 w-5 text-accent" />Water Sources
          </h3>
          {waterSourceData ? (
            <Card>
              <CardContent className="pt-6">
                <DataDisplay label="Nearest Major River" value={waterSourceData.nearestRiverName} unit={waterSourceData.nearestRiverDistanceKm ? `${waterSourceData.nearestRiverDistanceKm} km` : undefined} />
                <DataDisplay label="Groundwater Availability" value={waterSourceData.groundwaterAvailability} />
                <DataDisplay label="Water Quality" value={waterSourceData.waterQuality} />
                {waterSourceData.sourceUrl && (
                  <a href={waterSourceData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-2 block">
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
