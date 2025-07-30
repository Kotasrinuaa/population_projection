'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

interface SimpleChartProps {
  data: any[];
  title: string;
  type?: 'bar' | 'line' | 'donut';
}

export default function SimpleChart({ data, title, type = 'bar' }: SimpleChartProps) {
  // Memoized data processing for better performance
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
      // Handle different data structures
      if (item.value !== undefined) {
        return { 
          label: item.gender || item.month || item.year || 'Unknown', 
          value: item.value 
        };
      }
      if (item.population !== undefined) {
        return { 
          label: item.state || 'Unknown', 
          value: item.population 
        };
      }
      if (item.gap !== undefined) {
        return { 
          label: item.state || 'Unknown', 
          value: item.gap 
        };
      }
      if (item.Male !== undefined && item.Female !== undefined) {
        return { 
          label: `Year ${item.year}`, 
          value: item.Male + item.Female 
        };
      }
      return { label: 'Unknown', value: 0 };
    }).filter(item => item.value > 0); // Filter out zero values
  }, [data]);

  const maxValue = useMemo(() => {
    if (processedData.length === 0) return 0;
    return Math.max(...processedData.map(item => item.value));
  }, [processedData]);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-gray-400">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processedData.length === 0) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-gray-400">
            No valid data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 space-y-2 overflow-y-auto">
          {processedData.slice(0, 10).map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-300 truncate" title={item.label}>
                  {item.label}
                </div>
                <div className="flex-1 bg-gray-800 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-300 text-right">
                  {(item.value / 1000000).toFixed(1)}M
                </div>
              </div>
            );
          })}
          {processedData.length > 10 && (
            <div className="text-center text-gray-500 text-sm pt-2">
              Showing top 10 of {processedData.length} items
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 