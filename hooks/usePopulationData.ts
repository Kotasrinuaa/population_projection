import { useState, useEffect, useMemo, useCallback } from 'react';
import { parseCSV, processPopulationData, filterDataBySelection, PopulationData, ProcessedData } from '@/utils/populationUtils';

interface UsePopulationDataReturn {
  rawData: PopulationData[];
  processedData: ProcessedData | null;
  filteredData: PopulationData[];
  filteredProcessedData: ProcessedData | null;
  loading: boolean;
  error: string | null;
  selectedFilters: {
    years: number[];
    months: string[];
    states: string[];
    genders: string[];
  };
  setSelectedFilters: (filters: any) => void;
  refetch: () => void;
}

export function usePopulationData(): UsePopulationDataReturn {
  const [rawData, setRawData] = useState<PopulationData[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    years: [] as number[],
    months: [] as string[],
    states: [] as string[],
    genders: [] as string[]
  });

  // Load data function
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/data/population_projection.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      setRawData(parsedData);
      
      // Process all data once
      const processed = processPopulationData(parsedData);
      setProcessedData(processed);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!processedData?.rawData) return [];
    return filterDataBySelection(processedData.rawData, selectedFilters);
  }, [processedData?.rawData, selectedFilters]);

  // Memoized processed filtered data
  const filteredProcessedData = useMemo(() => {
    if (!filteredData.length) return null;
    return processPopulationData(filteredData);
  }, [filteredData]);

  // Refetch function
  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    rawData,
    processedData,
    filteredData,
    filteredProcessedData,
    loading,
    error,
    selectedFilters,
    setSelectedFilters,
    refetch
  };
} 