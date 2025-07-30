'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface BarChartProps {
  data: any[];
  title: string;
}

export default function PopulationBarChart({ data, title }: BarChartProps) {
  const [sortBy, setSortBy] = useState<string>('total');

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'male':
        return (b.male || b.Male || 0) - (a.male || a.Male || 0);
      case 'female':
        return (b.female || b.Female || 0) - (a.female || a.Female || 0);
      default:
        return (b.population || b.total || (b.male + b.female) || 0) - (a.population || a.total || (a.male + a.female) || 0);
    }
  }).slice(0, 10);

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="total" className="text-gray-200 focus:bg-gray-700">Total</SelectItem>
            <SelectItem value="male" className="text-gray-200 focus:bg-gray-700">Male</SelectItem>
            <SelectItem value="female" className="text-gray-200 focus:bg-gray-700">Female</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="opacity-50" />
            <XAxis 
              type="number"
              tick={{ fontSize: 12, fill: '#D1D5DB' }}
              axisLine={{ stroke: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <YAxis 
              type="category"
              dataKey="state"
              tick={{ fontSize: 10, fill: '#D1D5DB' }}
              axisLine={{ stroke: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              width={80}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [`${(value / 1000000).toFixed(2)}M`, name]}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend wrapperStyle={{ color: '#D1D5DB' }} />
            {sortBy === 'total' ? (
              <Bar 
                dataKey="population" 
                fill="#A78BFA" 
                radius={[0, 4, 4, 0]}
                name="Population"
              />
            ) : (
              <>
                <Bar 
                  dataKey="male" 
                  fill="#60A5FA" 
                  radius={[0, 4, 4, 0]}
                  name="Male"
                />
                <Bar 
                  dataKey="female" 
                  fill="#F472B6" 
                  radius={[0, 4, 4, 0]}
                  name="Female"
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}