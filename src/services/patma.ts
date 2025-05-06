/**
 * Represents the asking price of a property.
 */
export interface AskingPrice {
  /**
   * The price of the property.
   */
  price: number;
  /**
   * The date the property was listed.
   */
  date: string;
}

/**
 * Retrieves asking prices for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of AskingPrice objects.
 */
export async function getAskingPrices(postcode: string): Promise<AskingPrice[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API using apiKey.
  const today = new Date();
  return [
    { price: 500000, date: today.toISOString().split('T')[0] },
    { price: 495000, date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0] },
    { price: 480000, date: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split('T')[0] },
    { price: 470000, date: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()).toISOString().split('T')[0] },
    { price: 460000, date: new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0] },
    { price: 450000, date: new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0] },
     { price: 440000, date: new Date(today.getFullYear() - 6, today.getMonth(), today.getDate()).toISOString().split('T')[0] }, // Older than 5 years
  ];
}

/**
 * Represents the sold price of a property.
 */
export interface SoldPrice {
  /**
   * The price the property was sold for.
   */
  price: number;
  /**
   * The date the property was sold.
   */
  date: string;
}

/**
 * Retrieves sold prices for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of SoldPrice objects.
 */
export async function getSoldPrices(postcode: string): Promise<SoldPrice[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  const today = new Date();
  return [
    { price: 485000, date: new Date(today.getFullYear(), today.getMonth() -1, today.getDate()).toISOString().split('T')[0] },
    { price: 475000, date: new Date(today.getFullYear() - 1, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] },
    { price: 460000, date: new Date(today.getFullYear() - 2, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] },
    { price: 450000, date: new Date(today.getFullYear() - 3, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] },
    { price: 440000, date: new Date(today.getFullYear() - 4, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] },
    { price: 430000, date: new Date(today.getFullYear() - 5, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] },
    { price: 420000, date: new Date(today.getFullYear() - 6, today.getMonth()-1, today.getDate()).toISOString().split('T')[0] }, // Older than 5 years
  ];
}

/**
 * Represents price trends for a given postcode.
 */
export interface PriceTrends {
  /**
   * The average price for the postcode.
   */
  averagePrice: number;
  /**
   * The date the price was recorded.
   */
  date: string;
}

/**
 * Retrieves price trends for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of PriceTrends objects.
 */
export async function getPriceTrends(postcode: string): Promise<PriceTrends[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  const today = new Date();
  const trends: PriceTrends[] = [];
  for (let i = 0; i < 60; i++) { // 60 months = 5 years
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    trends.push({
      averagePrice: 475000 - (i * 1000) + (Math.random() * 20000 - 10000), // Simulate some fluctuation
      date: date.toISOString().split('T')[0],
    });
  }
  return trends.reverse(); // Return in chronological order
}

/**
 * Represents a planning application.
 */
export interface PlanningApplication {
  /**
   * The application ID.
   */
  applicationId: string;
  /**
   * The status of the application.
   */
  status: string;
  /**
   * The date of the application.
   */
  date: string;
  /**
   * A brief description or proposal of the planning application.
   */
  description: string;
}

/**
 * Retrieves planning applications for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of PlanningApplication objects.
 */
export async function getPlanningApplications(postcode: string): Promise<PlanningApplication[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  const today = new Date();
  return [
    { applicationId: 'PA/24/00123', status: 'approved', date: today.toISOString().split('T')[0], description: 'Rear extension' },
    { applicationId: 'PA/23/00456', status: 'rejected', date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'Loft conversion with dormer' },
    { applicationId: 'PA/22/00789', status: 'approved', date: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'Change of use from C3 to C4 (HMO)' },
    { applicationId: 'PA/21/00101', status: 'approved', date: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'New build dwelling in garden' },
    { applicationId: 'PA/20/00112', status: 'pending', date: new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'Garage conversion' },
    { applicationId: 'PA/19/00131', status: 'approved', date: new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'Two storey side extension' },
    { applicationId: 'PA/18/00145', status: 'rejected', date: new Date(today.getFullYear() - 6, today.getMonth(), today.getDate()).toISOString().split('T')[0], description: 'Demolition and rebuild' }, // Older than 5 years
  ];
}

/**
 * Represents a conservation area.
 */
export interface ConservationArea {
  /**
   * The name of the conservation area.
   */
  name: string;
}

/**
 * Retrieves conservation areas for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of ConservationArea objects.
 */
export async function getConservationAreas(postcode: string): Promise<ConservationArea[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  // This mock returns the same data regardless of postcode for simplicity.
  return [
    {
      name: 'Test Conservation Area',
    },
    {
      name: 'Another Local Conservation Zone',
    }
  ];
}

/**
 * Represents a school.
 */
export interface School {
  /**
   * The name of the school.
   */
  name: string;
  /**
   * The Ofsted rating of the school.
   */
  ofstedRating: string;
}

/**
 * Retrieves schools for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of School objects.
 */
export async function getSchools(postcode: string): Promise<School[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  return [
    {
      name: 'Primary School Alpha',
      ofstedRating: 'Good',
    },
    {
      name: 'Secondary School Beta',
      ofstedRating: 'Outstanding',
    },
    {
      name: 'Independent School Gamma',
      ofstedRating: 'Requires Improvement',
    }
  ];
}

/**
 * Represents crime rates.
 */
export interface CrimeRates {
  /**
   * The type of crime.
   */
  type: string;
  /**
   * The rate of crime.
   */
  rate: number;
}

/**
 * Retrieves crime rates for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of CrimeRates objects.
 */
export async function getCrimeRates(postcode: string): Promise<CrimeRates[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  return [
    { type: 'Burglary', rate: 10 },
    { type: 'Vehicle crime', rate: 15 },
    { type: 'Anti-social behaviour', rate: 25 },
    { type: 'Violence and sexual offences', rate: 8 },
    { type: 'Other theft', rate: 12 },
  ];
}

/**
 * Represents demographics.
 */
export interface Demographics {
  /**
   * The age of the demographic.
   */
  age: string;
  /**
   * The income of the demographic.
   */
  income: number;
}

/**
 * Retrieves demographics for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of Demographics objects.
 */
export async function getDemographics(postcode: string): Promise<Demographics[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  return [
    { age: '18-24', income: 25000 },
    { age: '25-34', income: 35000 },
    { age: '35-44', income: 45000 },
    { age: '45-54', income: 50000 },
    { age: '55-64', income: 40000 },
    { age: '65+', income: 30000 },
  ];
}

/**
 * Represents stamp duty.
 */
export interface StampDuty {
  /**
   * The stamp duty amount.
   */
  amount: number;
}

/**
 * Retrieves stamp duty for a given property price.
 * @param price The price of the property.
 * @returns A promise that resolves to a StampDuty object.
 */
export async function getStampDuty(price: number): Promise<StampDuty> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  // Simplified SDLT calculation for England/NI first-time buyer (example)
  let amount = 0;
  if (price > 250000) { // Nil rate band up to £250k
    amount += (Math.min(price, 925000) - 250000) * 0.05;
  }
  if (price > 925000) {
    amount += (Math.min(price, 1500000) - 925000) * 0.10;
  }
  if (price > 1500000) {
    amount += (price - 1500000) * 0.12;
  }
  return {
    amount: Math.round(amount),
  };
}

/**
 * Represents rent estimates.
 */
export interface RentEstimates {
  /**
   * The average rent.
   */
  averageRent: number;
}

/**
 * Retrieves rent estimates for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to a RentEstimates object.
 */
export async function getRentEstimates(postcode: string): Promise<RentEstimates> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  return {
    averageRent: 1500 + (Math.random() * 500 - 250), // Simulate some fluctuation
  };
}

/**
 * Represents sold prices with floor area.
 */
export interface SoldPricesFloorArea {
  /**
   * The price per floor area.
   */
  pricePerFloorArea: number;
  /**
   * The date the property was sold 
   */
  date: string;
}

/**
 * Retrieves sold prices with floor area for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of SoldPricesFloorArea objects.
 */
export async function getSoldPricesFloorArea(postcode: string): Promise<SoldPricesFloorArea[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  const today = new Date();
  return [
    { pricePerFloorArea: 2000, date: new Date(today.getFullYear() - 0, today.getMonth() - 2, 15).toISOString().split('T')[0] },
    { pricePerFloorArea: 1950, date: new Date(today.getFullYear() - 1, today.getMonth() - 5, 10).toISOString().split('T')[0] },
    { pricePerFloorArea: 2100, date: new Date(today.getFullYear() - 2, today.getMonth() - 8, 20).toISOString().split('T')[0] },
  ];
}

/**
 * Represents rental comparables.
 */
export interface RentalComparables {
  /**
   * The average rent.
   */
  averageRent: number;
  /**
   * Property type 
   */
  propertyType: string;
  /**
   * Number of bedrooms 
   */
  bedrooms: number;
}

/**
 * Retrieves rental comparables for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of RentalComparables objects.
 */
export async function getRentalComparables(postcode: string): Promise<RentalComparables[]> {
  // const apiKey = process.env.PATMA_API_KEY;
  // if (!apiKey) throw new Error("PaTMa API Key not configured in .env");
  // TODO: Implement this by calling the PaTMa API.
  return [
    { averageRent: 1600, propertyType: 'Flat', bedrooms: 2 },
    { averageRent: 1450, propertyType: 'Terraced House', bedrooms: 3 },
    { averageRent: 1750, propertyType: 'Semi-Detached', bedrooms: 3 },
  ];
}


/**
 * Represents Energy Performance Certificate (EPC) data.
 */
export interface EpcData {
  currentRating: string;
  potentialRating: string;
  currentScore: number;
  potentialScore: number;
  assessmentDate: string;
  reportUrl?: string;
}

/**
 * Retrieves EPC data for a given postcode or property identifier.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to EpcData or null if not found.
 */
export async function getEpcData(postcode: string): Promise<EpcData | null> {
  // const apiKey = process.env.PATMA_API_KEY; // Or specific API key for EPC service
  // if (!apiKey) console.warn("EPC API Key not configured"); // Or throw error
  // TODO: Implement by calling a free EPC API (e.g., Open EPB Register, though access might be restricted)
  // This mock returns random but plausible EPC data.
  const today = new Date();
  const ratings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const currentRating = ratings[Math.floor(Math.random() * ratings.length)];
  const potentialRating = ratings[Math.max(0, ratings.indexOf(currentRating) - Math.floor(Math.random() * 2))]; // Potential is usually better or same

  return {
    currentRating,
    potentialRating,
    currentScore: Math.floor(Math.random() * 80) + 20, // Score between 20 and 100
    potentialScore: Math.floor(Math.random() * (100 - (ratings.indexOf(potentialRating) * 10))) + (ratings.indexOf(potentialRating) * 10 + 5),
    assessmentDate: new Date(today.getFullYear() - Math.floor(Math.random() * 5), today.getMonth(), today.getDate()).toISOString().split('T')[0],
    reportUrl: `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodeURIComponent(postcode)}` // Example link
  };
}

/**
 * Represents Flood Risk data.
 */
export interface FloodRiskData {
  riversAndSea: string;
  surfaceWater: string;
  reservoirs?: string; // Some areas might not have reservoir risk
  detailsUrl?: string;
}

/**
 * Retrieves flood risk data for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to FloodRiskData or null if not found.
 */
export async function getFloodRiskData(postcode: string): Promise<FloodRiskData | null> {
  // const apiKey = process.env.FLOOD_API_KEY; // Or specific API key for Flood service
  // if (!apiKey) console.warn("Flood API Key not configured");
  // TODO: Implement by calling a free Flood Risk API (e.g., UK government APIs)
  // This mock returns random risk levels.
  const riskLevels = ["Very Low", "Low", "Medium", "High"];
  return {
    riversAndSea: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    surfaceWater: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    reservoirs: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    detailsUrl: `https://check-long-term-flood-risk.service.gov.uk/postcode?postcode=${encodeURIComponent(postcode)}` // Example link
  };
}

/**
 * Represents Air Quality data.
 */
export interface AirQualityData {
  aqi: number;
  dominantPollutant?: string;
  category: string;
  lastUpdated: string;
}

/**
 * Retrieves air quality data for a given postcode or coordinates.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to AirQualityData or null if not found.
 */
export async function getAirQualityData(postcode: string): Promise<AirQualityData | null> {
  // const apiKey = process.env.AQ_API_KEY; // Or specific API key for Air Quality service
  // if (!apiKey) console.warn("Air Quality API Key not configured");
  // TODO: Implement by calling a free Air Quality API (e.g., OpenAQ, Defra UK-AIR)
  // This mock returns random AQI data.
  const today = new Date();
  const aqiValue = Math.floor(Math.random() * 150) + 10; // AQI between 10 and 160
  let category = "Good";
  if (aqiValue > 50 && aqiValue <=100) category = "Moderate";
  else if (aqiValue > 100) category = "Unhealthy for Sensitive Groups";

  return {
    aqi: aqiValue,
    dominantPollutant: ["PM2.5", "O3", "NO2"][Math.floor(Math.random() * 3)],
    category,
    lastUpdated: today.toISOString()
  };
}

/**
 * Represents Historical Climate data.
 */
export interface HistoricalClimateData {
  averageAnnualRainfallMm: number;
  averageAnnualMeanTempC: number;
  averageSunshineHoursPerDay?: number;
  averageWindSpeedMph?: number;
  dataYears?: number; // e.g., based on 30-year average
  source?: string;
}

/**
 * Retrieves historical climate data for a given postcode or region.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to HistoricalClimateData or null if not found.
 */
export async function getHistoricalClimateData(postcode: string): Promise<HistoricalClimateData | null> {
  // const apiKey = process.env.CLIMATE_API_KEY; // Or specific API key for Climate service
  // if (!apiKey) console.warn("Climate API Key not configured");
  // TODO: Implement by calling a free climate data API (e.g., Met Office, WorldClim for broader data)
  // This mock provides generalized UK averages.
  return {
    averageAnnualRainfallMm: Math.floor(Math.random() * 400) + 800, // e.g., 800-1200mm
    averageAnnualMeanTempC: parseFloat((Math.random() * 5 + 8).toFixed(1)), // e.g., 8-13°C
    averageSunshineHoursPerDay: parseFloat((Math.random() * 2 + 3).toFixed(1)), // e.g., 3-5 hours
    averageWindSpeedMph: parseFloat((Math.random() * 5 + 8).toFixed(1)), // e.g., 8-13 mph
    dataYears: 30,
    source: "Mock Climate Data Service (General UK Averages)"
  };
}


/**
 * Represents a transport link.
 */
export interface TransportLink {
  type: string; // e.g., "Train Station", "Bus Stop", "Motorway Access"
  name: string; // e.g., "King's Cross Station", "Stop ID: 490008660N", "M25 J10"
  distanceMiles: number;
  journeyTimeToHub?: string; // e.g., "London Bridge: 15 mins", "City Centre: 10 mins"
}

/**
 * Retrieves transport links for a given postcode.
 * This is a mock implementation. Real-life data would require integrating with
 * transport APIs like TransportAPI (UK), Google Maps Directions API, Citymapper API, etc.
 * These APIs often have usage costs and specific query requirements (e.g., coordinates).
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of TransportLink objects or null.
 */
export async function getTransportLinks(postcode: string): Promise<TransportLink[] | null> {
  // const transportApiKey = process.env.TRANSPORT_API_KEY;
  // if (!transportApiKey) console.warn("Transport API Key not configured. Using mock data.");

  // In a real application:
  // 1. Geocode the postcode to get latitude/longitude.
  // 2. Use these coordinates to query a transport API.
  //    - Example (TransportAPI - requires registration and key):
  //      `https://transportapi.com/v3/uk/places.json?lat={lat}&lon={lon}&type=bus_stop,train_station&app_id={APP_ID}&app_key={API_KEY}`
  //    - Example (Google Maps Places API - Nearby Search, requires API key and billing):
  //      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius=1500&type=bus_station|train_station|subway_station&key={YOUR_API_KEY}`
  // 3. Parse the API response to create TransportLink objects.
  // 4. For journey times, you might need to use a Directions API.

  // Mock data based on postcode prefix (simplified)
  if (postcode.startsWith("SW1A")) { // Central London example
    return [
      { type: "Train Station", name: "Charing Cross Station", distanceMiles: 0.5, journeyTimeToHub: "Various London Termini" },
      { type: "Tube Station", name: "Westminster Station", distanceMiles: 0.3, journeyTimeToHub: "Multiple Lines" },
      { type: "Bus Stop", name: "Trafalgar Square (Stop T)", distanceMiles: 0.2 },
      { type: "Motorway Access", name: "M4 J1 (via A4)", distanceMiles: 8.0 },
    ];
  } else if (postcode.startsWith("M1")) { // Manchester example
     return [
      { type: "Train Station", name: "Manchester Piccadilly", distanceMiles: 1.2, journeyTimeToHub: "London Euston: 2hr 10m" },
      { type: "Tram Stop", name: "Piccadilly Gardens Metrolink", distanceMiles: 1.0 },
      { type: "Bus Stop", name: "Various on Portland Street", distanceMiles: 0.8 },
      { type: "Motorway Access", name: "M602 J3", distanceMiles: 2.5 },
    ];
  }
  // Generic mock data
  return [ 
    { type: "Train Station", name: "Local Mainline Station", distanceMiles: 2.1, journeyTimeToHub: "City Centre: 25 mins" },
    { type: "Bus Stop", name: "High Street (Stop B)", distanceMiles: 0.4 },
    { type: "Motorway Access", name: "M0 J5", distanceMiles: 3.5 },
  ];
}

/**
 * Represents administrative boundary information for a postcode.
 */
export interface AdministrativeBoundaries {
  latitude: number;
  longitude: number;
  localAuthority: string;
  council: string; // Often same as local authority in UK unitary authorities
  constituency: string; // Parliamentary constituency
  ward: string; // Local council ward
  country: string; // e.g., England, Scotland, Wales, Northern Ireland
}

/**
 * Retrieves administrative boundaries for a given postcode using a service like MapIt.
 * This is a mock implementation. Real-life data would require integrating with MapIt API or similar.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to AdministrativeBoundaries or null if not found.
 */
export async function getAdministrativeBoundaries(postcode: string): Promise<AdministrativeBoundaries | null> {
  // const mapitApiKey = process.env.MAPIT_API_KEY;
  // if (!mapitApiKey) console.warn("MapIt API Key not configured. Using mock data.");
  
  // In a real application:
  // 1. Construct URL for MapIt API: `https://mapit.mysociety.org/postcode/{POSTCODE}.json?api_key={YOUR_API_KEY}`
  // 2. Fetch data from the API.
  // 3. Parse the JSON response to extract relevant fields (e.g., WGS84_lat, WGS84_lon, areas).
  //    MapIt returns areas with types like 'LBO' (London Borough), 'CTY' (County), 'DIS' (District),
  //    'WMC' (Westminster Constituency), 'EUR' (European Electoral Region - less relevant now), etc.
  //    You'll need to map these to the fields in the AdministrativeBoundaries interface.

  // Mock data based on postcode prefix (simplified)
  const normalizedPostcode = postcode.toUpperCase().replace(/\s+/g, '');

  if (normalizedPostcode === 'SW1A1AA') { // Buckingham Palace
    return {
      latitude: 51.5014,
      longitude: -0.1419,
      localAuthority: 'Westminster City Council',
      council: 'Westminster City Council',
      constituency: 'Cities of London and Westminster',
      ward: 'St James\'s',
      country: 'England',
    };
  } else if (normalizedPostcode === 'M11AE') { // Central Manchester
    return {
      latitude: 53.4765,
      longitude: -2.2309,
      localAuthority: 'Manchester City Council',
      council: 'Manchester City Council',
      constituency: 'Manchester Central',
      ward: 'Piccadilly',
      country: 'England',
    };
  } else if (normalizedPostcode.startsWith('EH1')) { // Central Edinburgh
     return {
      latitude: 55.9500,
      longitude: -3.1890,
      localAuthority: 'City of Edinburgh Council',
      council: 'City of Edinburgh Council',
      constituency: 'Edinburgh North and Leith',
      ward: 'City Centre',
      country: 'Scotland',
    };
  }

  // Generic mock data
  return {
    latitude: 52.4797 + (Math.random() * 0.1 - 0.05), // Randomish coords near Birmingham
    longitude: -1.90269 + (Math.random() * 0.1 - 0.05),
    localAuthority: 'Generic District Council',
    council: 'Generic County Council',
    constituency: 'Generic Constituency',
    ward: 'Generic Ward',
    country: 'United Kingdom (Mock)',
  };
}


/** Represents tree coverage data */
export interface TreeCoverageData {
  coveragePercentage: number;
  dominantSpecies?: string[]; // e.g., ["Oak", "Ash"]
  lastUpdated: string; // ISO date string
  sourceUrl?: string;
}

/**
 * Retrieves tree coverage data for a given postcode or area.
 * Mock implementation. Real data might come from sources like Forest Research (UK) or Copernicus Land Monitoring Service (Europe).
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to TreeCoverageData or null.
 */
export async function getTreeCoverageData(postcode: string): Promise<TreeCoverageData | null> {
  // const treeApiKey = process.env.TREE_API_KEY; 
  // if (!treeApiKey) console.warn("Tree API Key not configured. Using mock data.");
  // TODO: Integrate with a real API for tree coverage if available and suitable for free use.
  // For example, some local councils might publish tree data.
  return {
    coveragePercentage: parseFloat((Math.random() * 30 + 5).toFixed(1)), // Random percentage between 5% and 35%
    dominantSpecies: [['Oak', 'Ash', 'Beech'], ['Pine', 'Birch'], ['Sycamore', 'Lime']][Math.floor(Math.random() * 3)],
    lastUpdated: new Date(new Date().getFullYear() - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1).toISOString(),
    sourceUrl: 'https://www.forestresearch.gov.uk/tools-and-resources/urban-tree-cover-map/' // Example source
  };
}

/** Represents soil type data */
export interface SoilTypeData {
  primarySoilType: string; // e.g., "Loamy", "Clayey", "Sandy"
  soilPh?: number; // e.g., 6.5
  drainageClass?: string; // e.g., "Well-drained", "Poorly-drained"
  agriculturalPotential?: string; // e.g., "Grade 1", "Grade 3b"
  sourceUrl?: string;
}

/**
 * Retrieves soil type data for a given postcode or area.
 * Mock implementation. Real data from sources like UKSO (UK Soil Observatory) or EU Soil Data Centre.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to SoilTypeData or null.
 */
export async function getSoilTypeData(postcode: string): Promise<SoilTypeData | null> {
  // const soilApiKey = process.env.SOIL_API_KEY; 
  // if (!soilApiKey) console.warn("Soil API Key not configured. Using mock data.");
  // TODO: Integrate with a real API for soil data. Many are complex geospatial datasets.
  const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Peaty', 'Chalky', 'Silty'];
  const drainage = ['Well-drained', 'Moderately well-drained', 'Poorly-drained', 'Very poorly-drained'];
  return {
    primarySoilType: soilTypes[Math.floor(Math.random() * soilTypes.length)],
    soilPh: parseFloat((Math.random() * 3 + 5.5).toFixed(1)), // pH between 5.5 and 8.5
    drainageClass: drainage[Math.floor(Math.random() * drainage.length)],
    agriculturalPotential: `Grade ${Math.floor(Math.random()*3)+1}${['a','b',''][Math.floor(Math.random()*3)]}`, // e.g. Grade 1, 2a, 3b
    sourceUrl: 'http://www.landis.org.uk/services/ukso.cfm' // Example source
  };
}

/** Represents local water source data */
export interface WaterSourceData {
  nearestRiverName?: string;
  nearestRiverDistanceKm?: number;
  groundwaterAvailability?: string; // e.g., "High", "Moderate", "Low"
  waterQuality?: string; // e.g., "Good", "Fair", "Poor" (referring to local water bodies)
  sourceUrl?: string;
}

/**
 * Retrieves water source data for a given postcode or area.
 * Mock implementation. Real data from Environment Agency (UK) or SEPA (Scotland).
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to WaterSourceData or null.
 */
export async function getWaterSourceData(postcode: string): Promise<WaterSourceData | null> {
  // const waterApiKey = process.env.WATER_API_KEY; 
  // if (!waterApiKey) console.warn("Water API Key not configured. Using mock data.");
  // TODO: Integrate with APIs like Environment Agency's Catchment Data Explorer.
  const rivers = ['River Thames', 'River Severn', 'River Trent', 'River Ouse', 'Local Brook'];
  return {
    nearestRiverName: rivers[Math.floor(Math.random() * rivers.length)],
    nearestRiverDistanceKm: parseFloat((Math.random() * 5 + 0.5).toFixed(1)), // Distance 0.5 to 5.5 km
    groundwaterAvailability: ['High', 'Moderate', 'Low'][Math.floor(Math.random() * 3)],
    waterQuality: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
    sourceUrl: 'https://environment.data.gov.uk/catchment-planning/' // Example source
  };
}

/** Represents nearby industrial activity data */
export interface IndustrialActivityData {
  hasMajorIndustrialZones: boolean;
  majorActivities?: string[]; // e.g., ["Manufacturing", "Logistics"]
  proximityToSensitiveSitesKm?: number; // Distance to nearest sensitive site (e.g., school, hospital)
  sourceUrl?: string;
}

/**
 * Retrieves nearby industrial activity data for a given postcode or area.
 * Mock implementation. Real data from local council planning portals or specific industrial datasets.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to IndustrialActivityData or null.
 */
export async function getIndustrialActivityData(postcode: string): Promise<IndustrialActivityData | null> {
  // const industrialApiKey = process.env.INDUSTRIAL_API_KEY; 
  // if (!industrialApiKey) console.warn("Industrial API Key not configured. Using mock data.");
  // TODO: Integrate with real APIs or datasets, which can be very specific and localized.
  const hasZones = Math.random() > 0.6; // 40% chance of having major industrial zones nearby
  return {
    hasMajorIndustrialZones: hasZones,
    majorActivities: hasZones ? [['Manufacturing', 'Logistics'], ['Chemical Processing'], ['Warehousing', 'Distribution']][Math.floor(Math.random()*3)] : undefined,
    proximityToSensitiveSitesKm: hasZones ? parseFloat((Math.random() * 2 + 0.5).toFixed(1)) : undefined, // Distance 0.5 to 2.5 km if zones exist
    sourceUrl: 'https://www.gov.uk/government/collections/industrial-strategy-building-a-britain-fit-for-the-future' // General example source
  };
}
