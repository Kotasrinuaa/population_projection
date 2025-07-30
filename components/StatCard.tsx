import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  textColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient,
  textColor = "text-white"
}: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden border border-gray-800 ${gradient} shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${textColor} opacity-90`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${textColor}`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-xs ${textColor} opacity-75`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20`}>
            <Icon className={`h-8 w-8 ${textColor}`} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg" />
      </CardContent>
    </Card>
  );
}