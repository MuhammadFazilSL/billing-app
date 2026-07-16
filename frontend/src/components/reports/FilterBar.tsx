import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  placeholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ searchQuery, onSearchChange, onSearch, placeholder = 'Search...' }) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full pl-10 pr-4 rounded-md border bg-background"
        />
      </div>
      <button type="submit" className="h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
        Search
      </button>
    </form>
  );
};
