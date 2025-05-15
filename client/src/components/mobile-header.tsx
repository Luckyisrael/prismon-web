import { Button } from "@/components/ui/button";
import { 
  Menu, 
  User,
  Bell,
  Search,
  X,
  Plus
} from "lucide-react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export function MobileHeader({ isMobileNavOpen, setIsMobileNavOpen }: MobileHeaderProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const initials = user?.email 
    ? user.email.split("@")[0].substring(0, 2).toUpperCase() 
    : "U";

  const toggleMobileNav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  
  const getHeaderTitle = () => {
    if (location === "/dashboard") return "Dashboard";
    if (location === "/dashboard/analytics") return "Analytics";
    if (location === "/dashboard/solana") return "Solana Tools";
    if (location === "/dashboard/settings") return "Settings";
    
    return "Dashboard";
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button 
            id="mobile-menu-button" 
            variant="ghost" 
            size="icon" 
            className={cn(
              "text-slate-400 hover:text-white",
              isMobileNavOpen && "text-white bg-slate-800"
            )}
            onClick={toggleMobileNav}
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {!isSearchOpen ? (
            <div className="flex items-center">
              <span className="text-primary text-xl font-bold">Prismon</span>
              <span className="text-white text-xl font-medium">
                {location === "/dashboard" ? "Dashboard" : ""}
              </span>
            </div>
          ) : (
            <div className="flex-1 max-w-md relative">
              <Input 
                placeholder="Search..."
                className="bg-slate-800 border-slate-700 text-white pr-8 pl-3 h-9"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 text-slate-400"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isSearchOpen && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-white"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-white relative"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <div className="max-h-60 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem 
                        key={i} 
                        className="py-3 px-4 cursor-pointer hover:bg-slate-800 flex flex-col items-start"
                      >
                        <div className="font-medium">New API Call Limit Reached</div>
                        <div className="text-xs text-slate-400 mt-1">Your app "Solana Explorer" has reached 80% of its API call limit</div>
                        <div className="text-xs text-slate-500 mt-1">10 minutes ago</div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="py-2 justify-center hover:bg-slate-800">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
                <AvatarFallback className="bg-primary/20 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                className="py-2 hover:bg-slate-800 cursor-pointer"
                onClick={() => setLocation("/dashboard/settings")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="py-2 hover:bg-slate-800 cursor-pointer"
                onClick={() => setLocation("/dashboard/billing")}
              >
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem 
                className="py-2 hover:bg-slate-800 cursor-pointer text-red-400"
                onClick={() => logout()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
