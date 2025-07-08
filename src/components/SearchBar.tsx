import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Поиск новостей...", className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <Search size={20} />
          </Button>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};