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

import { ExecutiveSummary } from './property-insights/executive-summary';
import { ValuationMarketAnalysis } from './property-insights/valuation-market-analysis';
import { PlanningRegulatory } from './property-insights/planning-regulatory';
import { NeighborhoodInsights } from './property-insights/neighborhood-insights';
import { FinancialFeasibility } from './property-insights/financial-feasibility';
import { CaseStudies } from './property-insights/case-studies';

import {
  getAskingPrices, getSoldPrices, getPriceTrends, getPlanningApplications,
  getConservationAreas, getSchools, getCrimeRates, getDemographics,
  getStampDuty, getRentEstimates, getSoldPricesFloorArea, getRentalComparables,
  type AskingPrice, type SoldPrice, type PriceTrends, type PlanningApplication,
  type ConservationArea, type School, type CrimeRates as CrimeRatesData, type Demographics as DemographicsData,
  type StampDuty as StampDutyData, type RentEstimates as RentEstimatesData, type SoldPricesFloorArea as SoldPricesFloorAreaData, type RentalComparables as RentalComparablesData
} from '@/services/patma';
import { generateExecutiveSummary, type GenerateExecutiveSummaryInput, type GenerateExecutiveSummaryOutput } from '@/ai/flows/generate-executive-summary';

const formSchema = z.object({
  postcode: z.string().min(3, { message: 'Postcode must be at least 3 characters.' }).regex(/^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$/i, { message: 'Invalid UK postcode format.'}),
  propertyPrice: z.coerce.number().positive({ message: 'Property price must be a positive number.' }),
  apiKey: z.string().min(1, {message: "PaTMa API Key is required."})
});

type FormValues = z.infer<typeof formSchema>;

export function PropertyInsightsDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // State for API data
  const [executiveSummary, setExecutiveSummary] = useState<GenerateExecutiveSummaryOutput | null>(null);
  const [askingPrices, setAskingPrices] = useState<AskingPrice[] | null>(null);
  const [soldPrices, setSoldPrices] = useState<SoldPrice[] | null>(null);
  const [priceTrends, setPriceTrends] = useState<PriceTrends[] | null>(null);
  const [planningApplications, setPlanningApplications] = useState<PlanningApplication[] | null>(null);
  const [conservationAreas, setConservationAreas] = useState<ConservationArea[] | null>(null);
  const [schools, setSchools] = useState<School[] | null>(null);
  const [crimeRates, setCrimeRates] = useState<CrimeRatesData[] | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData[] | null>(null);
  const [stampDuty, setStampDuty] = useState<StampDutyData | null>(null);
  const [rentEstimates, setRentEstimates] = useState<RentEstimatesData | null>(null);
  const [soldPricesFloorArea, setSoldPricesFloorArea] = useState<SoldPricesFloorAreaData[] | null>(null);
  const [rentalComparables, setRentalComparables] = useState<RentalComparablesData[] | null>(null);
  
  const [currentPropertyPrice, setCurrentPropertyPrice] = useState<number | undefined>(undefined);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postcode: '',
      propertyPrice: undefined,
      apiKey: '',
    },
  });

  // Store API key in localStorage (simple approach for this hackathon)
  useEffect(() => {
    const storedApiKey = localStorage.getItem('patmaApiKey');
    if (storedApiKey) {
      form.setValue('apiKey', storedApiKey);
    }
  }, [form]);

  const handleGenerateReport: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setCurrentPropertyPrice(data.propertyPrice);

    // Store API key
    localStorage.setItem('patmaApiKey', data.apiKey);
    // TODO: In a real app, PATMA_API_KEY would be set on the server-side or via a secure config.
    // For this example, we'll just acknowledge it's provided.
    // Assume services/patma.ts can somehow access this key or it's passed appropriately.
    // For now, the services use mock data and don't need the key.

    try {
      // Simulate API call delay and rate limiting awareness
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      let callCount = 0;
      const maxCallsPerMinute = 10;
      const callInterval = 60000 / maxCallsPerMinute; // ~6 seconds per call

      const fetchDataWithRateLimit = async <T>(fetchFn: () => Promise<T>): Promise<T> => {
        if (callCount > 0) await delay(callInterval); // Basic rate limiting
        callCount++;
        return fetchFn();
      };
      
      // Fetch all data in parallel (or sequence with rate limiting)
      const [
        askingPricesData, soldPricesData, priceTrendsData, planningApplicationsData,
        conservationAreasData, schoolsData, crimeRatesData, demographicsData,
        stampDutyData, rentEstimatesData, soldPricesFloorAreaData, rentalComparablesData
      ] = await Promise.all([
        fetchDataWithRateLimit(() => getAskingPrices(data.postcode)),
        fetchDataWithRateLimit(() => getSoldPrices(data.postcode)),
        fetchDataWithRateLimit(() => getPriceTrends(data.postcode)),
        fetchDataWithRateLimit(() => getPlanningApplications(data.postcode)),
        fetchDataWithRateLimit(() => getConservationAreas(data.postcode)),
        fetchDataWithRateLimit(() => getSchools(data.postcode)),
        fetchDataWithRateLimit(() => getCrimeRates(data.postcode)),
        fetchDataWithRateLimit(() => getDemographics(data.postcode)),
        fetchDataWithRateLimit(() => getStampDuty(data.propertyPrice)),
        fetchDataWithRateLimit(() => getRentEstimates(data.postcode)),
        fetchDataWithRateLimit(() => getSoldPricesFloorArea(data.postcode)),
        fetchDataWithRateLimit(() => getRentalComparables(data.postcode)),
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
      
      // Generate Executive Summary
      const executiveSummaryInput: GenerateExecutiveSummaryInput = {
        postcode: data.postcode,
        propertyPrice: data.propertyPrice,
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAnyDataAvailable = executiveSummary || askingPrices || soldPrices || priceTrends || planningApplications || conservationAreas || schools || crimeRates || demographics || stampDuty || rentEstimates || soldPricesFloorArea || rentalComparables;


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateReport)} className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SW1A 1AA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Asking Price (£)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PaTMa API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your PaTMa API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-6 w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Report
          </Button>
           <p className="text-xs text-muted-foreground mt-2">
            PaTMa API calls are subject to rate limits (typically 10 calls/minute) and credit costs (£0.002–£0.008 per call). Data freshness depends on PaTMa's last_updated fields.
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
            currentAskingPrice={currentPropertyPrice}
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
          <FinancialFeasibility
            stampDuty={stampDuty}
            rentEstimates={rentEstimates}
            propertyPrice={currentPropertyPrice}
            isLoading={isLoading && (!stampDuty || !rentEstimates)}
          />
          <CaseStudies
            soldPricesFloorArea={soldPricesFloorArea}
            rentalComparables={rentalComparables}
            isLoading={isLoading && (!soldPricesFloorArea || !rentalComparables)}
          />
        </div>
      )}
      
      {!isLoading && !isAnyDataAvailable && !apiError && (
        <div className="text-center py-12">
          <img src="https://picsum.photos/seed/property/400/300" alt="Property Illustration" data-ai-hint="property illustration" className="mx-auto mb-6 rounded-lg shadow-md" />
          <h2 className="text-2xl font-semibold text-primary mb-2">Welcome to Property Insights Pro</h2>
          <p className="text-muted-foreground">Enter a postcode and property price above to generate your detailed redevelopment potential report.</p>
        </div>
      )}
    </div>
  );
}
