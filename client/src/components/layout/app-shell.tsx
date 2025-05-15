import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { MobileHeader } from "../mobile-header";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();

  // Close mobile nav when clicking outside or changing routes
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mobile-nav') && !target.closest('#mobile-menu-button')) {
        setIsMobileNavOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Handle window resize to auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsSidebarCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setIsSidebarCollapsed(false);
      }
    };
    
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar - hidden on mobile */}
      <Sidebar 
        className="hidden lg:flex" 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Mobile header */}
      <MobileHeader 
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />
      
      {/* Mobile Navigation - only visible when toggled */}
      <MobileNav isOpen={isMobileNavOpen} />
      
      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        !isMobile && isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <main className="flex-1 overflow-y-auto bg-slate-950 pt-16 lg:pt-0 pb-16 lg:pb-0">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
