// Types for better type safety
export interface PopulationData {
  year: number;
  month: string;
  state: string;
  gender: string;
  value: number;
  unit: string;
  note: string;
}

export interface ProcessedData {
  rawData: PopulationData[];
  topStates: Array<{ state: string; population: number }>;
  genderDistribution: Array<{ gender: string; value: number; percentage: string }>;
  yearlyTrends: Array<{ year: number; Male: number; Female: number }>;
  monthlyDistribution: Array<{ month: string; value: number }>;
  stateGenderGaps: Array<{ state: string; male: number; female: number; gap: number; gapPercentage: string }>;
  insights: {
    totalPopulation: string;
    topState: string;
    yearRange: string;
    peakMonth: string;
    dominantGender: string;
    insights: string[];
  } | null;
  availableFilters: {
    years: number[];
    months: string[];
    states: string[];
    genders: string[];
  };
}

export interface FilterOptions {
  years: number[];
  months: string[];
  states: string[];
  genders: string[];
}

// CSV parsing with validation and error handling
export function parseCSV(csvText: string): PopulationData[] {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',');
    const expectedHeaders = ['year', 'month', 'state', 'gender', 'value', 'unit', 'note'];
    
    if (headers.length < 5) {
      throw new Error('CSV file has insufficient columns');
    }

    const data: PopulationData[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',');
        if (values.length < 5) {
          errors.push(`Line ${i + 1}: Insufficient columns`);
          continue;
        }

        const year = parseInt(values[0]);
        const value = parseInt(values[4]);

        if (isNaN(year) || isNaN(value)) {
          errors.push(`Line ${i + 1}: Invalid numeric values`);
          continue;
        }

        if (year < 1900 || year > 2100) {
          errors.push(`Line ${i + 1}: Year out of reasonable range`);
          continue;
        }

        data.push({
          year,
          month: values[1]?.trim() || '',
          state: values[2]?.trim() || '',
          gender: values[3]?.trim() || '',
          value,
          unit: values[5]?.trim() || '',
          note: values[6]?.trim() || ''
        });
      } catch (error) {
        errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV');
    }

    return data;
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw error;
  }
}

// Optimized data processing with memoization
export function processPopulationData(rawData: PopulationData[]): ProcessedData {
  if (!rawData || rawData.length === 0) {
    return {
      rawData: [],
      topStates: [],
      genderDistribution: [],
      yearlyTrends: [],
      monthlyDistribution: [],
      stateGenderGaps: [],
      insights: null,
      availableFilters: { years: [], months: [], states: [], genders: [] }
    };
  }

  // Filter out "Total" gender entries for gender-specific calculations
  const genderSpecificData = rawData.filter(item => item.gender !== 'Total');
  
  // Create lookup maps for better performance
  const stateMap = new Map<string, number>();
  const genderMap = new Map<string, number>();
  const yearGenderMap = new Map<string, number>();
  const monthMap = new Map<string, number>();
  const stateGenderMap = new Map<string, { male: number; female: number }>();

  // Single pass through data for all calculations
  for (const item of rawData) {
    // State totals (include all data)
    stateMap.set(item.state, (stateMap.get(item.state) || 0) + item.value);
    
    // Month totals (include all data)
    monthMap.set(item.month, (monthMap.get(item.month) || 0) + item.value);
  }

  // Gender-specific calculations (exclude "Total")
  for (const item of genderSpecificData) {
    // Gender totals
    genderMap.set(item.gender, (genderMap.get(item.gender) || 0) + item.value);
    
    // Year-gender trends
    const yearGenderKey = `${item.year}-${item.gender}`;
    yearGenderMap.set(yearGenderKey, (yearGenderMap.get(yearGenderKey) || 0) + item.value);
    
    // State gender gaps
    if (!stateGenderMap.has(item.state)) {
      stateGenderMap.set(item.state, { male: 0, female: 0 });
    }
    const stateGender = stateGenderMap.get(item.state)!;
    if (item.gender === 'Male') stateGender.male += item.value;
    if (item.gender === 'Female') stateGender.female += item.value;
  }

  // Process top states
  const topStates = Array.from(stateMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([state, population]) => ({ state, population }));

  // Process gender distribution
  const totalGender = Array.from(genderMap.values()).reduce((sum, val) => sum + val, 0);
  const genderDistribution = Array.from(genderMap.entries())
    .map(([gender, value]) => ({
      gender,
      value,
      percentage: totalGender > 0 ? ((value / totalGender) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.value - a.value);

  // Process yearly trends
  const yearlyTrendsMap = new Map<number, { Male: number; Female: number }>();
  Array.from(yearGenderMap.entries()).forEach(([key, value]) => {
    const [yearStr, gender] = key.split('-');
    const year = parseInt(yearStr);
    
    if (!yearlyTrendsMap.has(year)) {
      yearlyTrendsMap.set(year, { Male: 0, Female: 0 });
    }
    const yearData = yearlyTrendsMap.get(year)!;
    if (gender === 'Male') yearData.Male = value;
    if (gender === 'Female') yearData.Female = value;
  });

  const yearlyTrends = Array.from(yearlyTrendsMap.entries())
    .map(([year, genders]) => ({ year, ...genders }))
    .sort((a, b) => a.year - b.year);

  // Process monthly distribution
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyDistribution = monthOrder.map(month => ({
    month,
    value: monthMap.get(month) || 0
  }));

  // Process state gender gaps
  const stateGenderGaps = Array.from(stateGenderMap.entries())
    .map(([state, genders]) => {
      const gap = Math.abs(genders.male - genders.female);
      const total = genders.male + genders.female;
      return {
        state,
        male: genders.male,
        female: genders.female,
        gap,
        gapPercentage: total > 0 ? ((gap / total) * 100).toFixed(1) : '0.0'
      };
    })
    .sort((a, b) => b.gap - a.gap);

  // Generate insights
  const insights = generateInsightsFromProcessedData({
    topStates,
    genderDistribution,
    monthlyDistribution,
    stateGenderGaps,
    yearlyTrends,
    rawData
  });

  // Get available filters
  const availableFilters = getAvailableFiltersFromData(rawData);

  return {
    rawData,
    topStates,
    genderDistribution,
    yearlyTrends,
    monthlyDistribution,
    stateGenderGaps,
    insights,
    availableFilters
  };
}

// Optimized insights generation
function generateInsightsFromProcessedData(data: {
  topStates: Array<{ state: string; population: number }>;
  genderDistribution: Array<{ gender: string; value: number; percentage: string }>;
  monthlyDistribution: Array<{ month: string; value: number }>;
  stateGenderGaps: Array<{ state: string; male: number; female: number; gap: number; gapPercentage: string }>;
  yearlyTrends: Array<{ year: number; Male: number; Female: number }>;
  rawData: PopulationData[];
}): ProcessedData['insights'] {
  if (data.topStates.length === 0) return null;

  const totalPopulation = data.rawData.reduce((sum, item) => sum + item.value, 0);
  const peakMonth = data.monthlyDistribution.reduce((max, month) => 
    month.value > max.value ? month : max
  );
  
  const years = Array.from(new Set(data.rawData.map(d => d.year))).sort();
  const yearRange = years.length > 0 ? `${years[0]}-${years[years.length - 1]}` : 'N/A';

  return {
    totalPopulation: totalPopulation.toLocaleString(),
    topState: data.topStates[0]?.state || 'N/A',
    yearRange,
    peakMonth: peakMonth.month,
    dominantGender: data.genderDistribution[0]?.gender || 'N/A',
    insights: [
      `${data.topStates[0]?.state} leads with ${(data.topStates[0]?.population / 1000000).toFixed(1)}M projected population`,
      `${data.genderDistribution[0]?.gender} population accounts for ${data.genderDistribution[0]?.percentage}% of total projections`,
      `${peakMonth.month} shows highest projection entries across all years`,
      `${data.stateGenderGaps[0]?.state} has the largest gender gap of ${(data.stateGenderGaps[0]?.gap / 1000000).toFixed(1)}M people`,
      `Population projections span ${years.length} years from ${yearRange}`
    ]
  };
}

// Optimized filter generation
function getAvailableFiltersFromData(data: PopulationData[]): FilterOptions {
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const months = Array.from(new Set(data.map(d => d.month))).sort();
  const states = Array.from(new Set(data.map(d => d.state))).sort();
  const genders = Array.from(new Set(data.map(d => d.gender))).sort();

  return { years, months, states, genders };
}

// Optimized filtering with early termination
export function filterDataBySelection(
  data: PopulationData[],
  filters: {
    years?: number[];
    months?: string[];
    states?: string[];
    genders?: string[];
  }
): PopulationData[] {
  if (!data || data.length === 0) return [];

  // If no filters are applied, return all data
  const hasFilters = filters.years?.length || filters.months?.length || 
                    filters.states?.length || filters.genders?.length;
  
  if (!hasFilters) return data;

  return data.filter(item => {
    if (filters.years?.length && !filters.years.includes(item.year)) return false;
    if (filters.months?.length && !filters.months.includes(item.month)) return false;
    if (filters.states?.length && !filters.states.includes(item.state)) return false;
    if (filters.genders?.length && !filters.genders.includes(item.gender)) return false;
    return true;
  });
}

// Legacy functions for backward compatibility (deprecated)
export function getTopStates(data: PopulationData[], limit: number = 5) {
  console.warn('getTopStates is deprecated. Use processPopulationData instead.');
  const statePopulation = data.reduce((acc, item) => {
    acc[item.state] = (acc[item.state] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statePopulation)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([state, population]) => ({ state, population }));
}

export function getGenderDistribution(data: PopulationData[]) {
  console.warn('getGenderDistribution is deprecated. Use processPopulationData instead.');
  const genderSpecificData = data.filter(item => item.gender !== 'Total');
  const genderTotals = genderSpecificData.reduce((acc, item) => {
    acc[item.gender] = (acc[item.gender] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(genderTotals).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(genderTotals).map(([gender, value]) => ({
    gender,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  }));
}

export function getYearlyTrends(data: PopulationData[]) {
  console.warn('getYearlyTrends is deprecated. Use processPopulationData instead.');
  const genderSpecificData = data.filter(item => item.gender !== 'Total');
  const yearlyData = genderSpecificData.reduce((acc, item) => {
    const key = `${item.year}-${item.gender}`;
    acc[key] = (acc[key] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  const trends: Record<number, Record<string, number>> = {};
  
  Object.entries(yearlyData).forEach(([key, value]) => {
    const [year, gender] = key.split('-');
    const yearNum = parseInt(year);
    
    if (!trends[yearNum]) trends[yearNum] = {};
    trends[yearNum][gender] = value;
  });

  return Object.entries(trends)
    .map(([year, genders]) => ({
      year: parseInt(year),
      ...genders
    }))
    .sort((a, b) => a.year - b.year);
}

export function getMonthlyDistribution(data: PopulationData[]) {
  console.warn('getMonthlyDistribution is deprecated. Use processPopulationData instead.');
  const monthlyData = data.reduce((acc, item) => {
    acc[item.month] = (acc[item.month] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return monthOrder.map(month => ({
    month,
    value: monthlyData[month] || 0
  }));
}

export function getStateGenderGaps(data: PopulationData[]) {
  console.warn('getStateGenderGaps is deprecated. Use processPopulationData instead.');
  const genderSpecificData = data.filter(item => item.gender !== 'Total');
  const stateGenderData = genderSpecificData.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = { Male: 0, Female: 0 };
    acc[item.state][item.gender as 'Male' | 'Female'] += item.value;
    return acc;
  }, {} as Record<string, { Male: number; Female: number }>);

  return Object.entries(stateGenderData)
    .map(([state, genders]) => ({
      state,
      male: genders.Male,
      female: genders.Female,
      gap: Math.abs(genders.Male - genders.Female),
      gapPercentage: (Math.abs(genders.Male - genders.Female) / (genders.Male + genders.Female) * 100).toFixed(1)
    }))
    .sort((a, b) => b.gap - a.gap);
}

export function generateInsights(data: PopulationData[]) {
  console.warn('generateInsights is deprecated. Use processPopulationData instead.');
  const topStates = getTopStates(data, 3);
  const genderDist = getGenderDistribution(data);
  const monthlyDist = getMonthlyDistribution(data);
  const genderGaps = getStateGenderGaps(data);
  
  const totalPopulation = data.reduce((sum, item) => sum + item.value, 0);
  const peakMonth = monthlyDist.reduce((max, month) => 
    month.value > max.value ? month : max
  );
  
  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const yearRange = `${years[0]}-${years[years.length - 1]}`;

  return {
    totalPopulation: totalPopulation.toLocaleString(),
    topState: topStates[0]?.state || 'N/A',
    yearRange,
    peakMonth: peakMonth.month,
    dominantGender: genderDist[0]?.gender || 'N/A',
    insights: [
      `${topStates[0]?.state} leads with ${(topStates[0]?.population / 1000000).toFixed(1)}M projected population`,
      `${genderDist[0]?.gender} population accounts for ${genderDist[0]?.percentage}% of total projections`,
      `${peakMonth.month} shows highest projection entries across all years`,
      `${genderGaps[0]?.state} has the largest gender gap of ${(genderGaps[0]?.gap / 1000000).toFixed(1)}M people`,
      `Population projections span ${years.length} years from ${yearRange}`
    ]
  };
}

export function getAvailableFilters(data: PopulationData[]): FilterOptions {
  console.warn('getAvailableFilters is deprecated. Use processPopulationData instead.');
  return getAvailableFiltersFromData(data);
}