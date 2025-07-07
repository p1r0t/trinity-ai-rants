
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterBar = ({ categories, selectedCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Поиск по новостям..." 
          className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={
              selectedCategory === category
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            }
          >
            {category === 'all' ? 'Все' : category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
