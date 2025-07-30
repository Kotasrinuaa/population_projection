'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import SidebarFilters from '@/components/SidebarFilters';
import InsightsPanel from '@/components/InsightsPanel';
import SimpleChart from '@/components/charts/SimpleChart';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { usePopulationData } from '@/hooks/usePopulationData';

export default function Dashboard() {
  const {
    rawData,
    processedData,
    filteredData,
    filteredProcessedData,
    loading,
    error,
    selectedFilters,
    setSelectedFilters,
    refetch
  } = usePopulationData();

  // Use filtered data if available, otherwise use full processed data
  const displayData = filteredProcessedData || processedData;

  // Memoized calculations for better performance
  const totalPopulation = useMemo(() => {
    if (!displayData?.rawData) return 0;
    return displayData.rawData.reduce((sum, item) => sum + item.value, 0);
  }, [displayData?.rawData]);

  const malePopulation = useMemo(() => {
    if (!displayData?.rawData) return 0;
    return displayData.rawData
      .filter(d => d.gender === 'Male')
      .reduce((sum, item) => sum + item.value, 0);
  }, [displayData?.rawData]);

  const femalePopulation = useMemo(() => {
    if (!displayData?.rawData) return 0;
    return displayData.rawData
      .filter(d => d.gender === 'Female')
      .reduce((sum, item) => sum + item.value, 0);
  }, [displayData?.rawData]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-300 max-w-md">{error}</p>
          <button 
            onClick={refetch} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300">Loading population data...</p>
          <p className="text-gray-500 text-sm">Processing {rawData.length.toLocaleString()} records...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!displayData || !displayData.rawData.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
          <p className="text-gray-300">No population data found to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen">
        {/* Sidebar */}
        <SidebarFilters
          availableFilters={displayData.availableFilters}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Population Projection Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive analysis of population trends across states, years, and demographics
              </p>
              {(selectedFilters.years.length > 0 || selectedFilters.months.length > 0 || 
                selectedFilters.states.length > 0 || selectedFilters.genders.length > 0) && (
                <p className="text-blue-400 text-sm mt-2">
                  Showing filtered results • {filteredData.length.toLocaleString()} records
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Total records: {displayData.rawData.length.toLocaleString()}
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">Overview</TabsTrigger>
                <TabsTrigger value="demographics" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">Demographics</TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Projected Population"
                    value={`${(totalPopulation / 1000000).toFixed(1)}M`}
                    subtitle="Across filtered data"
                    icon={Users}
                    gradient="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600"
                  />
                  <StatCard
                    title="Leading State"
                    value={displayData.topStates[0]?.state || 'N/A'}
                    subtitle={`${((displayData.topStates[0]?.population || 0) / 1000000).toFixed(1)}M population`}
                    icon={MapPin}
                    gradient="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600"
                  />
                  <StatCard
                    title="Male Population"
                    value={`${(malePopulation / 1000000).toFixed(1)}M`}
                    subtitle={totalPopulation > 0 ? `${((malePopulation / totalPopulation) * 100).toFixed(1)}% of total` : '0% of total'}
                    icon={TrendingUp}
                    gradient="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600"
                  />
                  <StatCard
                    title="Female Population"
                    value={`${(femalePopulation / 1000000).toFixed(1)}M`}
                    subtitle={totalPopulation > 0 ? `${((femalePopulation / totalPopulation) * 100).toFixed(1)}% of total` : '0% of total'}
                    icon={Activity}
                    gradient="bg-gradient-to-r from-pink-600 via-pink-700 to-rose-600"
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SimpleChart 
                    data={displayData.topStates} 
                    title="Top 10 States by Population"
                  />
                  <SimpleChart 
                    data={displayData.genderDistribution} 
                    title="Gender Distribution"
                  />
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SimpleChart 
                    data={displayData.monthlyDistribution} 
                    title="Population Distribution by Month"
                  />
                  <SimpleChart 
                    data={displayData.stateGenderGaps.slice(0, 10)} 
                    title="States with Largest Gender Gaps"
                  />
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {displayData.insights && <InsightsPanel insights={displayData.insights} />}
              </TabsContent>
            </Tabs>
            
            {/* Scroll-triggered section at the end */}
            <div className="mt-16">
              <div 
                className="h-screen bg-black flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to bottom, transparent, black)',
                  minHeight: '100vh'
                }}
              >
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Population Projection Analysis Complete
                  </h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Thank you for exploring our comprehensive population projection dashboard. 
                    The data provides valuable insights into demographic trends and population patterns.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}