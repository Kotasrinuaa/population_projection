'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterOptions } from '@/utils/populationUtils';
import { Filter, X, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface SidebarFiltersProps {
  availableFilters: FilterOptions;
  selectedFilters: {
    years: number[];
    months: string[];
    states: string[];
    genders: string[];
  };
  onFiltersChange: (filters: any) => void;
}

export default function SidebarFilters({ 
  availableFilters, 
  selectedFilters, 
  onFiltersChange 
}: SidebarFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleYearChange = (year: number, checked: boolean) => {
    const newYears = checked 
      ? [...selectedFilters.years, year]
      : selectedFilters.years.filter(y => y !== year);
    onFiltersChange({ ...selectedFilters, years: newYears });
  };

  const handleMonthChange = (month: string) => {
    const newMonths = selectedFilters.months.includes(month)
      ? selectedFilters.months.filter(m => m !== month)
      : [...selectedFilters.months, month];
    onFiltersChange({ ...selectedFilters, months: newMonths });
  };

  const handleStateChange = (state: string, checked: boolean) => {
    const newStates = checked 
      ? [...selectedFilters.states, state]
      : selectedFilters.states.filter(s => s !== state);
    onFiltersChange({ ...selectedFilters, states: newStates });
  };

  const handleGenderChange = (gender: string, checked: boolean) => {
    const newGenders = checked 
      ? [...selectedFilters.genders, gender]
      : selectedFilters.genders.filter(g => g !== gender);
    onFiltersChange({ ...selectedFilters, genders: newGenders });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      years: [],
      months: [],
      states: [],
      genders: []
    });
  };

  const hasActiveFilters = selectedFilters.years.length > 0 || 
                          selectedFilters.months.length > 0 || 
                          selectedFilters.states.length > 0 || 
                          selectedFilters.genders.length > 0;

  return (
    <div className={`h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isCollapsed ? <Filter className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="mt-3 w-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          {/* Year Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                Years
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {availableFilters.years.map(year => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox
                      id={`year-${year}`}
                      checked={selectedFilters.years.includes(year)}
                      onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                      className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label 
                      htmlFor={`year-${year}`} 
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {year}
                    </label>
                  </div>
                ))}
              </div>
              {selectedFilters.years.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFilters.years.map(year => (
                    <Badge key={year} variant="secondary" className="bg-blue-600 text-white text-xs">
                      {year}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Month Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" />
                Months
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleMonthChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select months" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {availableFilters.months.map(month => (
                    <SelectItem 
                      key={month} 
                      value={month}
                      className="text-gray-200 focus:bg-gray-700"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFilters.months.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFilters.months.map(month => (
                    <Badge key={month} variant="secondary" className="bg-green-600 text-white text-xs">
                      {month}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleMonthChange(month)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* State Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                States
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableFilters.states.slice(0, 10).map(state => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`state-${state}`}
                      checked={selectedFilters.states.includes(state)}
                      onCheckedChange={(checked) => handleStateChange(state, checked as boolean)}
                      className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label 
                      htmlFor={`state-${state}`} 
                      className="text-sm text-gray-300 cursor-pointer truncate"
                    >
                      {state}
                    </label>
                  </div>
                ))}
              </div>
              {selectedFilters.states.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFilters.states.map(state => (
                    <Badge key={state} variant="secondary" className="bg-purple-600 text-white text-xs">
                      {state.length > 8 ? `${state.substring(0, 8)}...` : state}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gender Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-400" />
                Gender
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {availableFilters.genders.map(gender => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={selectedFilters.genders.includes(gender)}
                    onCheckedChange={(checked) => handleGenderChange(gender, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                  />
                  <label 
                    htmlFor={`gender-${gender}`} 
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {gender}
                  </label>
                </div>
              ))}
              {selectedFilters.genders.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFilters.genders.map(gender => (
                    <Badge key={gender} variant="secondary" className="bg-pink-600 text-white text-xs">
                      {gender}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}