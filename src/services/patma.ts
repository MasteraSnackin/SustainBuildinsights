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
  // TODO: Implement this by calling the PaTMa API.
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
  // TODO: Implement this by calling the PaTMa API.
  // Mock data to represent 5 years of trends, monthly data points
  const today = new Date();
  const trends: PriceTrends[] = [];
  for (let i = 0; i < 60; i++) { // 5 years * 12 months
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    trends.push({
      averagePrice: 475000 - (i * 1000) + (Math.random() * 20000 - 10000), // Simulate some fluctuation
      date: date.toISOString().split('T')[0],
    });
  }
  return trends.reverse(); // Ensure chronological order
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
  // TODO: Implement this by calling the PaTMa API.
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
  // TODO: Implement this by calling the PaTMa API.
  // Simplified calculation for mock
  let amount = 0;
  if (price > 250000) {
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
  // TODO: Implement this by calling the PaTMa API.
  return {
    averageRent: 1500 + (Math.random() * 500 - 250), // Simulate some variance
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
   * The date the property was sold (added for consistency, though not strictly required by user for this specific mock)
   */
  date: string;
}

/**
 * Retrieves sold prices with floor area for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of SoldPricesFloorArea objects.
 */
export async function getSoldPricesFloorArea(postcode: string): Promise<SoldPricesFloorArea[]> {
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
   * Property type (added for more realistic data)
   */
  propertyType: string;
  /**
   * Number of bedrooms (added for more realistic data)
   */
  bedrooms: number;
}

/**
 * Retrieves rental comparables for a given postcode.
 * @param postcode The postcode to search for.
 * @returns A promise that resolves to an array of RentalComparables objects.
 */
export async function getRentalComparables(postcode: string): Promise<RentalComparables[]> {
  // TODO: Implement this by calling the PaTMa API.
  return [
    { averageRent: 1600, propertyType: 'Flat', bedrooms: 2 },
    { averageRent: 1450, propertyType: 'Terraced House', bedrooms: 3 },
    { averageRent: 1750, propertyType: 'Semi-Detached', bedrooms: 3 },
  ];
}
