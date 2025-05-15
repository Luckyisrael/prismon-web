import { Link } from "wouter";
import { cn } from "@/lib/utils";
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
  Activity,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  isOpen: boolean;
}

export function MobileNav({ isOpen }: MobileNavProps) {
  const { logout, user } = useAuth();
  const [location] = useLocation();
  
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
    { href: "/dashboard/docs", label: "Documentation", icon: FileCode },
    { href: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
    { href: "/dashboard/status", label: "System Status", icon: Activity },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  const renderLinkGroup = (title: string, links: typeof mainLinks) => (
    <div className="mb-3">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-1">
        {title}
      </div>
      {links.map((link) => {
        const isActive = location === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium",
              isActive
                ? "bg-primary/20 text-white border-l-2 border-primary"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
            {link.label}
            {link.label === "Analytics" && (
              <span className="ml-auto bg-primary/30 text-primary text-xs py-0.5 px-2 rounded-full">New</span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          />
          
          <motion.nav 
            id="mobile-nav"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="lg:hidden fixed top-14 left-0 w-80 bg-slate-900 border-r border-slate-800 h-[calc(100vh-3.5rem)] z-40 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="px-4 py-4 flex items-center space-x-3 border-b border-slate-800">
                <Avatar className="h-10 w-10 bg-primary/20 text-primary">
                  <AvatarFallback className="bg-primary/20 text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-white">
                    {user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-slate-400">{user?.email}</div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                {renderLinkGroup("Main", mainLinks)}
                
                <Separator className="bg-slate-800 my-3" />
                
                {renderLinkGroup("Management", managementLinks)}
                
                <Separator className="bg-slate-800 my-3" />
                
                {renderLinkGroup("Support", supportLinks)}
              </div>
              
              <div className="p-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-3 h-5 w-5 text-slate-400" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
