'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AreaChartProps {
  data: any[];
  title: string;
}

export default function PopulationAreaChart({ data, title }: AreaChartProps) {
  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F472B6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F472B6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
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
              formatter={(value: number, name: string) => [`${(value / 1000000).toFixed(2)}M`, name]}
              labelFormatter={(label) => `Year: ${label}`}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Legend wrapperStyle={{ color: '#D1D5DB' }} />
            <Area
              type="monotone"
              dataKey="Male"
              stackId="1"
              stroke="#60A5FA"
              fill="url(#colorMale)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Female"
              stackId="1"
              stroke="#F472B6"
              fill="url(#colorFemale)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}