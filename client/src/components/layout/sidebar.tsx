import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { 
  LayoutGrid, 
  BarChart, 
  Coins, 
  Settings, 
  LogOut, 
  Users,
  CreditCard,
  HelpCircle,
  FileCode,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ className, isCollapsed: propIsCollapsed, onToggleCollapse }: SidebarProps) {
  const { logout, user } = useAuth();
  const [location] = useLocation();
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  
  // Use either controlled (from props) or uncontrolled (local) state
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : localIsCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setLocalIsCollapsed(!localIsCollapsed));

  const initials = user?.email 
    ? user.email.split("@")[0].substring(0, 2).toUpperCase() 
    : "U";

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
    { href: "/dashboard/solana", label: "Solana Tools", icon: Coins },
  ];
  
  const managementLinks = [
    { href: "/dashboard/users", label: "User Management", icon: Users },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ];
  
  const supportLinks = [
    { href: "https://lucky-israel.gitbook.io/prismon-docs", label: "Documentation", icon: FileCode },
    { href: "/dashboard/support", label: "Help & Support", icon: HelpCircle },
    { href: "/dashboard/status", label: "System Status", icon: Activity },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  const renderNavLinks = (links: typeof mainLinks) => {
    return links.map((link) => {
      const isActive = location === link.href;
      const Icon = link.icon;
      
      return (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
            isActive
              ? "bg-primary/20 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
          <span className="truncate">{link.label}</span>
          {link.label === "Analytics" && (
            <span className="ml-auto bg-primary/30 text-primary text-xs py-0.5 px-2 rounded-full">New</span>
          )}
        </Link>
      );
    });
  };

  return (
    <aside className={cn(
      "bg-slate-900 border-r border-slate-800 h-full flex flex-col transition-all duration-300 overflow-hidden", 
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className={cn(
          "flex items-center transition-opacity",
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <span className="text-primary text-xl font-bold">Prismon</span>
          <span className="text-white text-xl font-medium">Dashboard</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-white hover:bg-slate-800 ml-auto"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </Button>
      </div>
      
      <div className="px-3 py-4 flex items-center space-x-3 border-b border-slate-800">
        <Avatar className="h-9 w-9 bg-primary/20 text-primary">
          <AvatarFallback className="bg-primary/20 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className={cn(
          "transition-opacity overflow-hidden",
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <div className="text-sm font-medium text-white truncate">
            {user?.email?.split('@')[0]}
          </div>
          <div className="text-xs text-slate-400 truncate">{user?.email}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
        <div className={cn("px-3", isCollapsed ? "text-center" : "")}>
          <div className={cn(
            "text-xs font-medium text-slate-500 uppercase tracking-wider mb-1",
            isCollapsed ? "opacity-0 h-0" : "opacity-100"
          )}>
            Main
          </div>
          <nav className="space-y-1">
            {renderNavLinks(mainLinks)}
          </nav>
        </div>
        
        <Separator className="bg-slate-800" />
        
        <div className={cn("px-3", isCollapsed ? "text-center" : "")}>
          <div className={cn(
            "text-xs font-medium text-slate-500 uppercase tracking-wider mb-1",
            isCollapsed ? "opacity-0 h-0" : "opacity-100"
          )}>
            Management
          </div>
          <nav className="space-y-1">
            {renderNavLinks(managementLinks)}
          </nav>
        </div>
        
        <Separator className="bg-slate-800" />
        
        <div className={cn("px-3", isCollapsed ? "text-center" : "")}>
          <div className={cn(
            "text-xs font-medium text-slate-500 uppercase tracking-wider mb-1",
            isCollapsed ? "opacity-0 h-0" : "opacity-100"
          )}>
            Support
          </div>
          <nav className="space-y-1">
            {renderNavLinks(supportLinks)}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className={cn(
            "justify-start text-slate-300 hover:bg-slate-800 hover:text-white transition-all",
            isCollapsed ? "w-10 px-2.5" : "w-full"
          )}
          onClick={() => logout()}
        >
          <LogOut className={cn("h-5 w-5 text-slate-400", isCollapsed ? "" : "mr-3")} />
          <span className={cn(
            "transition-opacity",
            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
}