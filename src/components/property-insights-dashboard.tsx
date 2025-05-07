'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

import { ExecutiveSummary } from './property-insights/executive-summary';
import { ValuationMarketAnalysis } from './property-insights/valuation-market-analysis';
import { PlanningRegulatory } from './property-insights/planning-regulatory';
import { NeighborhoodInsights } from './property-insights/neighborhood-insights';
import { FinancialFeasibility } from './property-insights/financial-feasibility';
import { CaseStudies } from './property-insights/case-studies';
import { EnergyClimateEnvironment } from './property-insights/energy-climate-environment';
import { TransportLinks } from './property-insights/transport-links';
import { MapLocation } from './property-insights/map-location';

import {
  getAskingPrices, getSoldPrices, getPriceTrends, getPlanningApplications,
  getConservationAreas, getSchools, getCrimeRates, getDemographics,
  getStampDuty, getRentEstimates, getSoldPricesFloorArea, getRentalComparables,
  getEpcData, getFloodRiskData, getAirQualityData, getHistoricalClimateData, getTransportLinks,
  getAdministrativeBoundaries, getTreeCoverageData, getSoilTypeData, getWaterSourceData, getIndustrialActivityData,
  type AskingPrice, type SoldPrice, type PriceTrends as PriceTrendData, type PlanningApplication,
  type ConservationArea, type School, type CrimeRates as CrimeRatesData, type Demographics as DemographicsData,
  type StampDuty as StampDutyData, type RentEstimates as RentEstimatesData, type SoldPricesFloorArea as SoldPricesFloorAreaData, type RentalComparables as RentalComparablesData,
  type EpcData as EpcApiData, type FloodRiskData as FloodRiskApiData, type AirQualityData as AirQualityApiData, type HistoricalClimateData as HistoricalClimateApiData, type TransportLink,
  type AdministrativeBoundaries as AdminBoundariesData, type TreeCoverageData as TreeCoverageApiData, type SoilTypeData as SoilTypeApiData, type WaterSourceData as WaterSourceApiData, type IndustrialActivityData as IndustrialActivityApiData,
} from '@/services/patma';
import { generateExecutiveSummary, type GenerateExecutiveSummaryInput, type GenerateExecutiveSummaryOutput } from '@/ai/flows/generate-executive-summary';

const formSchema = z.object({
  postcode: z.string().min(3, { message: 'Postcode must be at least 3 characters.' }).regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$/i, { message: 'Invalid UK postcode format.'}),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyInsightsDashboardProps {
  onSummaryGenerated: (summary: string | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onReportDataFetched: (data: { executiveSummary: GenerateExecutiveSummaryOutput | null, submittedPostcode: string | null }) => void;
}

export function PropertyInsightsDashboard({ onSummaryGenerated, onLoadingChange, onReportDataFetched }: PropertyInsightsDashboardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  // State for API data
  const [executiveSummary, setExecutiveSummary] = useState<GenerateExecutiveSummaryOutput | null>(null);
  const [askingPrices, setAskingPrices] = useState<AskingPrice[] | null>(null);
  const [soldPrices, setSoldPrices] = useState<SoldPrice[] | null>(null);
  const [priceTrends, setPriceTrends] = useState<PriceTrendData[] | null>(null);
  const [planningApplications, setPlanningApplications] = useState<PlanningApplication[] | null>(null);
  const [conservationAreas, setConservationAreas] = useState<ConservationArea[] | null>(null);
  const [schools, setSchools] = useState<School[] | null>(null);
  const [crimeRates, setCrimeRates] = useState<CrimeRatesData[] | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData[] | null>(null);
  const [stampDuty, setStampDuty] = useState<StampDutyData | null>(null);
  const [rentEstimates, setRentEstimates] = useState<RentEstimatesData | null>(null);
  const [soldPricesFloorArea, setSoldPricesFloorArea] = useState<SoldPricesFloorAreaData[] | null>(null);
  const [rentalComparables, setRentalComparables] = useState<RentalComparablesData[] | null>(null);
  
  const [epcData, setEpcData] = useState<EpcApiData | null>(null);
  const [floodRiskData, setFloodRiskData] = useState<FloodRiskApiData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityApiData | null>(null);
  const [historicalClimateData, setHistoricalClimateData] = useState<HistoricalClimateApiData | null>(null);
  const [transportLinks, setTransportLinks] = useState<TransportLink[] | null>(null);
  const [administrativeBoundaries, setAdministrativeBoundaries] = useState<AdminBoundariesData | null>(null);
  const [treeCoverageData, setTreeCoverageData] = useState<TreeCoverageApiData | null>(null);
  const [soilTypeData, setSoilTypeData] = useState<SoilTypeApiData | null>(null);
  const [waterSourceData, setWaterSourceData] = useState<WaterSourceApiData | null>(null);
  const [industrialActivityData, setIndustrialActivityData] = useState<IndustrialActivityApiData | null>(null);


  const [submittedPostcode, setSubmittedPostcode] = useState<string | null>(null);
  const [submittedPropertyPrice, setSubmittedPropertyPrice] = useState<number | undefined>(undefined);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postcode: '',
    },
  });

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
  }, []);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    onSummaryGenerated(executiveSummary?.summary ?? null);
  }, [executiveSummary, onSummaryGenerated]);

  useEffect(() => {
    if(isAnyDataAvailable) {
        onReportDataFetched({ executiveSummary, submittedPostcode });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executiveSummary, submittedPostcode]); 


  const handleGenerateReport: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSubmittedPostcode(data.postcode);
    const mockPropertyPriceForStampDuty = 500000; 
    setSubmittedPropertyPrice(mockPropertyPriceForStampDuty);

    
    try {
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      let callCount = 0;
      const maxCallsPerMinute = 20; 
      const callInterval = 60000 / maxCallsPerMinute; 

      const fetchDataWithRateLimit = async <T>(fetchFn: () => Promise<T>): Promise<T> => {
        if (callCount > 0) await delay(callInterval); 
        callCount++;
        return fetchFn();
      };
      
      const [
        askingPricesData, soldPricesData, priceTrendsData, planningApplicationsData,
        conservationAreasData, schoolsData, crimeRatesData, demographicsData,
        stampDutyData, rentEstimatesData, soldPricesFloorAreaData, rentalComparablesData,
        epcApiData, floodRiskApiDataResult, airQualityApiDataResult, historicalClimateApiDataResult, transportLinksData,
        adminBoundariesDataResult, treeCoverageApiDataResult, soilTypeApiDataResult, waterSourceApiDataResult, industrialActivityApiDataResult
      ] = await Promise.all([
        fetchDataWithRateLimit(() => getAskingPrices(data.postcode)),
        fetchDataWithRateLimit(() => getSoldPrices(data.postcode)),
        fetchDataWithRateLimit(() => getPriceTrends(data.postcode)),
        fetchDataWithRateLimit(() => getPlanningApplications(data.postcode)),
        fetchDataWithRateLimit(() => getConservationAreas(data.postcode)),
        fetchDataWithRateLimit(() => getSchools(data.postcode)),
        fetchDataWithRateLimit(() => getCrimeRates(data.postcode)),
        fetchDataWithRateLimit(() => getDemographics(data.postcode)),
        fetchDataWithRateLimit(() => getStampDuty(mockPropertyPriceForStampDuty)), 
        fetchDataWithRateLimit(() => getRentEstimates(data.postcode)),
        fetchDataWithRateLimit(() => getSoldPricesFloorArea(data.postcode)),
        fetchDataWithRateLimit(() => getRentalComparables(data.postcode)),
        fetchDataWithRateLimit(() => getEpcData(data.postcode)),
        fetchDataWithRateLimit(() => getFloodRiskData(data.postcode)),
        fetchDataWithRateLimit(() => getAirQualityData(data.postcode)),
        fetchDataWithRateLimit(() => getHistoricalClimateData(data.postcode)),
        fetchDataWithRateLimit(() => getTransportLinks(data.postcode)),
        fetchDataWithRateLimit(() => getAdministrativeBoundaries(data.postcode)),
        fetchDataWithRateLimit(() => getTreeCoverageData(data.postcode)),
        fetchDataWithRateLimit(() => getSoilTypeData(data.postcode)),
        fetchDataWithRateLimit(() => getWaterSourceData(data.postcode)),
        fetchDataWithRateLimit(() => getIndustrialActivityData(data.postcode)),
      ]);

      setAskingPrices(askingPricesData);
      setSoldPrices(soldPricesData);
      setPriceTrends(priceTrendsData);
      setPlanningApplications(planningApplicationsData);
      setConservationAreas(conservationAreasData);
      setSchools(schoolsData);
      setCrimeRates(crimeRatesData);
      setDemographics(demographicsData);
      setStampDuty(stampDutyData);
      setRentEstimates(rentEstimatesData);
      setSoldPricesFloorArea(soldPricesFloorAreaData);
      setRentalComparables(rentalComparablesData);
      setEpcData(epcApiData);
      setFloodRiskData(floodRiskApiDataResult);
      setAirQualityData(airQualityApiDataResult);
      setHistoricalClimateData(historicalClimateApiDataResult);
      setTransportLinks(transportLinksData);
      setAdministrativeBoundaries(adminBoundariesDataResult);
      setTreeCoverageData(treeCoverageApiDataResult);
      setSoilTypeData(soilTypeApiDataResult);
      setWaterSourceData(waterSourceApiDataResult);
      setIndustrialActivityData(industrialActivityApiDataResult);
      
      const executiveSummaryInput: GenerateExecutiveSummaryInput = {
        postcode: data.postcode,
        askingPrices: askingPricesData,
        soldPrices: soldPricesData,
        priceTrends: priceTrendsData,
        planningApplications: planningApplicationsData,
        conservationAreas: conservationAreasData,
        schools: schoolsData,
        crimeRates: crimeRatesData,
        demographics: demographicsData,
        stampDuty: stampDutyData,
        rentEstimates: rentEstimatesData,
        soldPricesFloorArea: soldPricesFloorAreaData,
        rentalComparables: rentalComparablesData,
        epcData: epcApiData,
        floodRiskData: floodRiskApiDataResult,
        airQualityData: airQualityApiDataResult,
        historicalClimateData: historicalClimateApiDataResult,
        transportLinks: transportLinksData,
        administrativeBoundaries: adminBoundariesDataResult,
        treeCoverageData: treeCoverageApiDataResult,
        soilTypeData: soilTypeApiDataResult,
        waterSourceData: waterSourceApiDataResult,
        industrialActivityData: industrialActivityApiDataResult,
      };
      const summaryOutput = await generateExecutiveSummary(executiveSummaryInput);
      setExecutiveSummary(summaryOutput);

      toast({ title: 'Report Generated', description: 'Property insights report has been successfully generated.' });
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setApiError(`Failed to generate report: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to generate report. ${errorMessage}`,
      });
      setExecutiveSummary(null); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAnyDataAvailable = executiveSummary || askingPrices || soldPrices || priceTrends || planningApplications || conservationAreas || schools || crimeRates || demographics || stampDuty || rentEstimates || soldPricesFloorArea || rentalComparables || epcData || floodRiskData || airQualityData || historicalClimateData || transportLinks || administrativeBoundaries || treeCoverageData || soilTypeData || waterSourceData || industrialActivityData;


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateReport)} className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 items-end">
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    {isClient ? (
                      <Input placeholder="e.g., SW1A 1AA" {...field} />
                    ) : (
                      <Skeleton className="h-10 w-full" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading || !isClient} className="mt-6 w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Report
          </Button>
           <p className="text-xs text-muted-foreground mt-2">
            PaTMa API calls (mocked) are subject to rate limits and credit costs. Data freshness depends on API's last_updated fields. Free tier APIs for Energy/Climate/Transport/MapIt may have their own rate limits. Mapbox static images API may require an access token. Ensure `PATMA_API_KEY` (if used directly by services) and `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` are set in your `.env` or `.env.local` file.
          </p>
        </form>
      </Form>

      {apiError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{apiError}</p>
        </div>
      )}
      
      {isLoading && !isAnyDataAvailable && (
         <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Generating your comprehensive property report...</p>
            <p className="text-sm text-muted-foreground">This may take a moment as we fetch and analyze data.</p>
        </div>
      )}


      {isAnyDataAvailable && (
        <div className="space-y-8">
            <ExecutiveSummary summaryData={executiveSummary} isLoading={isLoading && !executiveSummary} />
            <ValuationMarketAnalysis
              askingPrices={askingPrices}
              soldPrices={soldPrices}
              priceTrends={priceTrends}
              isLoading={isLoading && (!askingPrices || !soldPrices || !priceTrends)}
            />
            <PlanningRegulatory
              planningApplications={planningApplications}
              conservationAreas={conservationAreas}
              isLoading={isLoading && (!planningApplications || !conservationAreas)}
            />
            <NeighborhoodInsights
              schools={schools}
              crimeRates={crimeRates}
              demographics={demographics}
              isLoading={isLoading && (!schools || !crimeRates || !demographics)}
            />
            <EnergyClimateEnvironment
              epcData={epcData}
              floodRiskData={floodRiskData}
              airQualityData={airQualityData}
              historicalClimateData={historicalClimateData}
              treeCoverageData={treeCoverageData}
              soilTypeData={soilTypeData}
              waterSourceData={waterSourceData}
              industrialActivityData={industrialActivityData}
              isLoading={isLoading && (!epcData || !floodRiskData || !airQualityData || !historicalClimateData || !treeCoverageData || !soilTypeData || !waterSourceData || !industrialActivityData)}
            />
            <TransportLinks
              transportLinks={transportLinks}
              isLoading={isLoading && !transportLinks}
            />
            <FinancialFeasibility
              stampDuty={stampDuty}
              rentEstimates={rentEstimates}
              propertyPrice={submittedPropertyPrice} 
              isLoading={isLoading && (!stampDuty || !rentEstimates)}
            />
            <CaseStudies
              soldPricesFloorArea={soldPricesFloorArea}
              rentalComparables={rentalComparables}
              isLoading={isLoading && (!soldPricesFloorArea || !rentalComparables)}
            />
             <MapLocation 
              postcode={submittedPostcode} 
              administrativeBoundaries={administrativeBoundaries}
              conservationAreas={conservationAreas}
              floodRiskData={floodRiskData}
              isLoading={isLoading && (!submittedPostcode || !administrativeBoundaries)} 
            />
        </div>
      )}
      
      {!isLoading && !isAnyDataAvailable && !apiError && (
        <div className="text-center py-12">
          <Image src="https://picsum.photos/seed/property/400/300" alt="Property Illustration" data-ai-hint="property illustration" className="mx-auto mb-6 rounded-lg shadow-md" width={400} height={300} />
          <h2 className="text-2xl font-semibold text-primary mb-2">Welcome to Property Insights Pro</h2>
          <p className="text-muted-foreground">Enter a postcode above to generate your detailed redevelopment potential report. Ensure relevant API keys (e.g., `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`) are set in your environment configuration.</p>
        </div>
      )}
    </div>
  );
}

    