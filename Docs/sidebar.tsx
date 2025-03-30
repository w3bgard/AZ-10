
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight, ChevronLeft, User, Search, List, Star, Zap, BookOpen, Menu, Settings, Heart, BarChart2, Headphones, Film, Cpu } from "lucide-react";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState("MUSIC");
  const location = useLocation();
  const currentPath = location.pathname;
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const categories = [
    { id: "MUSIC", label: "MUSIC", icon: Headphones },
    { id: "MOVIE", label: "MOVIE", icon: Film },
    { id: "TECH", label: "TECH", icon: Cpu },
  ];
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/rating-reviews", label: "Rating & Reviews", icon: Star },
    { path: "/artists", label: "Artists", icon: List },
    { path: "/challenges", label: "Challenges", icon: Zap },
    { path: "/blogs", label: "Blogs", icon: BookOpen },
    { path: "/search", label: "Search", icon: Search },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const utilityItems = [
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/stats", label: "Stats", icon: BarChart2 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className={`sidebar ${expanded ? "sidebar-expanded" : "sidebar-collapsed"} hidden md:block`}>
      <div className="flex flex-col h-full glassmorphism">
        {/* Logo, Title and Category Selection */}
        <div className="border-b border-white/10">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 h-16">
            <div className="flex items-center space-x-2">
              {expanded ? (
                <Link to="/" className="flex items-center space-x-2">
                  <span className="font-bold text-2xl text-white">AZ10</span>
                  <span className="font-semibold text-lg text-brand-red">{activeCategory}</span>
                </Link>
              ) : (
                <Link to="/" className="font-bold text-xl flex justify-center text-white">
                  A
                </Link>
              )}
            </div>
            
            {expanded && (
              <button
                onClick={toggleSidebar}
                className="text-muted-foreground hover:text-white transition-colors hover:scale-105"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            {!expanded && (
              <button
                onClick={toggleSidebar}
                className="absolute -right-4 top-4 bg-card/50 border border-white/10 rounded-full p-1 text-muted-foreground hover:text-white transition-colors hover:scale-105 neo-blur"
              >
                <Menu size={16} />
              </button>
            )}
          </div>
          
          {/* Category selector */}
          {expanded && (
            <div className="px-4 pb-4">
              <div className="flex space-x-1 overflow-x-auto scrollbar-none">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-300 text-sm ${
                      activeCategory === category.id
                        ? "bg-brand-red text-white shadow-glow-sm"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <category.icon size={14} className="mr-1.5" />
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-none">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || 
                (item.path !== "/" && currentPath.startsWith(item.path));
                
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 hover:translate-x-1 ${
                    isActive 
                      ? "bg-brand-red/20 text-brand-red backdrop-blur-sm border border-brand-red/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={`flex-shrink-0 ${isActive ? "animate-pulse" : ""}`} />
                  {expanded && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {expanded && (
            <div className="mt-8 px-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Utilities
              </h3>
              <nav className="space-y-1">
                {utilityItems.map((item) => {
                  const isActive = currentPath === item.path || 
                    (item.path !== "/" && currentPath.startsWith(item.path));
                    
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 hover:translate-x-1 ${
                        isActive 
                          ? "bg-brand-red/20 text-brand-red backdrop-blur-sm border border-brand-red/20"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon size={18} className={`flex-shrink-0 ${isActive ? "animate-pulse" : ""}`} />
                      {expanded && <span className="ml-3 text-sm">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {expanded ? (
            <div className="flex items-center space-x-2">
              <Headphones size={20} className="text-brand-red" />
              <div className="text-xs">
                <p className="text-white font-medium">AZ10 Community</p>
                <p className="text-muted-foreground">© 2024</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Headphones size={20} className="text-brand-red" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
