'use client';

import { ReportSection, DataDisplay, DataListDisplay } from './report-section';
import { Thermometer, Droplets, Wind, Zap, ShieldCheck, Leaf } from 'lucide-react';
import type { EpcData, FloodRiskData, AirQualityData, HistoricalClimateData } from '@/services/patma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EnergyClimateEnvironmentProps {
  epcData: EpcData | null;
  floodRiskData: FloodRiskData | null;
  airQualityData: AirQualityData | null;
  historicalClimateData: HistoricalClimateData | null;
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
            <Wind className="mr-2 h-5 w-5 text-accent" />Air Quality
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
              <CardContent className="pt-6">
                <DataDisplay label="Average Annual Rainfall" value={historicalClimateData.averageAnnualRainfallMm} unit="mm" />
                <DataDisplay label="Average Annual Mean Temperature" value={historicalClimateData.averageAnnualMeanTempC} unit="°C" />
                {historicalClimateData.dataYears && <DataDisplay label="Based on Data Over" value={historicalClimateData.dataYears} unit="years" />}
                {historicalClimateData.source && <p className="text-xs text-muted-foreground mt-2">Source: {historicalClimateData.source}</p>}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">No historical climate data available for this location.</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Citation: [16] Historical Climate Data API.</p>
        </div>
         <p className="text-xs text-muted-foreground mt-4">
          Citations: [13] EPC Data API, [14] Flood Risk Data API, [15] Air Quality Data API, [16] Historical Climate Data API. Data from free tier APIs; accuracy and availability may vary.
        </p>
      </div>
    </ReportSection>
  );
}
