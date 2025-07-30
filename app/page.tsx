import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/25">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Population Projection
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore comprehensive population trends across states, years, and demographics 
              with interactive visualizations and data-driven insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
              <div className="p-3 bg-blue-900/50 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trend Analysis</h3>
              <p className="text-gray-400">
                Track population growth patterns across multiple years and identify emerging trends.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl hover:shadow-green-500/10 transition-all">
              <div className="p-3 bg-green-900/50 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Demographics</h3>
              <p className="text-gray-400">
                Analyze gender distribution and demographic patterns across different states.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
              <div className="p-3 bg-purple-900/50 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Charts</h3>
              <p className="text-gray-400">
                Visualize data through multiple chart types with filtering and sorting capabilities.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}