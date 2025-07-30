import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Calendar, MapPin, BarChart3 } from 'lucide-react';

interface InsightsPanelProps {
  insights: {
    totalPopulation: string;
    topState: string;
    yearRange: string;
    peakMonth: string;
    dominantGender: string;
    insights: string[];
  };
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const insightIcons = [TrendingUp, Users, Calendar, MapPin, BarChart3];

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
          <BarChart3 className="h-6 w-6 text-blue-400" />
          Data Insights & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-blue-200">Total Population</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.totalPopulation}</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg border border-green-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-200">Leading State</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.topState}</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-lg border border-purple-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-purple-200">Peak Month</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.peakMonth}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Key Findings</h3>
          <div className="space-y-3">
            {insights.insights.map((insight, index) => {
              const Icon = insightIcons[index % insightIcons.length];
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                  <div className="p-2 bg-gray-700 rounded-full shadow-sm ring-1 ring-gray-600">
                    <Icon className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-gray-200 leading-relaxed">{insight}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 border-blue-700/50">
            Years: {insights.yearRange}
          </Badge>
          <Badge variant="secondary" className="bg-pink-900/50 text-pink-200 border-pink-700/50">
            Dominant: {insights.dominantGender}
          </Badge>
          <Badge variant="secondary" className="bg-green-900/50 text-green-200 border-green-700/50">
            States Analyzed: Multiple
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}