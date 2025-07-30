'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface LineChartProps {
  data: any[];
  title: string;
  states?: string[];
}

export default function PopulationLineChart({ data, title, states = [] }: LineChartProps) {
  const [selectedState, setSelectedState] = useState<string>('all');

  const filteredData = selectedState === 'all' 
    ? data 
    : data.filter(item => item.state === selectedState);

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
        {states.length > 0 && (
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state} className="text-gray-200 focus:bg-gray-700">{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="opacity-50" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12, fill: '#D1D5DB' }}
              axisLine={{ stroke: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#D1D5DB' }}
              axisLine={{ stroke: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, 'Population']}
              labelFormatter={(label) => `Year: ${label}`}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend wrapperStyle={{ color: '#D1D5DB' }} />
            <Line 
              type="monotone" 
              dataKey="Male" 
              stroke="#60A5FA" 
              strokeWidth={3}
              dot={{ fill: '#60A5FA', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#60A5FA', strokeWidth: 2, fill: '#1E40AF' }}
            />
            <Line 
              type="monotone" 
              dataKey="Female" 
              stroke="#F472B6" 
              strokeWidth={3}
              dot={{ fill: '#F472B6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F472B6', strokeWidth: 2, fill: '#BE185D' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}