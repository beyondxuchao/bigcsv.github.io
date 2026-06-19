import React, { useState } from 'react';
import { Search, RotateCcw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportDropdownButton } from './ExportDropdownButton';

import { Filter, FilterGroup } from '../types/filter';
import { Column } from '../types/column';
import { FilterRow } from './FilterRow';

interface QueryBuilderProps {
  columns: Column[];
  onQueryChange: (filterGroup: FilterGroup) => void;
  onExport?: (format: string) => void;
  onReset?: () => void;
}

const initFilterGroup: FilterGroup = {
  filters: [
    {
      id: '1',
      column: '',
      operator: 'contains',
      value: '',
      columnType: 'text',
    },
  ],
  conjunction: 'AND',
}

const emptyFilterGroup: FilterGroup = {
  filters: [],
  conjunction: 'AND',
};

export function QueryBuilder({ columns, onQueryChange, onExport, onReset }: QueryBuilderProps) {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(initFilterGroup);

  const handleFilterUpdate = (index: number, updatedFilter: Filter) => {
    const newFilters = [...filterGroup.filters];
    newFilters[index] = updatedFilter;
    setFilterGroup({ ...filterGroup, filters: newFilters });
  };

  const handleFilterRemove = (index: number) => {
    const newFilters = filterGroup.filters.filter((_, i) => i !== index);
    setFilterGroup({ ...filterGroup, filters: newFilters });
  };

  const handleFilterAdd = () => {
    setFilterGroup({
      ...filterGroup,
      filters: [
        ...filterGroup.filters,
        {
          id: String(Date.now()),
          column: '',
          operator: 'contains',
          value: '',
          columnType: 'text',
        },
      ],
    });
  };

  const handleSearch = () => {
    const validFilters = filterGroup.filters.filter(
      (f) =>
        f.column &&
        (f.operator === 'isNull' || f.operator === 'isNotNull' || f.value)
    );
    if (validFilters.length > 0) {
      onQueryChange({ ...filterGroup, filters: validFilters });
    }
  };

  const handleReset = () => {
    setFilterGroup(initFilterGroup);
    onQueryChange(emptyFilterGroup);
  };

  const hasValidFilters = filterGroup.filters.some(
    (f) => f.column && (f.operator === 'isNull' || f.operator === 'isNotNull' || f.value)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-6">
      <div className="space-y-4">
        {filterGroup.filters.map((filter, index) => (
          <FilterRow
            key={filter.id}
            filter={filter}
            columns={columns}
            onUpdate={(updatedFilter) =>
              handleFilterUpdate(index, updatedFilter)
            }
            onRemove={() => handleFilterRemove(index)}
            isOnly={filterGroup.filters.length === 1}
            onAdd={handleFilterAdd}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <select
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
          value={filterGroup.conjunction}
          onChange={(e) =>
            setFilterGroup({
              ...filterGroup,
              conjunction: e.target.value as 'AND' | 'OR',
            })
          }
        >
          <option value="AND">Match ALL filters (AND)</option>
          <option value="OR">Match ANY filter (OR)</option>
        </select>

        <div className="flex flex-wrap gap-2 items-center">
          {onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <FileText className="h-4 w-4" />
              New File
            </Button>
          )}
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!hasValidFilters}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button 
            onClick={handleSearch}
            className="flex items-center gap-2"
            disabled={!hasValidFilters}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Apply Filters</span>
          </Button>
          
          {onExport && (
            <>
              <div className="h-6 w-px bg-gray-300 mx-1" />
              <ExportDropdownButton
                onExport={onExport}
                disabled={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
