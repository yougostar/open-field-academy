import { useState } from "react";
import { Search, User, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TopbarProps {
  onSearch: (query: string) => void;
}

export const Topbar = ({ onSearch }: TopbarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-lg bg-card/95">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 md:ml-64">
        {/* Search bar */}
        <div className="flex-1 max-w-xl ml-12 md:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, topics..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
